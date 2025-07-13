---
title: 'Compiler — The code you write doesn’t run exactly as is.'
description: 'Trust compiler.'
pubDate: 'Oct 13 2024'
heroImage: '/thumbnails/compiler-optimization.webp'
categories: ['Development', 'English']
authors: ['jayden']
tags: ['compiler', 'optimization', 'c++']
---

We use compiler-based languages like C, C++, and Rust.

These languages go through a compilation process, where the source code is translated into machine code, generating an executable file.

On the other hand, scripting languages rely on interpreters, which execute code line by line. Due to this structural difference, programs written in compiled languages are generally faster.

But it’s not just this difference — compilers also optimize your code behind the scenes to make it run more efficiently.

So, how exactly does a compiler make your code faster?

## Exploring Assembly

To understand what the compiler does, let’s write a simple code
that sums all the numbers from 1 to 1000.

```c
#include <stdio.h>

int main()
{
    int sum = 0;
    for (int i = 1; i < 1001; i++)
    {
        sum += i;
    }
    printf("%d", sum);
}
```

```bash
❯ gcc main.c
❯ ./a.out
500500
```

When we run the code, the result comes out as expected.

I compiled it using gcc, and by adding the `-S` option during the build, the compiler generates the assembly code for this program.

```bash
❯ gcc main.c -S
❯ cat main.s
```

```bash
_main:
    ...
    jmp     .L2
.L3:
    mov     eax, DWORD PTR [rbp-8]
    add     DWORD PTR [rbp-4], eax
    add     DWORD PTR [rbp-8], 1
.L2:
    cmp     DWORD PTR [rbp-8], 1000
    jle     .L3
```

Here’s a snippet of the assembly code. It looks a bit complex.
As the code runs, it jumps to `.L2`, compares `rbp-8` with `1000`, and if the value is less than or equal to `1000`, it jumps to `.L3` to continue the loop.
This is exactly how the for loop works in the original C code.
At this point, the assembly output doesn’t seem too different from the C code.
Now, let’s build it again using the `-O3` optimization option and check the result.

```bash
❯ gcc main.c -O3 -S
❯ cat main.s
```

```bash
main:
    sub     rsp, 8
    mov     esi, 500500
    mov     edi, OFFSET FLAT:.LC0
    xor     eax, eax
```

Can you see it? The code no longer runs a loop; instead, it directly assigns the result, 500500, to the variable.

> Yes, the compiler doesn’t just execute your code as written.

It identifies parts of the code that can run faster and modifies them without altering the program’s behavior.

## Compiler Optimization

We saw how the compiler optimizes the code that sums the numbers from 1 to 1000.

But this is just one example — compilers can apply dozens of different optimizations.

You can specify which optimizations to use through various options.

- https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html

For GCC, you can check which optimization options are available through the link below:

```text
...
-fi/nline-functions
-finline-small-functions
-findirect-inlining
-fipa-bit-cp  -fipa-cp  -fipa-icf
-fpartial-inlining
-fpeephole2
-freorder-blocks-algorithm=stc
-freorder-blocks-and-partition  -freorder-functions
-frerun-cse-after-loop
-fschedule-insns  -fschedu
...
```

There are an overwhelming number of flags, and applying each one individually can be quite difficult, right?
The`-O3` option we used earlier enables several optimization options all at once.

There are other optimization options as well:

- `-O0`: No optimization, suitable for debugging.
- `-O1`: Basic optimization.
- `-O2`: Performance improvements.
- `-O3`: More aggressive optimizations.
- `-Ofast`: Fast execution optimization, ignoring some standards.
- `-Os`: Optimize for smaller code size.
- `-Oz`: Generate the smallest possible code.
- `-Og`: Balances debugging and optimization.

It’s really convenient that you can speed up execution simply by adding these options without changing the code.

> So, does that mean I can just write code any way I want?

<p align="center">
    <img src="/assets/no-kimmich.gif" alt="No Kimmmich" width="400"/>
    <br>
    <b>No, it’s not that simple!</b>
</p>

No, not exactly. There are definitely cases where the compiler can’t optimize your code.

For instance, code that’s difficult to optimize, or issues like False Sharing in multi-threaded environments, are beyond the compiler’s ability to help.

That’s why, if performance is important to you, it’s crucial to write code that the compiler can optimize, even if you’re not manually optimizing the code yourself.

You can use the -S option to see how the compiler optimizes your code with different flags, but I recommend checking out the following site:

![](/assets/gotbolt.webp)

* https://godbolt.org/

Compiler Explorer compiles your code in real-time and shows how it’s built.
You can configure various settings like CPU architecture, compiler type, and optimization options, so feel free to adjust these to match your system and test accordingly.

## optimization.cpp

To evaluate how far optimizations go depending on the compiler options and determine which options to use, I’d like to introduce my GitHub repository.

<script src="https://tarptaeya.github.io/repo-card/repo-card.js"></script>
<div style="display: flex; justify-content: center;">
  <div class="repo-card" data-repo="BayernMuller/optimization.cpp" style="width: 400px;"></div>
</div>

This project builds the same C++ code with various options and shows the benchmark results as images.
I won’t go into detail here, but it covers an optimization technique called Loop Unroll and a multi-threading issue called False Sharing. Let’s test these with [optimization.cpp](https://github.com/BayernMuller/optimization.cpp).

```bash
❯ python3 benchmark.py techniques/loop_unroll --save-graph
```

![](/assets/loop-unroll-benchmark.webp)

This way, you can measure and check the execution time for each function and compiler option.

In the case of loop unroll, the `no_loop_unroll` function was the fastest under both `-O3` and `-Ofast`.

This means it’s one of those cases where leaving the optimization entirely to the compiler is the best approach.

![](/assets/false-sharing-benchmark.webp)

On the other hand, for False Sharing, the `sum_unpadded_data` function is always slow, regardless of compiler options.
This indicates that the compiler couldn’t optimize it, meaning you’ll need to modify the code manually.
With [optimization.cpp](https://github.com/BayernMuller/optimization.cpp), you can easily write and compare different code implementations to see which performs faster!

## Conclusion

1. The compiler doesn’t compile your code exactly as written; it optimizes based on the options you provide.
2. It’s crucial to write code that the compiler can optimize effectively.
3. Try using [optimization.cpp](https://github.com/BayernMuller/optimization.cpp) to benchmark execution times based on different compiler options.
