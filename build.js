#!/usr/bin/env node
// @ts-check
import fs from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'

import * as marked from 'marked'
import handlebars from 'handlebars'
import TOML from 'smol-toml'
import * as htmlparser2 from "htmlparser2";
import * as cheerio from 'cheerio'
import { execa } from 'execa'

const Filename = new URL(import.meta.url).pathname
const Dirname = path.dirname(Filename)
const Config = {
	buildJsFile: path.join(Dirname, 'build.js'),
	layoutDir: path.join(Dirname, 'layouts'),
	pagesDir: path.join(Dirname, 'pages'),
	partialsDir: path.join(Dirname, 'partials'),
	postsDir: path.join(Dirname, 'posts'),
	staticDir: path.join(Dirname, 'static'),
	outputDir: path.join(Dirname, 'build'),
}
const Options = {} // These are set in the next block.

{
	const helpText = `${path.basename(Filename)} <build | serve | check> [options]
  Options:
    -h, --help
    --quiet
    --clean
	`

	const { values, positionals } = parseArgs({
		allowPositionals: true,
		options: {
			clean: { type: 'boolean' },
			quiet: { type: 'boolean' },
			help: { type: 'boolean', alias: 'h' },
		}
	})
	Options.clean = values.clean
	Options.quiet = values.quiet

	if (!positionals[0]) {
		console.error(helpText)
		console.error('No command provided.')
		process.exit(1)
	}

	if (values.help) {
		console.info(helpText)
		process.exit(0)
	}

	{
		for (const partialFilename of await fs.readdir(Config.partialsDir)) {
			const partialContent = await fs.readFile(path.join(Config.partialsDir, partialFilename), 'utf-8')
			handlebars.registerPartial(path.parse(partialFilename).name, partialContent)
		}
	}

	if (positionals[0] === 'build') {
		await cliBuild()
	} else if (positionals[0] === 'serve') {
		await cliServe()
	} else if (positionals[0] === 'check') {
		await cliCheck()
	} else {
		console.error(helpText)
		console.error(`Unknown command: ${positionals[0]}`)
		process.exit(1)
	}
}

async function cliBuild() {
	if (Options.clean) {
		console.info('Clearing build directory...')
		try {
			await fs.rm(Config.outputDir, { recursive: true })
		} catch (err) {
			if (err.code !== 'ENOENT') throw err
		}
	}

	// Generate pages.
	console.info('Generating pages...')
	for (const pageEntry of await fs.readdir(Config.pagesDir, { withFileTypes: true })) {
		if (pageEntry.name.endsWith('.js')) continue

		console.info(`Generating page ${pageEntry.name}...`)
		if (pageEntry.isFile()) {
			const filename = pageEntry.name
			const inputFile = path.join(Config.pagesDir, filename)
			const { html, frontmatter } = await toHtml(inputFile)
			const outputFile = filename === 'index.html' ? path.join(Config.outputDir, filename) : path.join(Config.outputDir, path.parse(filename).name, 'index.html')
			await fs.mkdir(path.dirname(outputFile), { recursive: true })
			await fs.writeFile(outputFile, html)
		} else if (pageEntry.isDirectory()) {
			const dirname = pageEntry.name
			const inputDir = path.join(Config.pagesDir, dirname)
			throw new Error(`Cannot handle directory case: ${inputDir}`)
		}
	}

	// Generate posts.
	console.info('Generating posts...')
	for (const postEntry of await fs.readdir(Config.postsDir, { withFileTypes: true })) {
		console.info(`Generating post ${postEntry.name}...`)
		if (postEntry.isFile()) {
			const filename = postEntry.name
			const inputFile = path.join(Config.pagesDir, filename)
			throw new Error(`Cannot handle directory case: ${inputFile}`)
		} else if (postEntry.isDirectory()) {
			// if (['.md', '.html'].path.parse(postEntry).ext) {
			// 	return
			// }
			const postDirname = postEntry.name
			const inputFile = await getMarkdownFile(path.join(Config.postsDir, postDirname))
			const { html, frontmatter } = await toHtml(inputFile)
			const outputFile = path.join(Config.outputDir, 'posts', postDirname, 'index.html')
			await fs.mkdir(path.dirname(outputFile), { recursive: true })
			await fs.writeFile(outputFile, html)
		}
	}

	await copyStaticFiles()

	console.log('Done.')

	async function copyStaticFiles() {
		try {
			await fs.cp(Config.staticDir, Config.outputDir, { recursive: true })
		} catch (err) {
			if (err.code !== 'ENOENT') throw err
		}
	}

	async function getMarkdownFile(/** @type {string} */ dir) {
		let markdownFile = ''
		for (const filename of await fs.readdir(dir)) {
			if (filename.endsWith('.md')) {
				if (markdownFile.length > 0) {
					throw new Error(`Multiple markdown files found in ${dir}. Each post directory should only have one markdown file`)
				}
				markdownFile = path.join(dir, filename)
			}
		}

		if (!markdownFile) {
			throw new Error(`No markdown files found in ${dir}`)
		}

		return markdownFile
	}

	async function toHtml(/** @type {string} */ inputFile) {
		let html = ''
		let frontmatter = {}
		if (inputFile.endsWith('.md')) {
			let markdown = await fs.readFile(inputFile, 'utf8')
			markdown = markdown.replace(/^\+\+\+$(.*)\+\+\+$/ms, (_, toml) => {
				frontmatter = TOML.parse(toml)
				return ''
			})
			const layoutFile = path.join(Config.layoutDir, 'default.hbs' || frontmatter.layout)
			const layout = await fs.readFile(layoutFile, 'utf8')
			html = marked.parse(markdown)
			html = handlebars.compile(layout, {
				noEscape: true,
			})({
				__body__: html,
			})
		} else if (inputFile.endsWith('.html')) {
			const javascriptFile = path.join(path.dirname(inputFile), path.parse(inputFile).name + '.js')
			let module = {}
			try {
				module = await import(javascriptFile)
			} catch (err) {
				if (err.code !== 'ERR_MODULE_NOT_FOUND') throw err
			}
			html = await fs.readFile(inputFile, 'utf8')
			html = handlebars.compile(html, {
				noEscape: true,
			})((await module?.TemplateVariables?.(Config)) ?? {})
		} else if (inputFile.endsWith('.js')) {
			const contentFile = path.join(path.dirname(inputFile), path.parse(inputFile).name + '.html')
			try {
				await fs.stat(contentFile)
			} catch (err) {
				if (err.code === 'ENOENT') {
					throw new Error(`Expected to find content file ${path.basename(contentFile)} adjacent to JavaScript file: ${inputFile}`)
				}
			}
		} else {
			throw new Error(`Cannot handle file with type of ${path.parse(inputFile).ext}: ${inputFile}`)
		}
		if (inputFile.includes('categories')) {
			console.log('in', html)
		}
		// Note that Cheerio may wrap the html in <html>, <head>, and <body> tags.
		const $ = cheerio.load(html)
		// for (const el2 of $('a')) {
		// 	const el = $(el2)
		// 	const href = el.attr('href') ?? ''
		// 	// if ((href.startsWith('/') || href.startsWith('./'))
		// 	// 	&& (href !== '/' && href !== './')) {
		// 	// 	el.attr('href', el.attr('href') + '.html')
		// 	// }
		// 	if (href.endsWith('.md')) {
		// 		el.attr('href', el.attr('href').replace(/\.md$/, '/index.html'))
		// 	}
		// }
		html = $.html()
		if (inputFile.includes('categories')) {
			console.log('out', html)
		}

		return { html, frontmatter }
	}
}

async function cliServe() {
	const browserSync = await import('browser-sync')
	const chokidar = await import('chokidar')

	let bs = null

	initBrowserSync()
	function initBrowserSync() {
		bs = browserSync.create()
		bs.init({
			online: false,
			notify: false,
			open: false,
			minify: false,
			ui: false,
			server: Config.outputDir,
			// files: [Config.pagesDir, Config.postsDir]
			...Options.quiet ? { logLevel: 'silent' } : {},
			callbacks: {
				ready(err, bs) {
					if (err) throw err

					if (Options.quiet) {
						const port = bs.getOption('port')
						console.info(`Server at http://localhost:${port}`)
					}
				}
			}
		})
	}

	const watcher = chokidar.watch([
		Config.layoutDir,
		Config.pagesDir,
		Config.partialsDir,
		Config.postsDir,
		Config.staticDir,
	], {
		persistent: true,
		ignoreInitial: true,
	})
	watcher
		.on('add', async (path) => {
			await cliBuild()
			bs.reload()
		})
		.on('change', async (path) => {
			await cliBuild()
			bs.reload()

			if (path.endsWith('.css')) {
				bs.reload(path)
			}
		})
		.on('error', (error) => {
			console.log(`Watcher error: ${error}`)
		})

	process.on('SIGINT', () => {
		bs.exit()
		watcher.close().then(() => {
			console.info('Cleaned up.')
			process.exit(0)
		})
	})

	await cliBuild()
}

async function cliCheck() {
	try {
		await execa({
			stdout: 'inherit',
			stderr: 'inherit',
		})`lychee --offline ${Dirname}`
	} catch (err) {
		if (err.exitCode !== 0) {
			console.log('Failed to run lychee')
		}
	}

}

// bs.watch('**/*.md', {
// 	persistent: true,
// 	ignoreInitial: true,
// 	ignored: ['**/node_modules/**', `${Config.outputDir}/**`]
// })
// .on('add', (() => {
// 	cliBuild()
// }))
// .on('change', () => {
// 	console.log('change')
// 	cliBuild()
// 	bs.reload()
// })
// .on('error', (error) => {
// 	console.log(`Watcher error: ${error}`)
// })
