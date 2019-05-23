+++
title = "Web Development: My First Year Reflection"
slug = "web-development-first-year-reflection"
author = "Edwin Kofler"
date = 2019-04-27T07:23:39-07:00
categories = []
tags = []
katex = false
draft = true
+++

So I was reintroduced to programming during the fall of 2017. I was learning Java in my AP Computer Science A class. The class was another one of those supposed "college-level" "advanced placement" (AP) classes, which actually became really fun near the end. You see, I was finishing up a really fun [final project](https://github.com/EanKeen/word-finder) (written in Java). It was basically an anagram finder, with a few extra features (including local multiplayer).

Because it was so fun, I wanted to create a larger programming project. Some project that people can look at without downloading anything. Naturally, I realized the web was perfect for this. No need to download anything - people can see your program just by opening up a link!

I did have a little experience with html and css, but that was ~~six~~ [3 years ago](https://www.khanacademy.org/computer-programming/project-travel-webpage/5930419250659328). Very basic knowledge. I had an application idea in mind, but wasn't sure if it was possible to code it with web technologies. I knew for a fact though that I despised Java Swing.

## My Idea

My first project idea was a flashcard application that I wanted to look as good as [Quizlet](https://quizlet.com), but had as much functionality as [Anki](https://apps.ankiweb.net). So I began to create a mockup.
![Pascal's Triangle](../image/web-dev-a-year-later/sigag-mockup.png)

Keep in mind, the only other program I created at this point is a terminal-based [anagram finder](https://github.com/EanKeen/word-finder). It's somewhat silly brainstorming a substantially more complex project in retrospect, but I think it helped motivate me.

Whilst brainstorming, I realized I need to know the technologies and tools to enable me to build this app. I came across [Electron](https://electronjs.org), which, in a nutshell, allows you to create your app with HTML/CSS/JS. I don't remember why I decided to use Electron rather than creating an actual website, but I made the choice.

## Failure to Implement Initial Idea

I thought it was kind of funny that I just 'decided' to create some desktop app with web technologies when I had nil experience. Luckily, I found amazing video series about Electron.

This is where I learned about using node, electron, and npm. All that beginner stuff.

Everything was super foreign to me because I didn't know JavaScript. I didn't even let myself change the standard Electron boilerplate since I was afraid I could break (and not know how to fix) the app. I used Git as a VCS and knew I could rollback any changes if I needed to.

After a few weeks, I was able to create a [lame sidebar menu](https://github.com/eankeen/Baeuda/tree/a05e8ee7c62ea0b44e6a29af07b723c463fd6485). Huzzah!

At that point I realized that I needed to learn more before talking this huge "flashcard project". *D'oh!* Right then and there I decided to build a pomodoro timer to give me the experience I needed.

## Pomodoro Timer

A pomodoro timer switches the duration it counts down at. Typically, its counts down for 25 minutes, then 5 minutes, and repeats. Sometimes longer breeks (such as 10 minutes) after 5 or so work durations.

I called this smaller project [Sigag](https://github.com/EanKeen/sigag). Starting the project was a bit easier since I already used Electron (and npm) previously.

This was the app that taught me how to create a user interface that didn't look like absolute crap. The progressions in quality are quite noticeable from the third to the fourth iteration.

![Pascal's Triangle](../image/web-dev-a-year-later/sigag-ui-development.png)

After some iterations of the shape and position of the text, buttons, and sliders, something finally clicked. Naturally, I observed other sites, and mimicked the parts I liked most. Eventually, I opted to remove most color, since I couldn't find any good color combinations. It could look better, but the improvements over each iteration is noticeable.

Before I was even able to finish a MVP for this pomodoro application, my attention drifted to another application idea.

## Yet another app idea

You see, I took chemistry the summer before and used [Ptable](https://ptable.com) to look up information about each atomic element. However, the current design (at the time) was created in the mid-to-late 2000s. So the periodic table was way too big for phones and way to small for regular-sized computer monitors. And for me personally, the UI (and UX) was disappointing. I extrapolated the UI from my pomodoro timer app and imagined how it would look if it was some periodic table. That's when I imagined my gorgeous periodic table user interface.

The new interface alone would cause people to use this hypothetical periodic table website. However, I wanted to differentiate my product further. I brainstormed a large list of potential features.

After I figures out how my website should look, I began to research tools to build it.

That's when I started to die a bit inside. It's kind of hard to explain what it was like researching the JavaScript tooling ecosystem, especially if you're not a beginner and I'm no longer a beginner.

So take any of these terms

```
RequireJS, CommonJS, AMD, UMD, ESM, Node, Express, Koa, Electron, EJS, AngularJS, Angular2+, React, Vue, Browserify, Grunt, Gulp, Webpack, Rollup, Typescript, CoffeeScript, Dart, ES2015, ES6, Babel, jQuery, npm, yarn, Sass, Less, Stylus, PostCSS
```

And describe the purpose of each one in two or three words, without using any technical terms. What you get is a super hazy high-level "explanation".

```
Browserify lets you require('modules') in the browser by bundling up all your dependencies

Webpack is a static module bundler for modern JavaScript applications.

Gulp is a toolkit for automating painful or time-consuming tasks in your development workflow, so you can stop messing around and build something.

CommonJS defines a module format. ...there are CommonJS spec proposals for Transport formats and an asynchronous require.
```
^ How would people with little experience programming interpret that?

Anyways, in the midst of this, I chose (what I believe now to be) the right options. I chose VueJS as a JavaScript framework, bundled my crap with Webpack, styled up my components with Sass, and of course used Babel to transpile my JS.

Anyways, after I chose my tools, I realized that it would be difficult to set everything up all at once. Besides, it would be easier to introduce one tool at a time so I can understand why they were needed.

So (on May 13) I just created an HTML file and worked on my app, using the VueJS CDN. What's great is that my text editor (Atom at the time) had plugins. I used a SASS plugin that compiled Sass down to Css and some HTML preview page (that live updated). :relieved:

About a month later I kept on adding to that HTML file until it grew to a near 100 line monstrosity. Also, I was adding a bunch of `script` tags near the end (in addition to a `main.vue` file, which was really just a plain JS file). That was the time I decided to use Webpack. Plus, my school was basically finished so I had much more free time on my hands.

:weary: I think that was the most painful moment in my life, trying to use Webpack for the first time. :weary:
[#NeverForget](https://webpack.js.org)

I'm not even joking, I think I almost died.

![commit history showing integration of webpack into project](../image/web-dev-a-year-later/webpack-babel-combo.png)

I don't even remember how many times I tried to get Webpack to work. I'm laughing (and dying) a bit inside just thinking about what was going on during that week. I had near-daily commits since May 30, and that week or so of "nothing" was me just trying to get Webpack to work. (that `00a20dd` commit was probably me starting from scratch again). I remember thinking if I should use Webpack without Babel, or just Babel without Webpack, but I decided not to, since many tutorials combined them.

The final config? It looked like this

![webpack config](../image/web-dev-a-year-later/first-webpack-config.png)

It's deceivingly simple, just because that one's correct :joy:
I wish I could see all the ones that I thought would work, but didn't.

Anyways, I also used Webpack to compile my Scss into Css, which was much easier.

Another month passed by (July 13)

At first I began to dread using Webpack, because now I had to use loaders for my svg, font files, and similar. But later I accepted the challenge and realized its utility. This was when I was using `webpack-merge` to create separate development and production builds. Integrating UglifyJS, MiniCssExtractPlugins, OptimizeCssAssetsPlugin, CopyWebpackPlugin, etc. wasn't so bad. I remember failing to export separate chunks (which would be lazily-loaded as I changed routes) with Webpack. I didn't mind missing out on that feature so much.

As July turned to August, I basically started to refine most of my application. This was when I started harvesting data about the elements of the periodic table. I had to write some scripts in the Wolfram Language to get data about each element. I exported much of the data as one large JSON. I used Gulp to transform the bundle and move stuff to the backend (which I also recently created).

It was around this time I became sort of close to burning out. You see, when school finished I poured all my available free time into building this application. At first, I was working maybe 6 hours a day, but that quickly grew to 10, then 14. The few weeks I was working 18 hours a day on the application took a huge toll. I could have gotten so much more done if I was not sleep deprived. :confused: I took a few days break after that to prevent myself from burning out. A few other sporadic breaks helped keep my sanity.

I originally planned to finish the application before school started, but I realized that really was not going to happen during September. I wanted to release my application as a birthday present, but I ended up pushing a half-baked application that didn't really work. It didn't even have any data.

It basically looked something like this
![periodic table later revision](../image/web-dev-a-year-later/periodic-table-later-design.png)

All the styling super sexy, but I just wasn't sure how to manipulate the data in a way which would be maintainable. Now that I reflect, I was thinking too hard about it. I should have just built something. Since I had no experience building any other website, that was the best course of action.

Eventually, Vue Cli 3 came out, which basically automatically created a Webpack config which transformed Vue, JS, Css, etc. all files for you. That's when I decided to rewrite everything from scratch. Since I learned a lot about Vue in the summer I used it, it would be good anyways, it would make the codebase more maintainable.

**Big Mistake**

When I switched to a brand new codebase, my productivity dropped.

*Version 1*

![commits](../image/web-dev-a-year-later/periodic-table-v1-commits.png)

*Version 2*

![commits](../image/web-dev-a-year-later/periodic-table-v2-commits.png)

It actually took a few months to start on Version 2. It was a complete rewrite - from the ground up. Why did I decide to do that?

I knew my codebase was pretty crap and it was inefficient. How I styled the Vue components was inefficient. The way i stored data was inefficient. The way I wrote my html was inefficient.

With Version 2, the bundles webpack generated were smaller and much better. I wrote smaller and more modular components. I styled elements more efficiently (except the theme part).

But what was the problem?

Version 2 of the website was massively slower than the original, Even though there were less features. It was driving me nuts! Was it the fact that I was namespacing my Vuex stores? Was it because I created more components, and the child components were being rerendered too often? Was it the fact that I was making too many variables reactive (like binding a bunch of CSS variables to `styles`)? I had no idea and couldn't seem to find an answer.

It was around the end of May when I finally decided to switch back to the original code base. It's basically the codebase I had after 4 or 5 months (of developing version 1). Except that I wasted 7 months.

I didn't have time to be pissed because I wanted to finish the app. That was just a few days ago.

## other actions

Luckily, the pomodoro application was not the only thing I worked on during the summer and fall.

During the summer I also worked on

[vuesax](https://lusaxweb.github.io/vuesax/)

fall

[blog](https://github.com/eankeen/blog)

- learning about networking, data storage


in the spring I worked on

[portable-workstation](https://github.com/eankeen/portable-workstation)

[jsonstore-iso](https://github.com/eankeen/isomorphic-json-store-io)

recently I've been working on

[repl-it-electron](https://github.com/repl-it-discord/repl-it-electron)

[carnival](https://github.com/repl-it-discord/carnival)


## what to learn next year

I learned a lot about frontend development this year. Usually, first learning to program is the most difficult. Once you wrap around the basics of something, I believe you learn a bit faster about that subject. So I made a list, organized around category rather than priority. Some of the stuff I wand to do with, others I want to learn about.

This is mostly just a list for me so I remember what I plan to do before I forget what to do.

* asm w/ gat & intel syntax
* c
* cygwin
* linux stuff
  * stuff in general
  * scripting
  * boot process, core services
  * kernel
  * os, installing something like arch linux, then gentoo, etc.
  * usint it as a main system
* using vim/emacs
* go, rust
* git (and hg)
* nginx, net etc.
* web
  * svelte framework, similar, etc.
  * webassembly
  * understanding small and big picture of
    * js, css, html
    * etc. read
* data structures
* networking
* working on a few ideas of web apps to put in prod

Some of the stuff listed above interoperate together, some knowledge may be interdependent. I'm pretty pissed that I realized I loved programming and computers in general so late into high school. And even more so that my learning stagnated after school started. Now that I better understand learning techniques and my weaknesses I'm confident that I can tackle the skills above (of course not to a complete extent) :smile: Hopefully after this year, I won't have to play catch-up anymore