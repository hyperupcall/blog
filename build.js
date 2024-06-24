#!/usr/bin/env node
// @ts-check
import fs from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'

import { execa } from 'execa'
import TOML from 'smol-toml'
import handlebars from 'handlebars'
import * as cheerio from 'cheerio'
import * as htmlparser2 from "htmlparser2";
import { Marked } from 'marked'
import { markedEmoji } from "marked-emoji";
import { markedHighlight } from 'marked-highlight'
import { gemoji } from 'gemoji'
import { codeToHtml } from 'shiki'
import hljs from 'highlight.js';

const Filename = new URL(import.meta.url).pathname
const Dirname = path.dirname(Filename)
const Options = {} // These are set in the next block.
const Emojis = await (async () => {
	const emojis = {}
	for (const entry of gemoji) {
		for (const slug of entry.names) {
			emojis[slug] = entry.emoji
		}
	}

	return emojis
})()
const Config = {
	buildJsFile: path.join(Dirname, 'build.js'),
	layoutDir: path.join(Dirname, 'layouts'),
	pagesDir: path.join(Dirname, 'pages'),
	partialsDir: path.join(Dirname, 'partials'),
	postsDir: path.join(Dirname, 'posts'),
	staticDir: path.join(Dirname, 'static'),
	outputDir: path.join(Dirname, 'build'),
}

// TODO: Formatter
{
	const helpText = `${path.basename(Filename)} <build | serve | new | check> [options]
  Options:
    -h, --help
    --verbose
    --clean
	`

	const { values, positionals } = parseArgs({
		allowPositionals: true,
		options: {
			clean: { type: 'boolean' },
			verbose: { type: 'boolean' },
			help: { type: 'boolean', alias: 'h' },
		}
	})
	Options.clean = values.clean
	Options.verbose = values.verbose

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
	} else if (positionals[0] === 'new') {
		await cliNew()
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
	for (const pageEntry of await fs.readdir(Config.pagesDir, { withFileTypes: true })) {
		const inputDir = path.join(Config.pagesDir, pageEntry.name)
		if (!pageEntry.isDirectory()) throw new Error(`Expected directory; found non-directory: ${inputDir}`)

		console.info(`Generating for page ${pageEntry.name}...`)
		const inputFile = await getInputFile(inputDir, pageEntry.name)
		const { html, frontmatter } = await toHtml(inputFile)
		const outputFile = pageEntry.name === 'index' ? path.join(Config.outputDir, 'index.html') : path.join(Config.outputDir, pageEntry.name, 'index.html')
		await fs.mkdir(path.dirname(outputFile), { recursive: true })
		await fs.writeFile(outputFile, html)
	}

	// Generate posts.
	for (const yearEntry of await fs.readdir(Config.postsDir, { withFileTypes: true })) {
		const yearDir = path.join(Config.postsDir, yearEntry.name)
		if (!yearEntry.isDirectory()) throw new Error(`Expected directory; found non-directory: ${yearDir}`)

		for (const postEntry of await fs.readdir(yearDir, { withFileTypes: true })) {
			const inputDir = path.join(yearDir, postEntry.name)
			if (!postEntry.isDirectory()) throw new Error(`Expected directory; found non-directory: ${inputDir}`)

			console.info(`Generating for post ${postEntry.name}...`)
			const inputFile = await getInputFile(inputDir, postEntry.name)
			const { html, frontmatter } = await toHtml(inputFile)
			const outputFile = path.join(Config.outputDir, 'posts', postEntry.name, 'index.html')
			await fs.mkdir(path.dirname(outputFile), { recursive: true })
			await fs.writeFile(outputFile, html)
		}
	}

	await copyStaticFiles()

	console.info('Done.')

	async function copyStaticFiles() {
		try {
			await fs.cp(Config.staticDir, Config.outputDir, { recursive: true })
		} catch (err) {
			if (err.code !== 'ENOENT') throw err
		}
	}

	async function getInputFile(/** @type {string} */ dir, /** @type {string} */ dirname) {
		try {
			const htmlFile = path.join(dir, `${dirname}.html`)
			await fs.stat(htmlFile)
			return htmlFile
		} catch (err) {
			if (err.code !== 'ENOENT') throw err
		}

		try {
			const mdFile = path.join(dir, `${dirname}.md`)
			await fs.stat(mdFile)
			return mdFile
		} catch (err) {
			if (err.code !== 'ENOENT') throw err
		}

		throw new Error(`No content files (with the correct filename) found in ${dir}`)
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
			// TODO: marked-katex-extension
			const marked = new Marked(
				markedHighlight({
					langPrefix: 'hljs language-',
					// async: true,
					highlight(code, lang, info) {
						const language = hljs.getLanguage(lang) ? lang : 'plaintext';
						return hljs.highlight(code, { language }).value;

						// return new Promise((resolve, reject) => {
						// 	codeToHtml(code, {
						// 		lang: language,
						// 		theme: 'vitesse-dark'
						// 	}).then((html) => {
						// 		resolve(html)
						// 	}).catch((err) => {
						// 		reject(err)
						// 	})
						// })
					}
				})
			)
			marked.use({
				renderer: {
					link(href, title, text) {
						const isLocalLink = href.startsWith(`/`) || href.startsWith('.')
						if (isLocalLink) {
							return html
						} else {
							// https://github.com/markedjs/marked/discussions/2982#discussioncomment-6979586
							const html = marked.Renderer.prototype.link.call(this, href, title, text)
							return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ')
						}

					}
				}
			})
			// marked.use()
			marked.use(markedEmoji({
				// @ts-expect-error
				emojis: Emojis,
				renderer: (token) => {
					return token.emoji
				}
			}))
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
		// if (inputFile.includes('categories')) {
		// 	console.log('in', html)
		// }
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
			// console.log('out', html)
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
			...Options.verbose ? {} : { logLevel: 'silent' },
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

async function cliNew() {

}

async function cliCheck() {
	try {
		await execa({
			stdout: 'inherit',
			stderr: 'inherit',
		})`lychee --offline ${Dirname}`
	} catch (err) {
		if (err.exitCode !== 2) {
			throw err
		}
	}
}
