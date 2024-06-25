+++
title = "Semantic Hotkeys"
slug = "semantic-hotkeys"
author = "Edwin Kofler"
date = 2022-08-19T11:52:21-07:00
categories = ["hotkeys"]
tags = ["user-interface"]
+++

Hotkeys are present in nearly all software. However, in my view, both software users and application developers do not realize the full potential of hotkeys.

I believe the full productivity of hotkeys can be unleashed through the concept of _semantic hotkeys_. First I'll introduce some current problems with hotkeys, then I'll explain how _semantic hotkeys_ can provide a solution, and lastly, show what an implementation might look like.

## Current Woes

The crux of my claims boils down to consistency. In one perspective, there are three costs of hotkeys:

1. The cost of learning
2. The cost of context-switching
3. The cost of hotkey clobbering

The first cost is somewhat-inevitable, especially for large enterprise softwares like [Blender](https://www.blender.org) or [Houdini](https://www.sidefx.com). Sometimes, this cost is rarely a consideration because it is easily amortized by ample use of the hotkeys themselves. But, with less frequently-used or non-unique applications, it is often not worth learning the hotkeys. The cost of learning hotkeys of a particular application is typically not proportional to the total time using that application.

The second cost deals with context switching among multiple applications (that have different sets of hotkeys). A high familiarity with each applications' hotkeys can mitigate this penalty somewhat, but it will always exist. As applications with incongruent hotkeys increase, the cost of context switching will only remain high.

The third cost involves clobbering. This can occur in applications that provide an extension or plugin environment, such as VSCode or NeoVim. Hotkeys of extensions are often defined  arbitrarily, usually just set for the sake of being set. This creates high potential for hotkey clobbering; such conflicts have to be resolved manually. Inconsistent conventions make learning new hotkeys, especially those defined within plugin-based environments, difficult.

## Solution

An ideal solution involves constructing a set of shared keyboard shortcuts across applications. But, the meaning of those shortcuts mustn't be domain specific; they must translate intuitively.

Introducing, semantic hotkeys:

- _Semantic Hotkey_: A hotkey in which the keypresses that define it have semantics rooted in physicalities, geometries, or commonalities
  - Example:  `WASD` and `HJKL` have semantics of orientation or directed movement based on the arrangement of said keys (physicality)
  - Example: `Ctrl+Tab` and `Ctrl+Shift+Tab` to move view right and left, respectively. (commonality)
    - `Tab` semantically equivalent to cycle (cycle through form fields, tabs, application windows, etc.)
    - But still sightly less semantic compared to the previous example because the modifier `Shift` does not consistently mean "backwards" or "opposite".
  - Example: `Ctrl+[`, `Ctrl+(`, `Ctrl+{` to move to end of discrete element (ex. symbol, closed brace, etc). (geometry)
    - The level of "curviness" of each brace may also be meaningful in some contexts
      - Still, somewhat unsemantic, as braces aren't arranged in order on keyboard layouts
  - Example: Keys `I` and `O` may signal `On` and `Off` (geometry)

The "physicalities", "geometries", and "commonalities" part of semantic hotkeys ensure that the semantics are intuitive enough to mitigate the penalty of context switching.

In contrast,

- _Syntactic Hotkey_: A hotkey in which the keypresses that define it have semantics rooted in (partial) superficialities
  - Example: `Ctrl+P` means go to **p**revious history item in many shells (rooted in English grammar)
  - Example: `Ctrl+F` means **f**ind item in current document (rooted in English grammar)
  - Example: `Delete` and `PageUp`
    - These are dedicated keys, so their semantic meaning is inherently superficial
    - Not all keyboards have these buttons so their utility is questionable

Confusingly, the shortcut `Ctrl+P` may mean **p**rint, **p**revious, or **p**roject. Furthermore, users' native tongue, keyboard, or keyboard layout may differ; these differences affect the intuitiveness and sensibility of the shortcut.

That is, more generally, semantic hotkeys are more resilient to any changes of the Human Computer Interface itself.

- Example: Changing the keyboard layout from QWERTY to DVORAK or changing the keyboard language from English to Deutsch will not change the meaning or position of the shortcut.
- Example: Replacing the keybord with, say, gloves that have acceleration, orientation, etc. tracking could still yield similar "shortcuts" in whatever form they exist

Lastly, Incorporating these shortcuts encourage interface designers to thing about making UI paths more explicit and cohesive, eventually improving UX.

## Implementation

An implementation may start by creating a program that outputs application-specific hotkey configuration (binding key to action) from a common configuration file.

A reasonable implementation assumes that each applicable application supports:

- Custom mapping from hotkey to action
- Chorded hotkeys

The keys `h`, `j`, `k`, `l` are a great starting point - they correspond to directions. More specifically, they move a cursor, selection, or item directionally within a particular context. For example:

- in a Terminal Text Editor, it may move a Cursor within a Buffer
- in a Window Manager, it may move a Window within a Virtual Desktop
- in a Terminal Multiplexer, it may move a Pane within a Window

We can generalize to include the following actions:

- Selection navigate within context
- Selection move within context
- Selection move to new context
- Context navigate relatively
- Context move relatively

There are some other challanges:

- Contexts can sometimes treated as sections (sometimes simultaneously)
- Semantics may need to be more fine-tuned to fit into concrete categories
- Applications shortcuts may nest
  - A terminal app (raw mode) may be within the contest of a graphical terminal emulator, a terminal multiplexer, and a TUI interface to a virtual machine manager (ex. QEMU Monitor)
- Applying this systems to programs with slightly different behaviors

This blog post mainly exists to explain the problem and solution - I don't have a full "semantic shortcut system". But, applying such a system will undoubtedly improve productivity, at least for me. I'm doing some preliminary work at [github.com/semantic-hotkeys](https://github.com/semantic-hotkeys) to apply this idea to everyday applications and websites. When its ready, you may find it useful, or employ a similar system in a program of your own.
