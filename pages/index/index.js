import fs from 'node:fs/promises'
import path from 'node:path'

export async function TemplateVariables(Config) {
	const posts = []
	for (const year of await fs.readdir(Config.postsDir)) {
		for (const post of await fs.readdir(path.join(Config.postsDir, year))) {
			posts.push({ uri: `${year}/${post}`, slug: post })
		}
	}

	return {
		posts
	}
}
