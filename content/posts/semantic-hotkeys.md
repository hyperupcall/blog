+++
title = "Semantic Hotkeys"
slug = "semantic-hotkeys"
author = "Edwin Kofler"
date = 2018-09-03T11:52:21-07:00
categories = ["hotkeys"]
tags = ["user-interface"]
draft = true
+++

Hotkeys are present in nearly all software. However, in my view, both software users and application developers do not realize the full potential of hotkeys

I believe the full productivity of hotkeys can be unleashed through the concept of _semantic hoteys_. First I'll introduce current problems with hotkeys, then some hotkey definitions, and lastly my proposed solutions.

Note: Persuasion through evidence-hardened claims is not my intention; I only wish to express my thoughts. If you agree with me, great; if not, that's fine too.

## Current Woes

The crux of my claims boils down to consistency. In one perspective, there are three costs of hotkeys:

1. The cost of learning
2. The cost of context-switching
3. The cost of hotkey clobbering / conflicts

The first cost is somewhat-inevitable, especially for large enterprise softwares like [Blender](https://www.blender.org) or [Houdini](https://www.sidefx.com). Sometimes, this cost is rarely a consideration because it is easily amortized by ample use of the hotkeys themselves. But, with less frequently-used applications, it is often not worth learning the hotkeys. The cost of learning hotkeys of a particular application is not proportional the usage frequency of that application.

The second cost deals with context switching among multiple applications (that have different sets of hotkeys). A high familiarity with each applications' hotkeys can mitigate this penalty somewhat, but it will always exist. As applications with incongruent hotkeys increase, the cost of context switching will only remain high.

The third cost involves clobbering. This can occur in applications that provide an extension or plugin environment, such as VSCode or NeoVim. Hotkeys of extensions are often defined  arbitrarily, usually just set for the sake of being set. This creates high potential for hotkey clobbering; such conflicts have to be resolved manually. Inconsistent conventions make learning new hotkeys, especially those defined within plugin-based environments, difficult.

## Definitions

- _Semantic Hotkey_: A hotkey in which the keypresses that define it have semantics rooted in physicalities
  - Example:  `WASD` and `HJKL` have semantics of orientation or directed movement based on the arrangement of said keys
  - Example: `Ctrl+Tab` and `Ctrl+Shift+Tab` to move view right and left, respectively.
    - `Tab` semantically equivalent to cycle (cycle through form fields, tabs, application windows, etc.)
    - But still sightly less semantic compared to the previous example because the modifier `Shift` does not consistently mean "backwards" or "opposite".
  - Example: `Ctrl+[`, `Ctrl+(`, `Ctrl+{` to move to end of discrete element (ex. symbol, closed brace, etc).
    - The level of "curviness" of each brace may be meaintful to a particular application

In contrast,

- _Syntactic Hotkey_: A hotkey in which the keypresses that define it have semantics rooted in (partial) superficialities
  - Example: `Ctrl+P` means go to **p**revious history item in many shells (rooted in English grammar)
  - Example: `Ctrl+F` means **f**ind item in current document (rooted in English grammar)
  - Example: `Delete` and `PageUp` (both are dedicated keys)

Some other notes:

- Semantic hotkeys are more resilient to any changes of the Human Computer Interface itself
  - Example: Changing the keyboard layout from QWERTY to DVORAK will not change semantic meaning - but it is the responsibility of either the OS or application to respect that
  - Example: Replacing the keybord with, say, gloves that have acceleration, orientation, etc. tracking will still yield similar "shortcuts" in whatever form they exist
- Syntactic Hotkeys are responsible for much of the the cost of learning new shortcuts
- Hotkeys like `PageUp` may sound good, but
  - Analogous iPhone to BlackBerry, dedicated keys are inflexible
  - Is not accessible on 60% keyboards, or is too difficult to press

## Proposed Solution

My solution assumes the following for each applicable application:

- Supports custom mapping from hotkey to action
- Supported chording hotkeys

My three-pronged solution involves:

1. Sharing hotkeys and conventions across applications

2. Conventions to limit clobbering
3. Intuitive semantics of semantic hotkeys

Semantics can be more fine-tuned to fit into concrete categories. In the context of _DE Workspaces_, _Application Windows_, _Terminal Panes_, a unified language

### Challanges

A pertinent example is the use of `h`, `j`, `k`, `l`

- GUI App
- GUI App in VM

- Terminal App
- Terminal App in tmux
- Terminal App in tmux in Kitty
- Terminal App in tmux in Kitty in VM / Container

## Benefits

A good example is the arbitrary positioning of a cursor in a grid. Imagine a grid of, say, 5 by 5.

Agnostic to

- keyboard layout
- keyboard language
- Employ two different sides of the keyboard for faster switching (DVORAK-esque)
Become only more useful due to the gridification and flexification of layouts - convergence creates more consistency within interfaces

- Interface designers improve UX by critically thining how UI paths compose for hotkeys

In the coming months, I'll have something: [github.com/semantic-hotkeys](https://github.com/semantic-hotkeys)
