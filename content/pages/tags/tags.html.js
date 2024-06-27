export async function TemplateVariables(Config, Helpers) {
	const posts = await Helpers.getPosts(Config)

	let tags = {}
	for (const post of posts) {
		for (const tag of post.frontmatter.tags ?? []) {
			if (tag in tags) {
				tags[tag] += 1
			} else {
				tags[tag] = 1
			}
		}
	}

	return {
		tags
	}
}
