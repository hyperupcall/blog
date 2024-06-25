+++
title = "The UMPIRE Method"
slug = "umpire-method"
author = "Edwin Kofler"
date = 2022-09-24T00:00:00-00:00
categories = []
tags = ["problem-solving", "framework"]
+++


As a part of the [CTI Accelerate Program](https://computingtalentinitiative.org/accelerate/), I learned about a problem-solving technique called 'UMPIRE'. Also used at [CodePath](https://www.codepath.org), UMPIRE is especially helpful for solving interview questions.

I'm finding the framework especially useful as I haven't used any problem solving skills in years. It's time to end my reliance on pattern matching and inertial intuition!

If you're not familiar with the framework, I'd recommend [CodePath's post](https://guides.codepath.com/compsci/UMPIRE-Interview-Strategy) about it to get the basics down - this post explains more about how I personally use it, rather than what it is.

## In Summary

There are six steps:

1. **U**nderstand
2. **M**atch
3. **P**lan
4. **I**mplement
5. **R**eview
6. **E**valuate

I personally broke down this process into 3 larger steps:

1. **U**nderstand, **M**atch, and **P**lan
2. **I**mplement and **R**eview
3. **E**valuate

Fewer steps allows me to fit the process into working memory. I'll name each of the three larger steps _comprehension_, _solution_, and _application_, respectively.

### 1. Comprehension

Its difficult to write code without understanding the problem. In my view, understanding is the most crucial part. Each subsequent subsection highlights key factors for consideration.

For _understanding_,

- form of input (type, structure, guarantees, contracts)
- form of output (type, structure, guarantees, contracts)
- convert input to output manually

For _matching_,

- similar problems
- similar solutions
- identify both similarities and differences

For _planning_,

- break down problem (identify subcomponents)
- simplify problem (initially assume invariants, but relax them later)
- develop pseudocode

### 2. Solution

Once the problem space is understood enough, it's time to build a solution.

For _implement_ and _review_,

- Correct code (common cases)
- Complete code (corner cases)
- Clean / idiomatic code (less important)
- Debug, debug, debug!

### 3. Application

Effort exerted in previous steps would be in vain if the solution isn't used properly. This step helps identify the quality and applicability of the solution.

For _evaluate_,

- Time complexity
- Space complexity
- Areas for improvement

### Wrap

Practically speaking, there'll be frequent jumping between steps in the problem solving process. But, like most categories, it is important to make a distinction for the sake of improving the process as a whole.

## In Practice

To apply this framework, I like to write the initials of each steps in code comments. For example:

```py
# u: input: int, int, int (some items)
# u: output: array<int> (list of things)

# m: linked list, but with ...

# p: for integers 1 and 2 ...
if True:
  pass

# p: for integer 3 ...
if True:
  pass

# e: o(1) time
# e: o(1) space
# e: next time, use std::vector instead of std::list
```

## Wrap

It's an ongoing process to develop a variant of the UMPIRE method that works for me. When my technique invariably improves, I'll update this post to match.

I wish to thank the organizers of the CTI program for their effort and dedication towards putting together such an awesome piece of curriculum and community! I encourage you to [check them out](https://computingtalentinitiative.org/accelerate/)! :smile:
