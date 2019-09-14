+++
title = "Modern Web Development using a 2012 MacBook"
slug = "web-dev-on-a-2012-mac"
author = "Edwin Kofler"
date = 2019-08-18T22:45:01-07:00
categories = ["web"]
tags = ["frontend"]
draft = true
+++

Fairly recently, I began to utilize my Macbook Pro for creating website Single Page Applications (SPAs). This wasn't any old MacBook, however. It was a Mid-2012 MacBook Pro. Are you wondering if my computer would keep up with the modern web development workflow?

I would be wondering that too. But I only started to beg the question after my satisfaction with my Microsoft Surface Pro 5 decreased. Don't get me wrong, it is a device that has exceeded my expectations; the only thing is - I was running the Windows operating system. It's not that I hate Windows 10 - it's *alright*, but it began to feel bloated.

I felt more and more bloated as I begrudgingly used graphical install wizards, as apps polluted *My* documents folder, and as I continued to type the backslash key when traversing directories. Installing Docker was the cherry on top. Unlike on Linux-based distributions, I had to install VirtualBox and start up a VM just to spin up some containers. And, I did not want to opt in using a buggy Windows insiders build so I can have the *privilege* of running a buggy build of the Linux kernel made to run alongside the buggy Windows kernel for spinning up containers without VirtualBox. But this isn't a rant about developing on Windows!

I transferred all my data to my dear Mid-2012 MacBook Pro. Contrary to what you might believe, it is a *total powerhouse*. It sports a slick Gigabit Ethernet port, a *blazing fast* FireWire 800 port, along with two USB 3.0 ports, an SD card reader, a fricking DVD drive, and an anti-theft lock mechanism. Did I mention that it had a headphone jack? Chances are, your MacBook ain't got one. But mine does :smirk:

However, despite this monster of a computer, there is some *small* detail you might have to be aware of. The computer is allergic to bloat. It's not uncommon for recently manufactured completed to have such allergies, but old computers generally don't have immunizations that are up to date.

For example, pick any bloated GNU/Linux distribution - say... Ubuntu. If I wanted to run Ubuntu, I would be running the GNOME desktop environment, which, from an outside observer, appears to slow my computer down around 30%. But, if I'm running a high quality desktop environment such as XFCE, my keystrokes will yield higher responses rates than response rates I would be getting from Windows from the more powerful computers.

Of course, these problems get significantly more worse the lower level they are. For example, if I were running a bloated kernel like Windows, my computer may be significantly slower than any stock Linux kernel (possibly to the extend of 4 or 5 standard deviations). Running a bloated desktop environment would be significantly slower than faster desktop environments, but the extend of the damage will always be less than that of performance differentials of different kernels.

We can always add more layers, expanding to more than just kernels and desktop environments. We can make similar analogies to compiler toolchains, programming languages, display managers, window managers, and even normal utilities.

Which brings me to my point. You will be able to deal with bloat, so long as you do not have a long chain at the bottom of the stack. Modern web development does not come without (useful) bloat. Webpack and other module bundlers that chain loaders such as Babel and PostCSS are slow, but they are indispensable tools when building a full application. So long as your kernel, display manager, display manager have minimal bloat, my computer will be able to manage.

But what is it like really? I say that my computer will "manage", but does it *actually* facilitate rapid iterative programming?
