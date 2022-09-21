+++
title = "UMPIRE"
slug = "umpire"
author = "Edwin Kofler"
date = 2020-02-23T13:23:00-08:00
categories = ["linux"]
tags = ["problem-solving", "ubuntu"]
draft = true
+++

## UMPIRE

As a part of the [CTI Accelerate Program](https://computingtalentinitiative.org/accelerate/), I have learned about a problem-solving technique called 'UMPIRE'

Also used at [CodePath](https://www.codepath.org), UMPIRE is especially helpful for solving interview questions.

It's exactly what I'm looking for. I used to be quite adept at critical thinking and problem solving, but as I grew into high school and college, I forgot all the techniques that made me great. Instead, I've been relying on pattern-matching and the inertial intuition of my past knowledge and experience.

Learning UMPIRE from the ground-up has been quite beneficial, and I've put my own spin around it. Essentially, there are 6 steps:

1. **U**nderstand
2. **M**atch
3. **P**lan
4. **I**mplement
5. **R**eview
6. **E**valuate

# My understanding

I personally broke down this process into three further building blocks:

1. Group One
  a. Understand
  b. Match

2. Group Two
  a. Plan
  b. Implement
  c. Review

3. Group Three
  a. Evaluate

Breaking down a set of steps into discrete parts helps me remember each step better.

In this case, each groups resembles a "before", "during", and "after" pattern, centered around the "implementation" part

Before the implementation, it is important to understand the problem. It is important to

- Understand Point A, and Point B
- If relevant, understand _why_ we need to go from Point A to Point B. In entry-level interviews, this is less relevant, but when architecting or modifying an existing app, this is crutial for the sake of time efficiency and code complexity
- Predict edge cases
  - This makes the initial implementation more robust (and correct)

During the implementation, it is important to plan _before_ coding, so language details don't get in the way

- Pull relevant "matched" patterns and apply them in the current context

After the implementation, it is important to determine how useful the final code is.

- In my opinion, this is the most important step. If the tradeoffs of a solution aren't understood, then even a theoretically perfect solution will be inoptimally uesd
- In a very successful "Group One", many parts of the evaluation won't be surprising

## My application

To apply this framework for problems, I like to write out steps with initials in code comments. For example:

```py
# u: input: something
#   - c: integers
# u: output: other
#   - c: array

# m: something else
```

As shown, I like to separate each group with a newline, and prefix every line (not starting with whitespace) with the first character of the substep.

- Substeps have often multiple common components. For example, inputs to an algorithm typically have constraints, so the character 'c' is used to denote such situations
