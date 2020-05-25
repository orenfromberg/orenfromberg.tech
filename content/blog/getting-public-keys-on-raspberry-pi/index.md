---
title: How I set up a headless Raspberry Pi
date: "2020-05-25"
description: "These are the steps I take when I am setting up a headless Raspberry Pi "
---

These are the steps I take when setting up a headless Raspberry Pi. Some of the information comes from [here](https://www.raspberrypi.org/documentation/configuration/wireless/headless.md) and [here](https://www.tomshardware.com/reviews/raspberry-pi-headless-setup-how-to,6028.html).

1. Using [this tool](https://www.raspberrypi.org/blog/raspberry-pi-imager-imaging-utility/) on my host machine, I flash Raspbian lite to an SD card.

1. After it finishes imaging, I open a terminal window in the `/boot` partition of the SD card and run the following script `~./headless-init.sh`:
    ```bash
    #!/usr/bin/env bash

    # enable SSH
    touch ssh

    cat > wpa_supplicant.conf <<EOF
    ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
    update_config=1
    country=US

    network={
     ssid="${WIFI_SSID}"
     psk="${WIFI_PASSWORD}"
    }
    EOF
    ```

    I keep the script in my home directory so I run it like this:

    ```bash
    $ WIFI_SSID=<my wifi network name> WIFI_PASSWORD=<my wifi password> ~/headless-init.sh
    ```

1. Eject the sd card and insert it into the Pi and power it up. After a minute, SSH into it and use the default password `raspberry`:

    ```bash
    $ ssh pi@raspberrypi.local
    ```

1. Make sure that Raspbian has the latest and greatest updates:

    ```bash
    $ sudo apt update -y; sudo apt upgrade -y; sudo apt autoremove
    ```

1. Run `raspi-config`:

    ```bash
    $ sudo raspi-config
    ```

    1. Change the default password
    1. Change the hostname
    1. Expand the filesystem
    1. Set graphics memory to 16MB
    1. Update `raspi-config`
    1. Reboot the Pi

1. Finally I SSH back into the PI and get all my public keys onto the Pi so I can SSH in from any of my host machines without a password:

    ```bash
    $ mkdir .ssh
    $ wget https://github.com/orenfromberg.keys -O ~/.ssh/authorized_keys
    ```