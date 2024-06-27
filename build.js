#!/usr/bin/env node
// @ts-check
import fs from 'node:fs/promises'
import path from 'node:path'
import util from 'node:util'

import { Temporal } from 'temporal-polyfill'
import { execa } from 'execa'
import TOML from 'smol-toml'
import handlebars from 'handlebars'
import * as htmlparser2 from "htmlparser2";
import markdownit from 'markdown-it'
import { full as markdownEmoji } from 'markdown-it-emoji'
import Shiki from '@shikijs/markdown-it'
import katex from 'katex'

const markedKatex = markedKatexFactory()
const ShikiInstance = await Shiki({
	themes: {
		light: 'github-light',
		dark: 'github-dark',
	}
})
const MarkdownItInstance = (() => {
	const md = markdownit({
		html: true,
		typographer: true,
		linkify: true
	})
	md.use(ShikiInstance)
	md.use(markdownEmoji)
	md.use(markedKatex, {
		strict: false
	})
	return md
})()
const Filename = new URL(import.meta.url).pathname
const Dirname = path.dirname(Filename)
const Options = {}
const Config = {
	buildJsFile: path.join(Dirname, 'build.js'),
	contentDir: path.join(Dirname, 'content'),
	layoutDir: path.join(Dirname, 'layouts'),
	partialsDir: path.join(Dirname, 'partials'),
	staticDir: path.join(Dirname, 'static'),
	outputDir: path.join(Dirname, 'build'),
}
const Helpers = { getPosts: helperGetPosts }

{
	const helpText = `${path.basename(Filename)} <build | serve | check> [options]
  Options:
    -h, --help
    --verbose
    --clean
`

	const { values, positionals } = util.parseArgs({
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

	await generateContent()
	await copyStaticFiles()

	console.info('Done.')
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
		Config.contentDir,
		Config.layoutDir,
		Config.partialsDir,
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
			console.error(`Watcher error: ${error}`)
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
		if (err.exitCode !== 2) {
			throw err
		}
	}
}

async function copyStaticFiles() {
	try {
		await fs.cp(Config.staticDir, Config.outputDir, { recursive: true })
	} catch (err) {
		if (err.code !== 'ENOENT') throw err
	}
}

function validateFrontmatter(/** @type {string} */ inputFile, /** @type {Record<string, any>} */ frontmatter) {
	for (const property in frontmatter) {
		if (!['title', 'slug', 'author', 'date', 'categories', 'tags'].includes(property)) {
			throw new Error(`Invalid frontmatter property of "${property}" in file: ${inputFile}`)
		}
	}
}

async function generateContent() {
	await walk(Config.contentDir)
	async function walk(/** @type {string} */ dir) {
		for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
			if (entry.isDirectory()) {
				const subdir = path.join(dir, entry.name)
				await walk(subdir)
			} else if (entry.isFile()) {
				const inputFile = path.join(dir, entry.name)
				await handleFile(inputFile)
			}
		}
	}
}

async function handleFile(/** @type {string} */ inputFile) {
	const contentType = (() => {
		let p = path.relative(Config.contentDir, inputFile)
		return p.slice(0, p.indexOf('/'))
	})()
	const outputUri = (() => {
		let p = path.relative(Config.contentDir, inputFile)
		if (p.startsWith('pages')) {
			p = p.slice('pages'.length)
		} else if (p.startsWith('posts')) {
			p = p.slice('posts/'.length)
			p = p.slice(p.indexOf('/') + 1)
			p = `posts/${p}`
		}
		return p
	})()

	console.info(`Generating for ${outputUri}...`)
	if (inputFile.endsWith('md')) {
		let markdown = await fs.readFile(inputFile, 'utf8')
		const { html, frontmatter } = (() => {
			let frontmatter = {}
			markdown = markdown.replace(/^\+\+\+$(.*)\+\+\+$/ms, (_, toml) => {
				frontmatter = TOML.parse(toml)
				return ''
			})
			validateFrontmatter(inputFile, frontmatter)

			return { html: MarkdownItInstance.render(markdown), frontmatter }
		})()
		const layoutFile = path.join(Config.layoutDir, frontmatter.layout ?? 'default.hbs')
		const layout = await fs.readFile(layoutFile, 'utf8')
		const templatedHtml = handlebars.compile(layout, {
			noEscape: true,
		})({
			__title__: frontmatter.title,
			__body__: html,
		})

		const filename = path.basename(outputUri)
		const dirname = path.basename(path.dirname(outputUri))
		let outputFile = ''
		if (path.parse(filename).name === dirname) {
			// For `$contentDir/categories/categories.md`, the output should be
			// written to `$buildDir/categories/index.md`.
			const relPart = path.dirname(path.dirname(outputUri))
			outputFile = path.join(Config.outputDir, relPart, frontmatter.slug ?? dirname, 'index.html')
		} else {
			// For `$contentDir/index.md`, the output should be written to
			// `$buildDir/index.md`.
			outputFile = path.join(Config.outputDir, outputUri)
		}
		await writeFile(outputFile, templatedHtml)
	} else if (inputFile.endsWith('.html') || inputFile.endsWith('.xml')) {
		const javascriptFile = path.join(path.dirname(inputFile), path.parse(inputFile).base + '.js')
		let module = {}
		try {
			module = await import(javascriptFile)
		} catch (err) {
			if (err.code !== 'ERR_MODULE_NOT_FOUND') throw err
		}

		let html = await fs.readFile(inputFile, 'utf8')
		if (module.isDynamic) {
			const slugs = (await module?.GenerateSlugs(Config, Helpers)) ?? []
			for (const slug of slugs) {
				html = handlebars.compile(html, {
					noEscape: true,
				})(await module?.TemplateVariables?.(Config, Helpers, slug) ?? {})
				const filename = path.basename(outputUri)
				const dirname = path.basename(path.dirname(outputUri))
				let outputFile = ''
				if (path.parse(filename).name === dirname) {
					// For `$contentDir/categories/categories.md`, the output should be
					// written to `$buildDir/categories/index.md`.
					const relPart = path.dirname(path.dirname(outputUri))
					outputFile = path.join(Config.outputDir, relPart, dirname, slug.slug, 'index.html')
				} else {
					// For `$contentDir/index.md`, the output should be written to
					// `$buildDir/index.md`.
					// outputFile = path.join(Config.outputDir, relPart, slug.slug)
				}
				await writeFile(outputFile, html)
			}
		} else {
			html = handlebars.compile(html, {
				noEscape: true,
			})((await module?.TemplateVariables?.(Config, Helpers, {})) ?? {})
			const filename = path.basename(outputUri)
			const dirname = path.basename(path.dirname(outputUri))
			let outputFile = ''
			if (path.parse(filename).name === dirname) {
				// For `$contentDir/categories/categories.md`, the output should be
				// written to `$buildDir/categories/index.md`.
				const relPart = path.dirname(path.dirname(outputUri))
				outputFile = path.join(Config.outputDir, relPart, dirname, 'index.html')
			} else {
				// For `$contentDir/index.md`, the output should be written to
				// `$buildDir/index.md`.
				outputFile = path.join(Config.outputDir, outputUri)
			}
			await writeFile(outputFile, html)
		}
	} else if (inputFile.endsWith('.js')) {
		const contentFile = path.join(path.dirname(inputFile), path.parse(inputFile).name)
		try {
			await fs.stat(contentFile)
		} catch (err) {
			if (err.code === 'ENOENT') {
				throw new Error(`Expected to find content file ${path.basename(contentFile)} adjacent to JavaScript file: ${inputFile}`)
			}
		}
		return
	} else {
		// Ignore other file types like '.tex' and '.png'.
	}

	async function writeFile(/** @type {string} */ outputFile, /** @type {string} */ html) {
		await fs.mkdir(path.dirname(outputFile), { recursive: true })
		await fs.writeFile(outputFile, html)
		if (contentType === 'posts') {
			await fs.cp(path.dirname(inputFile), path.dirname(outputFile), { recursive: true })
			await fs.rm(path.join(path.dirname(outputFile), path.basename(inputFile)))
		}
	}

	console.info(`Generated ${outputUri}`)
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

// https://github.com/xtthaop/markdown-it-katex/blob/master/index.js
function markedKatexFactory() {
	return function markedKatex(md, options) {
		options = options || {};

		// set KaTeX as the renderer for markdown-it-simplemath
		var katexInline = function (latex) {
			options.displayMode = false;
			try {
				return katex.renderToString(latex, options);
			}
			catch (error) {
				if (options.throwOnError) { console.error(error); }
				return latex;
			}
		};

		var inlineRenderer = function (tokens, idx) {
			return katexInline(tokens[idx].content);
		};

		var katexBlock = function (latex) {
			options.displayMode = true;
			try {
				return "<p>" + katex.renderToString(latex, options) + "</p>";
			}
			catch (error) {
				if (options.throwOnError) { console.error(error); }
				return latex;
			}
		}

		var blockRenderer = function (tokens, idx) {
			return katexBlock(tokens[idx].content) + '\n';
		}

		md.inline.ruler.after('escape', 'math_inline', math_inline);
		md.block.ruler.after('blockquote', 'math_block', math_block, {
			alt: ['paragraph', 'reference', 'blockquote', 'list']
		});
		md.renderer.rules.math_inline = inlineRenderer;
		md.renderer.rules.math_block = blockRenderer;
	};

	// Test if potential opening or closing delimieter
	// Assumes that there is a "$" at state.src[pos]
	function isValidDelim(state, pos) {
		var prevChar, nextChar,
			max = state.posMax,
			can_open = true,
			can_close = true;

		prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1;
		nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1;

		// Check non-whitespace conditions for opening and closing, and
		// check that closing delimeter isn't followed by a number
		if (prevChar === 0x20/* " " */ || prevChar === 0x09/* \t */ ||
			(nextChar >= 0x30/* "0" */ && nextChar <= 0x39/* "9" */)) {
			can_close = false;
		}
		if (nextChar === 0x20/* " " */ || nextChar === 0x09/* \t */) {
			can_open = false;
		}

		return {
			can_open: can_open,
			can_close: can_close
		};
	}

	function math_inline(state, silent) {
		var start, match, token, res, pos, esc_count;

		if (state.src[state.pos] !== "$") { return false; }

		res = isValidDelim(state, state.pos);
		if (!res.can_open) {
			if (!silent) { state.pending += "$"; }
			state.pos += 1;
			return true;
		}

		// First check for and bypass all properly escaped delimieters
		// This loop will assume that the first leading backtick can not
		// be the first character in state.src, which is known since
		// we have found an opening delimieter already.
		start = state.pos + 1;
		match = start;
		while ((match = state.src.indexOf("$", match)) !== -1) {
			// Found potential $, look for escapes, pos will point to
			// first non escape when complete
			pos = match - 1;
			while (state.src[pos] === "\\") { pos -= 1; }

			// Even number of escapes, potential closing delimiter found
			if (((match - pos) % 2) == 1) { break; }
			match += 1;
		}

		// No closing delimter found.  Consume $ and continue.
		if (match === -1) {
			if (!silent) { state.pending += "$"; }
			state.pos = start;
			return true;
		}

		// Check if we have empty content, ie: $$.  Do not parse.
		if (match - start === 0) {
			if (!silent) { state.pending += "$$"; }
			state.pos = start + 1;
			return true;
		}

		// Check for valid closing delimiter
		res = isValidDelim(state, match);
		if (!res.can_close) {
			if (!silent) { state.pending += "$"; }
			state.pos = start;
			return true;
		}

		if (!silent) {
			token = state.push('math_inline', 'math', 0);
			token.markup = "$";
			token.content = state.src.slice(start, match);
		}

		state.pos = match + 1;
		return true;
	}

	function math_block(state, start, end, silent) {
		var firstLine, lastLine, next, lastPos, found = false, token,
			pos = state.bMarks[start] + state.tShift[start],
			max = state.eMarks[start]

		if (pos + 2 > max) { return false; }
		if (state.src.slice(pos, pos + 2) !== '$$') { return false; }

		pos += 2;
		firstLine = state.src.slice(pos, max);

		if (silent) { return true; }
		if (firstLine.trim().slice(-2) === '$$') {
			// Single line expression
			firstLine = firstLine.trim().slice(0, -2);
			found = true;
		}

		for (next = start; !found;) {

			next++;

			if (next >= end) { break; }

			pos = state.bMarks[next] + state.tShift[next];
			max = state.eMarks[next];

			if (pos < max && state.tShift[next] < state.blkIndent) {
				// non-empty line with negative indent should stop the list:
				break;
			}

			if (state.src.slice(pos, max).trim().slice(-2) === '$$') {
				lastPos = state.src.slice(0, max).lastIndexOf('$$');
				lastLine = state.src.slice(pos, lastPos);
				found = true;
			}

		}

		state.line = next + 1;

		token = state.push('math_block', 'math', 0);
		token.block = true;
		token.content = (firstLine && firstLine.trim() ? firstLine + '\n' : '')
			+ state.getLines(start + 1, next, state.tShift[start], true)
			+ (lastLine && lastLine.trim() ? lastLine : '');
		token.map = [start, state.line];
		token.markup = '$$';
		return true;
	}
}

async function helperGetPosts(Config) {
	const posts = []
	for (const year of await fs.readdir(path.join(Config.contentDir, 'posts'))) {
		for (const post of await fs.readdir(path.join(Config.contentDir, 'posts', year))) {
			const file = await getInputFile(path.join(Config.contentDir, 'posts', year, post), post)
			let content = await fs.readFile(file, 'utf-8')
			let frontmatter = {}
			content = content.replace(/^\+\+\+$(.*)\+\+\+$/ms, (_, toml) => {
				frontmatter = TOML.parse(toml)
				return ''
			})
			const slug = frontmatter.slug || post
			const date = Temporal.PlainDateTime.from(frontmatter.date.toISOString())
			const dateNice = `${date.year}.${date.month}.${date.day}`
			posts.push({ uri: `${year}/${post}`, frontmatter, slug, dateNice })
		}
	}

	return posts
}

// TODO: marked-katex-extension
// const marked = new Marked(
// 	markedHighlight({
// 		langPrefix: 'hljs language-',
// 		// async: true,
// 		highlight(code, lang, info) {
// 			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
// 			return hljs.highlight(code, { language }).value;

// 			// return new Promise((resolve, reject) => {
// 			// 	codeToHtml(code, {
// 			// 		lang: language,
// 			// 		theme: 'vitesse-dark'
// 			// 	}).then((html) => {
// 			// 		resolve(html)
// 			// 	}).catch((err) => {
// 			// 		reject(err)
// 			// 	})
// 			// })
// 		}
// 	})
// )
// marked.use({
// 	renderer: {
// 		link(href, title, text) {
// 			const isLocalLink = href.startsWith(`/`) || href.startsWith('.')
// 			if (isLocalLink) {
// 				return html
// 			} else {
// 				// https://github.com/markedjs/marked/discussions/2982#discussioncomment-6979586
// 				const html = marked.Renderer.prototype.link.call(this, href, title, text)
// 				return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ')
// 			}

// 		}
// 	}
// })
// marked.use(markedEmoji({
// 	// @ts-expect-error
// 	emojis: Emojis,
// 	renderer: (token) => token.emoji
// }))
// // @ts-expect-error
//
// const Emojis = await (async () => {
// 	const emojis = {}
// 	for (const entry of gemoji) {
// 		for (const slug of entry.names) {
// 			emojis[slug] = entry.emoji
// 		}
// 	}
// 	return emojis
// })()
