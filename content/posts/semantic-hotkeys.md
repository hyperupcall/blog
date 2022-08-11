+++
title = "Semantic Hotkeys"
slug = "semantic-hotkeys"
author = "Edwin Kofler"
date = 2018-09-03T11:52:21-07:00
categories = ["hotkeys"]
tags = ["user-interface"]
draft = false
+++

Hotkeys are present in nearly all software. However, in my view, both software users and application developers do not realize the full potential of hotkeys.

I believe the full productivity of hotkeys can be unleashed through the concept of _semantic hoteys_. First I'll introduce some current problems with hotkeys, then I'll explain how _semantic hotkeys_ can provide a solution.

## Current Woes

The crux of my claims boils down to consistency. In one perspective, there are three costs of hotkeys:

1. The cost of learning
2. The cost of context-switching
3. The cost of hotkey clobbering

The first cost is somewhat-inevitable, especially for large enterprise softwares like [Blender](https://www.blender.org) or [Houdini](https://www.sidefx.com). Sometimes, this cost is rarely a consideration because it is easily amortized by ample use of the hotkeys themselves. But, with less frequently-used applications, it is often not worth learning the hotkeys. The cost of learning hotkeys of a particular application is typically not proportional to the total time using that application.

The second cost deals with context switching among multiple applications (that have different sets of hotkeys). A high familiarity with each applications' hotkeys can mitigate this penalty somewhat, but it will always exist. As applications with incongruent hotkeys increase, the cost of context switching will only remain high.

The third cost involves clobbering. This can occur in applications that provide an extension or plugin environment, such as VSCode or NeoVim. Hotkeys of extensions are often defined  arbitrarily, usually just set for the sake of being set. This creates high potential for hotkey clobbering; such conflicts have to be resolved manually. Inconsistent conventions make learning new hotkeys, especially those defined within plugin-based environments, difficult.

## Solution

An ideal solution involves constructing a set of shared keyboard shortcuts across applications. But, the meaning of those shortcuts mustn't be domain specific; they must translate intuitively.

Introducing, semantic hotkeys:

- _Semantic Hotkey_: A hotkey in which the keypresses that define it have semantics rooted in physicalities or commonalities
  - Example:  `WASD` and `HJKL` have semantics of orientation or directed movement based on the arrangement of said keys
  - Example: `Ctrl+Tab` and `Ctrl+Shift+Tab` to move view right and left, respectively.
    - `Tab` semantically equivalent to cycle (cycle through form fields, tabs, application windows, etc.)
    - But still sightly less semantic compared to the previous example because the modifier `Shift` does not consistently mean "backwards" or "opposite".
  - Example: `Ctrl+[`, `Ctrl+(`, `Ctrl+{` to move to end of discrete element (ex. symbol, closed brace, etc).
    - The level of "curviness" of each brace may be meaningful in any particular context

The "physicalities" and "commonalities" part of semantic hotkeys ensure that the semantic are either shared or intuitive enough. The penalty of context switching would decrease.

In contrast,

- _Syntactic Hotkey_: A hotkey in which the keypresses that define it have semantics rooted in (partial) superficialities
  - Example: `Ctrl+P` means go to **p**revious history item in many shells (rooted in English grammar)
  - Example: `Ctrl+F` means **f**ind item in current document (rooted in English grammar)
  - Example: `Delete` and `PageUp`
    - These are dedicated keys, so their semantic meaning is inherently superficial
    - Tangentially, not all keyboards have these buttons so their utility is questionable

By defining and using semantic hotkeys more than syntactic hotkeys, the cost of learning new shortcuts is lower.

Furthermore, semantic hotkeys are more resilient to any changes of the Human Computer Interface itself

- Example: Changing the keyboard layout from QWERTY to DVORAK or changing the keyboard language from English to Deutsch will not significantly change the meaning or position of the shortcut.
- Example: Replacing the keybord with, say, gloves that have acceleration, orientation, etc. tracking could still yield similar "shortcuts" in whatever form they exist

With semantic shortcuts, it may be possible for the Operating System to handle shortcut transformations, rather than the applications themselves.
(If Cut, Copy, and Paste were semantic, then the Colemak keyboard would not need to exist)

- Supports custom mapping from hotkey to action
- Supports chording hotkeys

## Implementation

For each application, from a common JSON file (with keys being semantic keys and values being the shortcuts themselves), configuration for each native application is created.
A reasonable implementation assumes that each applicable application supports:

Of course, there are many actions that don't correspond to a shortcut, or a shortcut has a nuanced meaning. But, those ca be accounted for via escape hatches

- Custom mapping from hotkey to action
- Chorded hotkeys

The keys `h`, `j`, `k`, `l` are a great starting point - they correspond to directions. More specifically, they move a cursor, selection, or item directionally within a particular context.

- Vim: Cursor within a buffer
- Window Manager: Window within a virtual desktop
- Terminal Multiplexer: Pane within a terminal

We can generalize:

- Selection navigate within context
- Selection move within context
- Selection move to new context
- Context navigate relatively
- Context move relatively

Important to note that contexts can simultaneously be sections. Semantics can be more fine-tuned to fit into concrete categories. In the context of _DE Workspaces_, _Application Windows_, _Terminal Panes_, a unified language

### Challenges

Challenges include nested applications

For example, of an arbitrary terminal app, there are multiple possible nestings (which can affect shortcut semantics):

- Terminal App
- Terminal App in tmux
- Terminal App in tmux in Kitty
- Terminal App in tmux in Kitty in VM / Container

## Similar ideas

Benefits users because shortcuts:

- Are an invariant with respect to keyboard layout and language
- Help interface designers improve UX by making UI paths more explicit
- Employ two different sides of the keyboard for faster switching (DVORAK-esque)
Become only more useful due to the gridification and flexification of layouts - convergence creates more consistency within interfaces

See [github.com/semantic-hotkeys](https://github.com/semantic-hotkeys) to see this in action
