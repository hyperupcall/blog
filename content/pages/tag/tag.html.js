
export const isDynamic = true
export async function GenerateSlugs(Config, Helpers) {
	const posts = await Helpers.getPosts(Config)

	let tags = {}
	for (const post of posts) {
		for (const tag of post.frontmatter.tags || []) {
			if (tag in tags) {
				tags[tag] += 1
			} else {
				tags[tag] = 1
			}
		}
	}

	const tagsArr = Object.keys(tags).map(tag => {
		return {
			slug: tag,
			count: tags[tag]
		}
	})
	return tagsArr
}

export async function TemplateVariables(Config, Helpers, { slug, count }) {
	const posts = await Helpers.getPosts(Config)

	let filteredPosts = []
	for (const post of posts) {
		if ((post.frontmatter.tags ?? []).includes(slug)) {
			filteredPosts.push(post)
		}
	}
	return {
		tag: slug,
		posts: filteredPosts
	}
}
