+++
title = "Fiddling with Ubuntu Server Images"
slug = "fiddling-with-ubuntu-server-images"
author = "Edwin Kofler"
date = 2020-02-23T13:23:00-08:00
categories = ["linux"]
tags = ["linux", "ubuntu"]
+++

Oddly enough, the latest version of Ubuntu Server failed to install on my MacBook Pro (2012). It's due to some bug in `efibootmgr`. Ubuntu Server Installer uses `efibootmgr` to create some NVRAM variables for the UEFI boot process. Unfortunately, `efibootmgr` failed right in the middle and printed an empty string to stderr, abruptly ending the installation process.

To fix this, I hypothesized that I could somehow redirect the command's stderr to `/dev/null` using a file descriptor redirect. So, no error would be printed and the installation would complete as usual. But, when further inspecting the image, I couldn't seem to find the installation scripts to modify.

I decided to sidestep the issue by installing Debian Stretch instead. Because I used the 'CD installer' (rather than the DVD installer), many of the 'popular packages' were not pre-installed. I underestimated the limitations of this setup, and I bailed out of setting up Debian. I only bailed out after manually configuring the network, when `systemd-resolved` did not seem to be reading the `DNS=` entry in my `systemd.network (5)` configuration file.

I then decided to retry installing Ubuntu, but by using an Ubuntu Cloud image because I knew it did not have an installation wizard.

## Copying the rootfs

I installed the Ubuntu Cloud image from the official source.

```sh
wget https://cloud-images.ubuntu.com/bionic/current/bionic-server-cloudimg-amd64.img
```

Because the downloaded image is in `qcow` format, I converted into a `raw` format. (you can use `qemu-img info` to query for this information).

```sh
qemu-img convert -p \
  -f qcow2 bionic-server-cloudimg-amd64.img \
  -O raw bionic.img \
```

Because we will be accessing the filesystem as a block device, we mount the file to a loop device.

```sh
sudo losetup -fP bionic.img
```

Now, we can finally `dd` the data to an actual partition.

```sh
sudo dd if=/dev/loop7p1 of=/dev/vg/ubuntu-server \
  status=progress conv=fsync bs=2048
```

After this process, I remounted the partition, chrooted into it, and added a password for the root user.

## Making the Server Bootable

The distribution's files for the EFI System Partition (ESP) are in `dev/loop7p3` (or your equivalent). It only contains grub-related files. Rather than simply copying the grub files over and manually creating an NVRAM varaible entry for UEFI, I simply created an `\EFI\ubuntu-server` folder in my ESP, and moved the bootloader and EFI stub kernel into it, from `/boot/`. I then created an fstab entry to mount the ESP to `/efi`, and from that, bind mount `/efi/EFI/ubuntu-server` to `/boot` and bind mount `/efi` to `/boot/efi`. At the time, I crossed my fingers that nothing related to updating the kernels and initramfs required features not supported by vfat, such as symlinks (spoiler alert: it does).

Now we have all the files needed to boot, we just have to tell our boot loader (or boot manager) to use them. Because I was already using an SSD with Refind installed, I added an entry for my Ubuntu Server. I did not configure GRUB.

```properties
menuentry ubuntu-server {
  loader   \EFI\ubuntu-server\vmlinuz
  initrd   \EFI\ubuntu-server\initrd.img
  options  "root=UUID=65e98e43-8591-48f8-8746-34c8b3819ee7 rw"
  submenuentry "boot to tty" {
    add_options "systemd.unit=multi-user.target"
  }
  submenuentry "boot fallback initramfs" {
    initrd /boot/initrd.img.old
  }
  submenuentry "boot fallback kernel" {
    loader /boot/vmlinuz.old
  }
}
```

When rebooting, I was pretty certain I did not need to do any more work and that I was almost finished with the setup. The computer booted properly, getty opened some virtual terminals, and login ran without any hiccups. However, I was unable to type at all. My laptop keyboard simply did not work. However, I was able to login with a nearby bluetooth keyboard!

After poking around the system, I found the problem. `ls -alF "/lib/modules/$(uname -r)/kernel/drivers/hid"` showed me that there were almost no human interface driver kernel modules that were loaded. Of course, this is an Ubuntu cloud image, so it makes sense that login can only be done through serial and ssh.

Anyways, to fix this, I simply downloaded the `drivers/hid/hid-apple.c` kernel driver (along with `drivers/hid/hid-ids.h`), placing them in a subdirectory.

I then ran a Makefile with the following content

```makefile
obj-m += hid-apple.o

all:
  make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules
```

This built the proper modules. After inserting the modules into the kernel, it worked flawlessly! Hooray! :tada: I added the modules to `/lib/modules/$(uname -r)/updates`, and did some other miscellaneous cleanup. Of course, if I try to boot the system from a different computer, the keyboard will likely not work.

A few other problems later arose. Remember I added the boot files in a directory of the ESP? It turned out symlinks are used in the kernel upgrade process, so I had to recreate a `/boot` partition for my Ubuntu server, copy over everything, and update my `/etc/fstab`.

If I were to do this again, I would look into creating a [preseed file](https://help.ubuntu.com/lts/installation-guide/s390x/apbs01.html), (which I did not know about at the beginning of this process), and optionally use [packer](https://packer.io) to uniformly perform the installation process in a virtual machine.
