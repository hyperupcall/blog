+++
title = "Fibonacci Equation for Zth (Nth) Term Using Pascal's Triangle (Part 1 of 2)"
slug = "fibonacci-equation-using-pascals-triangle-part-1"
author = "Edwin Kofler"
date = 2018-11-16T10:10:57-08:00
categories = ["Math"]
tags = ["pascal's triangle", "fibonacci"]
markup = "mmark"
katex = true
draft = false
+++

If you're familiar with the intricacies of Pascal's Triangle, see how I did it by going to [part 2](../fibonacci-equation-using-pascals-triangle-part-2/). (Part 2 not complete yet)
{{ .Title }}

## Background of Pascal's Triangle
A while back, I was reintroduced to Pascal's Triangle by my pre-calculus teacher. Pascal's triangle can be written as an infintely expanding triangle, with each term being generated as the sum of the two numbers adjacently above it. For example, both $$10$$s in the triangle below are the sum of $$6$$ and $$4$$. $$6$$ and $$4$$ are directly above each $$10$$.

$$
1 \newline
1 \quad 1 \newline
1 \quad 2 \quad 1 \newline
1 \quad 3 \quad 3 \quad 1\newline
1 \quad 4 \quad 6 \quad 4 \quad 1 \newline
1 \quad 5 \quad 10 \quad 10 \quad 5 \quad 1 \newline
$$

### Binomial Theorem Relation
My instructor stated that Pascal's triangle fundamentally represents the coefficients of an expanded binomial. You've probably seen this before. A binomial to the nth power (where $$n \in \mathbb{Z}$$) has the same coefficients as the nth row of Pascal's triangle. This is known as the [binomial theorem](https://en.wikipedia.org/wiki/Binomial_theorem), which is expressed below.

$$ (a+b)^n = \sum_{k=0}^{n} \binom{n}{k} a^{n-k} b^k $$

$$\binom{n}{k}$$ means $$n$$ choose $$k$$. As you can see, it's the coefficient of the $$k$$th term in the polynomial expansion $$(a+b)^n$$ For example, $$n=3$$ yields the following:

$$ (a+b)^3 = \sum_{k=0}^{3} \binom{3}{k} a^{3-k} b^{k}$$

$$ a^3 + 3ab^2 + 3a^2b + 9b^3 = \binom{3}{0}a^3 + \binom{3}{1}a^2b + \binom{3}{2}b^2a + \binom{3}{3}b^3 $$

From the above equation, we obtain a cubic equation. Given this, we can ascertain that the coefficient $$3$$ choose $$0$$, or $$\binom{3}{0}$$ = $$1$$. Below you can see some values we determined from the above operation.

$$\binom{3}{0} = 1\\[4px]$$
$$\binom{3}{1} = 3\\[4px]$$
$$\binom{3}{2} = 3\\[4px]$$
$$\binom{3}{3} = 9\\[4px]$$

This binomial theorem relationship is typically discussed when bringing up the Fibonacci sequence in pre-calculus classes. You must be familiar with this to understand the fibonacci sequence relationship.

## Pascal's Triangle Representations
In fact, Pascal's triangle can be represented by a series of $$n$$ choose $$k$$ symbols.

$$
\binom{0}{0} \newline
\binom{1}{0} \quad \binom{1}{1} \newline
\binom{2}{0} \quad \binom{2}{1} \quad \binom{2}{2} \newline
\binom{3}{0} \quad \binom{3}{1} \quad \binom{3}{2} \quad \binom{3}{3} \newline
\binom{4}{0} \quad \binom{4}{1} \quad \binom{4}{2} \quad \binom{4}{3} \quad \binom{4}{4} \newline
\binom{5}{0} \quad \binom{5}{1} \quad \binom{5}{2} \quad \binom{5}{3} \quad \binom{5}{4} \quad \binom{5}{5} \newline
$$

Alternatively, Pascal's triangle can also be represented in a similar fashion, using $$_nC_k$$ symbols.

$$
{_0C_0} \\[5px]
{_1C_0} \quad {_1C_1} \\[5px]
{_2C_0} \quad {_2C_1} \quad {_2C_2} \\[5px]
{_3C_0} \quad {_3C_1} \quad {_3C_2} \quad {_3C_3} \\[5px]
{_4C_0} \quad {_4C_1} \quad {_4C_2} \quad {_4C_3} \quad {_4C_4} \\[5px]
{_5C_0} \quad {_5C_1} \quad {_5C_2} \quad {_5C_3} \quad {_5C_4} \quad {_5C_5} \\[5px]
$$

## Relationship Between Pascal's Triangle and the Fibonacci Sequence
What exactly is this relatiponship? First, draw diagonal lines intersecting various rows of the Fibonacci sequence. Then, add the terms up within each diagronal line to obtain the $$zth$$ element of the Fibonacci sequence.

![Pascal's Triangle](../image/pascals-triangle.png)

The green lines represent the division between each term in the Fibonacci sequence and the red terms represent each $$zth$$ term, the sum of all black numbers within the green border. In this case, the green lines are initially at an angle of $$20\degree$$, and gradually become less steep as $$z$$ increases.

We can write the first 5 equations.

$$z_1 = {_0C_0} = 1$$

$$ z_2 = {_1C_0} = z_2 = 1$$

$$z_3 = {_2C_0} + {_1C_1} = 2$$

$$z_4 = {_3C_0} + {_2C_1} = 3$$

$$z_5 = {_4C_0} + {_3C_1} + {_2C_2} = 5$$

$$...$$

Is it possible to succinctly write the $$z$$th term of the Fibonacci as a summation of $$_nC_k$$ Pascal's triangle terms? The number of terms being summed up depends on the $$z$$th term. Both $$n$$ and $$k$$ (within $$_nC_k$$) depend on $$z$$. See any patterns yet? See if you can figure it out for yourself before continuing!

Part 2 is not complete. When it's finished, find it [here](../fibonacci-equation-using-pascals-triangle-part-2/).