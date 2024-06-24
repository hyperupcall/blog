import fs from 'node:fs/promises'

export async function TemplateVariables(Config) {
	return {
		posts: await fs.readdir(Config.postsDir),
	}
}
