---
title: The square root of two
date: 2026-03-14 06:47
description: Proving that no rational number squared can equal two
tags: [Math]
draft: false
---

Happy $\pi$ day!

Here I will prove that no rational number, when squared, can equal $2$.

A rational number is defined as a number $p=\frac {m}{n}$ such that $n\ne0$ and $m$,$n$ are in lowest terms, meaning their greatest common divisor is $1$:

$$
gcd(m,n)=1
$$

Another way to say this is that $m$ and $n$ are coprime, and they are not both even numbers. If they were both even then $gcd(m,n)\ge2$.

First we'll do a little groundwork to set the scene.

### Even and Odd Squares

An even number is defined as any number that is a multiple of $2$ and can be written as $2x$. An odd number is any number that can be written as $2x+1$.

An interesting property of the even numbers is that any time you square an even number, you get another even number.

We can show this by squaring an even number $2a$:

$$
(2a)^2 = 4a^2 = 2(2a^2)
$$

Since $(2a)^2$ is in the form of $2x$, this shows that it is even.

Similarly, the square of an odd number $2a+1$ is odd:

$$
(2a+1)^2 = (2a+1)(2a+1) = 4a^2 + 4a + 1 = 2(2a^2+2a) + 1
$$

Since $(2a+1)^2$ is in the form of $2x+1$ where $x=2a^2+2a$, then $(2a+1)^2$ is odd.

With these two facts in hand, we can prove that if $x^2$ is even, then $x$ is even.

Btw, "if $x$ then $y$" can be written as $x \implies y$.

The contrapositive of "P implies Q" is "not Q implies not P", and they are logically equivalent.

Since "not even" is "odd" and "not odd" is "even", the contrapositive of $x$ is even $\implies$ $x^2$ is even is:

$x^2$ is odd $\implies$ $x$ is odd

Similarly, the contrapositive of $x$ is odd $\implies$ $x^2$ is odd is:

$x^2$ is even $\implies$ $x$ is even.

### The Proof

We can prove by contradiction by assuming there is a rational number $p=\sqrt2$

Substituting $p$ with $\frac{m}{n}$ and squaring both sides we get:

$$
p^2 = (\frac{m}{n})^2 = \frac{m^2}{n^2} = 2
$$

Multiplying both sides by $n^2$ we get:

$$
m^2 = 2n^2
$$

Since $m^2$ is in the form of $2x$, $m^2$ is by definition an even number. We can prove that $m^2$ implies that $m$ is even.

Since m is even, we can write it as $m=2k$. Then:

$$
m^2 = (2k)^2 = 4k^2 = 2n^2
$$

Dividing both side by $2$ we get:

$$
2k^2 = n^2
$$

Which implies that $n^2$ is even, and therefore $n$ is even.

### Conclusion

I've shown that $m$ and $n$ are both even, meaning they share a factor of 2 and $gcd(m,n) \ne 1$ which contradicts the initial assumption that $m/n$ is fully reduced. Therefore no such rational $p$ exists and $\sqrt2$ is irrational.
