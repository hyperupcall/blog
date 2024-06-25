import fs from 'node:fs/promises'
import path from 'node:path'

export async function TemplateVariables(Config, helpers) {
	const posts = await helpers.getPosts(Config)

	return {
		posts
	}
}
