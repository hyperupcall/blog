+++
title = "Fibonacci Equation for Nth Term Using Pascal's Triangle (Part 2 of 2)"
slug = "fibonacci-equation-using-pascals-triangle-part-2"
author = "Edwin Kofler"
date = 2018-12-04T22:39:42-08:00
categories = []
tags = []
draft = true
+++

# Finding a Formula
How do we leverage the relationship (as you see in the image above) to obtain an equation that obtains the $$Nth$$ term in the Fibonacci sequence? First, we need to figure out what our equation may look like. We know we are adding up terms of the Fibonacci Sequence, so a summation symbol will be used. Additionally, we are adding up terms in the fibonacci sequence, where each term individually can be written as $$_nC_r$$.

So our final equation will look akin to this:

$$\sum_{z=0}^{z_{end}}{_n}C_r$$

But this is not exactly right, since $$n$$ and $$r$$ are different for each term, or $$Zth$$ term of the summation. Therefore, we can more accurately write:

$$\sum_{z=0}^{z_{end}}{_{n(z)}}C_{r(z)}$$
