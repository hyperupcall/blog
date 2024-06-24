import fs from 'node:fs/promises'

export async function TemplateVariables(Config) {
	return {
		title: 'Categories',
		categories: await fs.readdir(Config.postsDir),
	}
}
