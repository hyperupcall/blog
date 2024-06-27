# Documentation for `build.js`

Wedding myself to an external static site generator solution is a poor use of my time and limits the degree to which I can customize my website. `build.js` solves that because it only does what I need, exactly how I want it, and its customization is not constrained by the (different) APIs available to a "plugin".

## Plans

- Add `format` subcommand
- Format the output HTML, CSS, etc.
- Add async / improve performance
- Only rebuild changed files watch mode
- Some codebloks have different tabs vs spaces
-`new` subcommand for making new templates

## Directory Structure

Nothing here is out of the ordinary.

### `build/`

Where output files are written to.

### `content/`

User-generated content. There are several variants:

#### `pages/`

Contains directories and files that each represent an individual page. For example, the directory `/pages/about` represents `/about/index.html` while the file `pages/index.xml` represents `/index.xml`.

#### `posts/`

Contains subdirectories with a dirname of either (1) a year (ex. `2005`) or (2) the value `drafts`. The subdirectories of those subdirectories represent an individual page (ex. `posts/2023/oppenheimer-movie-review`). Drafts are automatically shown when running the development server and automatically hidden when building the blog, unless indicated otherwise by the `--show-drafts` command-line flag.

#### `til/`

#### `papers/`

### `layouts/`

Handlebars templates that are applied to all pages and posts. Individual pages and posts can specify a particular template in the frontmatter using the `layout` property.

### `partials/`

Handlebars templates that can be used in any HTML file.

### `static/`

These assets are copied directly to the build directory without processing.

## Page and Post Handling

Pages and posts (like the aforementioned `/pages/about` and `posts/2023/oppenheimer-movie-review`) have a particular directory structure.

The directory must have a "content file" with the same name as the directory name (ex. `/pages/about/about.md` or `/pages/about/about.html`). A JavaScript file with the same name (ex. `/pages/about/about.js`) is treated specially; exporting functions allows for customizing behavior.

All other files are copied over, unprocessed.

## Supported Formats

For now, `.html`, `xml`, and `.md` files are supported.

## JavaScript Customization

- `isDynamic`
- `GenerateSlugs()`
- `TemplateVariables()`
