+++
title = "Terminal Automation with Expect"
slug = "terminal-automation-with-expect"
author = "Edwin Kofler"
date = 2022-01-08T00:48:33-08:00
categories = ["tutorial"]
tags = ["linux"]
+++

[Expect](https://core.tcl-lang.org/expect/index) is _THE_ tool for automating tasks in the terminal. It is extremely helpful if you need to automate sending input to a program directly on the command line.

This guide is targeted towards developers that wish to automate sending and receiving input from a program, without having to read long manual pages or fragmented StackOverflow answers. I'm going to skimp on technical details relating to Expect and the concepts around it; for that, there are [plenty](https://www.poor.dev/blog/terminal-anatomy) [of](https://core.tcl-lang.org/expect/index) [resources](https://www.linusakesson.net/programming/tty) online

Here is a result of what using Expect might look like. Note that I am not touching the keyboard after invoking the program `./automate.tcl`!

[![asciicast](https://asciinema.org/a/460725.svg)](https://asciinema.org/a/460725)

## Installation

Of course, program installation is a prerequisite for program usage

If you're using Linux, the installation is more-or-less distro-dependent. If you don't wish to install with a GUI, I have provided the commands below

```sh
# For Debian, Ubuntu, PopOS, Linux Mint, etc.
sudo apt install expect
```

```sh
# For Arch Linux, Manjaro, Endeavour, Artix, etc.
sudo pacman -S expect
```

```sh
# For Fedora, CentOS Streams, RHEL, Rocky, Alma, etc.
sudo dnf install expect
```

```sh
# For OpenSUSE, etc.
sudo zypper install expect
```

If you're using [MacOS](https://formulae.brew.sh/formula/expect), the de facto package manager is [brew](https://formulae.brew.sh/formula/expect)

```sh
brew install expect
```

For Windows users, you're out of luck, as per usual. There are [some ports](https://wiki.tcl-lang.org/page/Expect+for+Windows) for Windows, but I cannot vouch for their reliability or popularity. I'll also add that the way "terminals" (consoles) work on Windows is fundamentally different compared to Unix systems.

## Hello World (tcl)

Expect programs are written in a language called [tcl](https://www.tcl.tk) (pronounced tickle). Before I show anything related to Expect, I would like to show you a tcl Hello World

First, create a `hello.tcl` file...

```tcl
#!/usr/bin/tclsh
puts "Hello, World!"
```

Then, run it

```sh
$ tclsh ./hello.tcl
Hello, World!
```

Because the [shebang](<https://en.wikipedia.org/wiki/Shebang_(Unix)>) is at the top, we can also execute it like so:

```sh
$ chmod +x ./hello.tcl # remember to mark the file as executable
$ ./hello.tcl
Hello, World!
```

Tcl is a simple, yet powerful scripting language. Think of it like Python, but faster and a bit more antique. If you want to learn more about Tcl, I would recommend reading the [Tcl Wiki](https://wiki.tcl-lang.org)

## Hello World (expect)

Expect is essentially a library for Tcl that adds extra functions which enables us to supply input and check the output of a program.
Using Expect is very similar. Below, we use an Expect function called `sleep`, which sort of pauses the program for the amount of seconds specified:

```tcl
#!/usr/bin/expect -f
puts "Hello, World!"
sleep 1
puts "Hello again! ^w^"
```

To run, invoke `expect` with the `-f` flag

```sh
$ expect -f ./script.tcl
Hello, World!
Hello again! ^w^
```

Just like last time, you can also execute the script directly

```sh
$ chmod +x ./script.tcl # remember to mark the file as executable
$ ./script.tcl
Hello, World!
Hello again! ^w^
```

## Actual Automation

Now that we have a basic understanding of Expect, it is time to actually use it for its primary purpose: automation of interactive terminal programs.

First, we'll start off with a program that we want to automate: a simple name printer. I've supplied versions in Python and C++, but it doesn't matter at all which language you use

```python
#!/usr/bin/env python3
print("What is your name?")
name = input()

print(f"Hewwo {name}! Nice to meet you~ ^w^")
```

```cpp
#include <iostream>

int main() {
  std::cout << "What is your name?" << std::endl;
  std::string name;
  std::getline(std::cin, name);

  std::cout << "Hewwo " + name + "! Nice to meet you~ ^w^" << std::endl;
}
```

Now, run the program, paying actual attention to what is outputed to the screen, and when the user needs to enter in information

```sh
$ python3 test.py
What is your name?
Edwin
Hewwo Edwin! Nice to meet you~ ^w^
```

So, the user executes the program, and _expects_ the program to prompt for a name. Once the program prints the prompt, the user _sends_ their name. This can easily be codified as such:

```tcl
#!/usr/bin/expect -f
spawn "python3" "test.py"

expect "What is your name?"
send "Edwin\r"

expect eof
```

If you are curious, the `expect eof` essentially makes Expect continue running until the `./test.py` program finishes executing. Otherwise, Expect would have quit prematurely. And, the `\r` denotes a _return character_, like pressing Return on your keyboard (`\n` works as well)

Cool! Let's run it! As you can see, I've called the file `automate.tcl`

```sh
$ expect -f ./automate.tcl
spawn python3 test.py
What is your name?
Edwin
Hewwo Edwin! Nice to meet you~ ^w^
```

Woah~! We didn't even have to do anything and the user input was supplied automatically!

## Handing control back to the user

90% of the time, you're either going to be using the `expect` or `send` functions. There are times where you would want to do other things, though, such as giving control back to the user, so they can input data themselves. Let's try that.

First, we'll modify the program to ask another question:

```python
#!/usr/bin/env python3
print("What is your name?")
name = input()
print(f"Hewwo {name}! Nice to meet you~ ^w^")

print("What is your favorite animal?")
animal = input()
print(f"Woah~, the {animal} is a pretty cool animal!")
```

Let's run the same Expect script, just to see what happens

```sh
$ expect -f automate.tcl
spawn python3 test.py
What is your name?
Edwin
Hewwo Edwin! Nice to meet you~ ^w^
What is your favorite animal?

```

It hangs! This is because at this point, Expect has reached the `expect eof` line. Here, Expect is just sort of waiting until the program exits (try to type a response and press enter, nothing will happen). Instead of waiting, we want Expect to enable the user to _interact_ with the program

To do this, just replace the `expect eof` with `interact`

```sh
#!/usr/bin/expect -f
spawn "python3" "test.py"

expect "What is your name?"
send "Edwin\r"

interact
```

The output _looks_ the same, but if you type and press enter, the Python program actually receives the input and prints out a response! Here is my output:

```sh
$ expect -f automate.tcl
spawn python3 test.py
What is your name?
Edwin
Hewwo Edwin! Nice to meet you~ ^w^
What is your favorite animal?
Fox
Woah~, the Fox is a pretty cool animal!
```

This is extremely useful if you want to automate the beginning of a program, but also want to manually input text near the end.

### Miscellaneous tips

There are a few things that you may want to be aware of

1. Using asterisks!

If you are expecting the string `What is your name?`, you don't have to write it out in full like so:

```tcl
expect "What is your name?"
```

Instead, use a glob pattern. The asterisks means "zero or more characters"

```tcl
expect "*your name?*"
```

2. Use `--` if want to input something that starts with a hyphen

Sort of like invoking command line arguments programs `ls`, `mkdir`, adding `--` will prevent any ambiguity. In other words, `send` will interpret `-cool` as a string to send, rather than an option that modifies its behavior

```tcl
# ❌ INCORRECT
send "-cool"

# ✅ CORRECT
send -- "-cool"
```

2. Pass `-h` to send if you want to make it seem like a human typed it (slower typing, with variant intermidant delays)

```tcl
set send_human {.1 .3 1 .05 2}

send -h "It looks like a human is typing this"
```

Note that you only have to set the `send_human` variable once, best placed at the top of the file. For more information about the 5 numbers, here is a snippet from the man page

> The first two elements are average interarrival time of characters in seconds. The first is used by default. The second is used at word endings, to simulate the subtle pauses that occasionally occur at such transitions. The third parameter is a measure of variability where .1 is quite variable, 1 is reasonably variable, and 10 is quite invariable. The extremes are 0 to infinity. The last two parameters are, respectively, a minimum and maximum interarrival time. The minimum and maximum are used last and "clip" the final time. The ultimate average can be quite different from the given average if the minimum and maximum clip enough values

3. Type with a slight pause. Sometimes, it may be useful to type something, and wait for the underling program to catch up (ex. Slow languages like Java). You can use a Tcl procedure for this

```tcl
#!/usr/bin/expect -f
proc send_with_delay {str} {
  send $str
  sleep 0.3
}

# Use it like so...
send_with_delay "Fox\r"
```

### Wrap

Expect has many more features, but those are the ones you'll be using the most often! If this helped you or if you have _any_ feedback, [let me know](https://twitter.com/hyperupcall)! Thank youu~ and have a fantastic rest-of-the-day!
