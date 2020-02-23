+++
title = "Refind on Pi"
slug = "refind-on-pi"
author = "Edwin Kofler"
date = 2020-02-23T13:23:00-08:00
categories = []
tags = ["refind"]
draft = true
+++

1. include include path to gcc

-I/usr/include/efi/arm

2. use p roper linkers script file

/usr/bin/ld: cannot open linker script file /usr/lib/elf_armv7l_efi.lds: No such file or directory

command: /usr/bin/ld -L./../libeg/ -L./..mok etc.
err;
rename /usr/bin/objcopy:refind.so: invalid bfd target
