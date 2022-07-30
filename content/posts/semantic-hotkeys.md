+++
title = "Semantic Hotkeys"
slug = "semantic-hotkeys"
author = "Edwin Kofler"
date = 2018-09-03T11:52:21-07:00
categories = ["hotkeys"]
tags = ["user-interface"]
draft = true
+++

Hotkeys are present in nearly all software. However, in my view, both software users and application developers do not realize their full potential to increase productivity.

I believe the full productivity of hotkeys can be unleashed through the concept of _semantic hoteys_. First I'll introduce the unproductivity problem, then my hotkey definitions, and lastly my proposed solutions.

Note: Persuasion through evidence-hardened claims is not my intention; I only wish to express my thoughts. If you agree with me, great; if not, that's fine too.

## Underutilization Woes

The crux of my productivity argument boils down to consistency. In one perspective, there are three costs of hotkeys:

1. The cost of learning
2. The cost of context-switching
3. The cost of hotkey clobbering / conflicts

The first cost is somewhat-inevitable, especially for large enterprise softwares like [Blender](https://www.blender.org) or [Houdini](https://www.sidefx.com). Sometimes, this cost is rarely a consideration because it is easily amortized by ample use of the hotkeys themselves. But, with less frequently-used applications, it is often not worth learning the hotkeys.

The second cost deals with context switching between different applications (that have different sets of hotkeys). A high familiarity with each applications' hotkeys can mitigate this penalty somewhat, but it will always exist.

The third cost involves clobbering. This can occur in applications that provide an extension or plugin environment, such as VSCode or NeoVim. Hotkeys of extensions are often defined  arbitrarily, usually just set for the sake of being set. This creates high potential for hotkey clobbering; such conflicts have to be resolved manually. Another form of Clobbering can also occur between operating system and application shortcuts.

## Definitions

- _Semantic Hotkey_: A hotkey in which the keypresses that define it have a semantic meaning based on the physical location of the keys and / or the movement of the fingers.
  - Example: `Delete` key deleting a key, `PageUp` moving a page up
  - Example:  `WASD` and `HJKL` are semantic positionings (physical locations) of movement actions based on the arrangement of said keys
  - Example: `Alt+Tab` and `Alt+Shift+Tab` to move view right and left, respectively. Slightly less semantic compared to the previous example because `Shift` the modifier is not consistently semantically tantamount to "backwards".

In contrast,

- _Syntactic Hotkey_: A hotkey in which the keypresses that define it have a semantic meaning based on superficial attributes.
  - Example: `UpArrow` means go to above item in search autocompletion
  - Example: `Ctrl+P` means go to **p**revious history item in many shells

Some other notes:

- Semantic hotkeys are more resilient to changes with in the Human Computer Interface itself. For example, changing the keyboard layout from QWERTY to DVORAK will not change semantic meaning. Semantic equivalents could be generated if, say, a the keyboard was replaced with gloves tracking acceleration, orientation, etc.
- Syntactic Hotkeys are the primary driver of the cost of learning a new set of shortcuts
- Hotkeys like `PageUp` are not globally accessible since they are not available on smaller keyboards (like 60% keyboards), and the button is too far away or energy-intensive to press

## Proposed Solution

The solution includes:

1. Shared hotkeys or conventions across applications
2. Limited clobbering
3. Intuitive semantics of semantic hotkeys

# TODO

Semantics can be more fine-tuned to fit into concrete categories. In the context of _DE Workspaces_, _Application Windows_, _Terminal Panes_, a unified language
The following remedy the problem

- Employ two different sides of the keyboard for faster switching (DVORAK-esque)

Any future operating system should have this by default. But here

Firstly, shared hotkeys (more than just the OS-provided `Ctrl+X`, `Ctrl+C`, `Ctrl+V`), etc.

As hinted, semantic hotkeys are the solution. You likely have experienced some form of it. For example, each key of WASD and HJKL semantically convey a direction in games and Vim, respectively.

Many games and many Vim-like editors implement these hotkeys since they are quite intuitive. It is important to note that there exists more syntactic shortcuts - for example `I` for inventory and `d` for delete are used as such due to the character, rather than the position on the keyboard.

An exception to this are the , etc. keys - even though the semantic keys. Whole keyboards have been created due to this

#### Tier Eta

- Custom mapping
- Chords are necessary to prevent shortcut clashes / clobbering.
- Improve synthetic symantics
  - `[`, `(`, `{` are often used to sygnify "go to left", such as go to left brace, go to left symbol, etc.
  - Easier button clicking

Custom mappings of shortcuts to meaning. Leverage chords for efficient representation

A pertinent example is the use of `h`, `j`, `k`, `l`

- Their physical relative locations correspond to movements

- Two files are open in a Code Editor, a shortcut to switch between left and right
- Two terminals are open in
Some of these are reflected in local configurations like i3, but not widely prevalent

Let's take the concept of switching between panels of a particular window. Imagine you have VSCode open and you have two files open side-by-side. Rather than use a mouse to switch between files, you can use a keyboard shortcut. `h` for left, `l` for right. But, those cannot be used for obvious reasons. `Ctrl+h` and `Ctrl+l` may be used.

What about in the case of tmux (panels instead of open files)? It would be hard to use `Ctrl+l`, and `Ctrl+h` as shell environments and unreliable.

What about opening two files in Vim - in within Tmux?

I think when people (many peope) think of shortcuts, they aren't thinking about the words themselves, just what it does on a basic level. So `View: Focus into Primary Sidebar` really is just "move context left, maybe skip one, maybe don't". But when the sidebar is moved, that may change and it might be easy to press the wrong shortcut

A good example is the arbitrary positioning of a cursor in a grid. Imagine a grid of, say, 5 by 5.

- Even with multiple button presses, takes MUCH LESS time to learn, less than the mouse, and clears up shortcut space

Promotes UX because it explicitly causes the designer to critically think about UI paths, and make them more composable.
