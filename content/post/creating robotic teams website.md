+++
title = "Making a Website for My Robotics Competition"
slug = "creating-website-for-robotics-club"
author = "Edwin Kofler"
date = 2018-11-16T10:10:57-08:00
categories = ["Web"]
tags = ["vue", ""]
draft = true
+++

During the November of 2018, I became aware of a [website](https://challenges.robotevents.com/challenge/95) competition. Students that are enrolled in a particular robotics program are able to submit a website by mid-January. Winners are given gift cards redeemable for robotics parts or something. Anyways, I thought this was a perfect opportunity to built a website. I learned a ton about website development the summer before, and I wanted to apply that knowledge on a brand new project. I knew I probably wasn't going to win, but I wanted to give it a good shot.

I started with the same tooling that I used before, mainly [VueJS](https://vuejs.org). I felt *ecstatic* because Vue-Cli-3 just released near that time. That meant I didn't have to create my own Webpack config for Vue+Babel+Sass compiling / transpiling & HMR. Gosh, that was a nightmare with my first website. Anyways, I began my commits mid-november.

The first thing I remember doing is brainstorming how I would scaffold the project. I remember being rather apprehensive during this time because I only had experience building one other website. That was the first iteration of my Periodic Table website, also with VueJS. So with the lessons I learned from that website and some critical thinking I was able to scaffold a food architecture. It looked something like this initially:

```html
<template>
  <header/>
  <router-view/>
  <footer/>
</template>
```

Where the `<router-view/>` component would be different based on which url you're at, such as `/home` or `/about`.

I remember getting up a MVP fairly quickly. It had a simple header, footer, with a `/home`, `/about`, and more routes.
`<screenshot/>`

When it came time to choose some sort of UI framework, I opted not to use one. I don't recall the exact reason, but maybe I didn't really like what was out there, or I wanted to learn how to create some of those components on my own. So I custom made all of the components, which sort of slowed down development. I didn't really mind though, that was one of my favorite parts: creating gorgeous elements the user will see. From my last website I learned that colors and icons can really make or break the look of a website. Nearly all of my colors derived from the great [Open Color](https://yeun.github.io/open-color) color pallette. I also used svg icons from [Feather Icons](https://feathericons.com).

I learned my lesson from my earlier website and created *much* smaller components. This made it easier to style the components also. So I didn't end up needing a bunch of `.sass` files for each `.vue` file. That made me satisfied.

As I progressed, a put a lot of features on the roadmap. I planned to include a blogging system, an archive of photos, an archive of videos, and some membership login site. However, I quickly realized those were too many features on my platter. Eventually, I just settled for creating the photo library.

The photo library is probably my favorite feature, and probably the main reason any of the members will visit the website in the future. 