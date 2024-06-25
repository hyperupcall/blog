+++
title = "Render LaTeX with KaTex in Hugo Blog"
slug = "render-latex-with-katex-in-hugo-blog"
author = "Edwin Kofler"
date = 2018-09-15T11:26:16-07:00
categories = ["update", "tutorial"]
tags = ["LaTeX", "KaTeX"]
+++


This method will NO LONGER WORK on recent version of Hugo. I recommend reading [this post](https://mertbakir.gitlab.io/hugo/math-typesetting-in-hugo) for up-to-date instructions.

Just recently, I added support to render LaTeX math equations with the rendering engine [KaTeX](https://katex.org/) for this blog. I chose it over MathJax because it performs [substantially faster](https://www.intmath.com/cg5/katex-mathjax-comparison.php). To integrate KaTeX in my Hugo blog, I used the [Mmark](https://github.com/mmarkdown/mmark) Markdown processor rather than Hugo's default [Blackfriday](https://github.com/russross/blackfriday) processor.

There are three steps to follow so you can write LaTeX in markdown for KaTeX to use.

1. Create a KateX partial
2. Integrate the KateX partial in your header or footer element
3. Activate the KaTeX partial in the markdown file

What is a partial?
[Hugo partials](https://gohugo.io/templates/partials/) are just single page templates. Think of them like `html` files that you can insert into any of your pages.

## Create a KaTex partial

To get KaTex to work, you must import their JavaScript and CSS files. We're going to do this using Hugo partials. To do this, create a `katex.html` partial in your `layouts/partials` directory of your Hugo project. In this file, just import the [required files](https://katex.org/docs/browser.html).

```html
<!-- CSS File -->
<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/katex@0.10.0-rc.1/dist/katex.min.css"
	integrity="sha384-D+9gmBxUQogRLqvARvNLmA9hS2x//eK1FhVb9PiU86gmcrBrJAQT8okdJ4LMp2uv"
	crossorigin="anonymous"
/>

<!-- JS Fle -->
<script
	defer
	src="https://cdn.jsdelivr.net/npm/katex@0.10.0-rc.1/dist/katex.min.js"
	integrity="sha384-483A6DwYfKeDa0Q52fJmxFXkcPCFfnXMoXblOkJ4JcA8zATN6Tm78UNL72AKk+0O"
	crossorigin="anonymous"
></script>
```

## Integrating the KaTeX partial

After creating the `katex.html` partial file, now you have to include it in some element that is common in all your built site files, such as a header or footer element.

I'm going to add it in my footer partial. So, create a `footer.html` partial in your `layouts/partials` directory, if you don't have one already. Since I have a theme, I copied the theme's `footer.html` partial and pasted it into my own `footer.html` partial. Note that your `footer.html` partial will override the theme's.

Then, add the following to the `footer.html` partial, outside of the body tag, but inside the html tag.

```html
{{ if .Params.katex}}{{ partial "katex.html" . }}{{ end }}
```

My entire `footer.html` file ended up looking like the following.

```html
<footer class="footer">
  <!-- Footer contents hidden for brevity -->
</footer>
</div>

</body>
{{ if .Params.katex}}{{ partial "katex.html" . }}{{ end }}
</html>
```

Everything else except that one line was copied and pasted from my theme's `footer.html` file.

By adding the `katex.html` partial to the `footer.html` partial conditionally, now you can specify if you want to use KaTex for each markdown file separately. That way, you don't have to serve KaTeX JS and CSS files for blog posts that don't actually use them.

## Using the KaTex partial

Now, using the KaTex partial is trivial. In your Hugo [front matter](https://gohugo.io/content-management/front-matter/) (of any markdown file), add the following lines.

```yaml
---
katex: true
markup: 'mmark'
---
```

Now, your `katex.html` partial will be used, which allows KaTex to render your LaTeX. Additionally, this activates the Mmark parsing engine, which is already integrated with Hugo. Using the Mmark parsing engine prevents [the problems](https://gohugo.io/content-management/formats/#issues-with-markdown) the default Blackfriday parsing engine has with parsing LaTex in markdown.

## Writing LaTex in Markdown for Mmark

Now you can write LaTex in markdown files! :tada:
It's intuitive writing LateX in markdown using the Mmark processor. You can display equations on the block level or inline. Note that you must use Mmark, or this will not work. Using the default Blackfriday processor will make all of these inline (using a single dollar sign as a delimiter will not work).

### Display Block

Type equation on a single line, with top and bottom spaces. Use double dollar signs as delimiter.

```md
The following

$$\int_{a}^{b} x^2 dx$$

Is an integral
```

The following

$$\int_{a}^{b} x^2 dx$$

Is an integral

### Display Inline

Type the equation as per usual, nothing extra needed. Use double dollar signs as delimiter.

```md
Integrate $$\int x^3 dx$$
```

Integrate $$\int x^3 dx$$

<br/>

It turns out, using KaTeX rather than MathJax was easier than I thought. I hope you found this helpful :smile:
