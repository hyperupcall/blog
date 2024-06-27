export async function TemplateVariables(Config, Helpers) {
	const posts = await Helpers.getPosts(Config)

	return {
		posts
	}
}
