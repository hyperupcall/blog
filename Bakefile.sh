# shellcheck shell=bash

task.prettier() {
	./node_modules/.bin/prettier --write .
}

task.generate() {
	local -a dirs=(
		''
		posts/new-blog
		posts/render-latex-with-katex-in-hugo-blog
		posts/fibonacci-equation-using-pascals-triangle-part-1
		posts/fibonacci-equation-using-pascals-triangle-part-2
		posts/creating-website-for-robotics-club
		posts/front-end-web-dev-a-years-reflection
		posts/fiddling-with-ubuntu-server-images
		posts/fixing-my-internal-network
		posts/terminal-automation-with-expect
		posts/semantic-hotkeys
		posts/umpire-method
	)

	for dir in "${dirs[@]}"; do
		if [ -z "$dir" ]; then
			route='posts'
		else
			route=$dir
		fi

		mkdir -p "./$dir"
		cat > "./$dir/index.html" <<EOF
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="canonical" href="https://edwinkofler.com/$route" />
		<meta http-equiv="refresh" content="0; url=https://edwinkofler.com/$route" />
		<title>Redirecting...</title>
		<script>
			window.location.href = 'https://edwinkofler.com/$route/'
		</script>
	</head>
	<body>
		<p>
			If you are not redirected automatically, click
			<a href="https://edwinkofler.com/$route/">here</a>
		</p>
	</body>
</html>
EOF
	done
}
