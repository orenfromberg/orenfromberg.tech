---
title: How I set up a headless Raspberry Pi
date: "2020-05-25"
description: "These are the steps I take when I am setting up a headless Raspberry Pi "
---

These are the steps I take when setting up a headless Raspberry Pi. Some of the information comes from [here](https://www.raspberrypi.org/documentation/configuration/wireless/headless.md) and [here](https://www.tomshardware.com/reviews/raspberry-pi-headless-setup-how-to,6028.html). I often forget these steps so having this post will help remind me what I do every time.

1. Using [this tool](https://www.raspberrypi.org/blog/raspberry-pi-imager-imaging-utility/) on my host machine, I flash the latest version of Raspbian lite to an SD card.

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

    * Change the default password
    * Change the hostname
    * Expand the filesystem
    * Set graphics memory to 16MB
    * Update `raspi-config`
    * Reboot the Pi

1. Then I SSH back into the Pi and get all my public keys on it so I can SSH in from any of my host machines without a password:

    ```bash
    $ mkdir .ssh
    $ wget https://github.com/orenfromberg.keys -O ~/.ssh/authorized_keys
    ```

1. Disable password access for `sshd`:
    ```
    $ sudo vim /etc/ssh/sshd_config`
    ```
    Then make sure password authentication is set to no:
    ```
    PasswordAuthentication no
    ```
1. Install `ufw`:
    ```bash
    $ sudo su -
    $ apt install -y ufw
    $ ufw default deny incoming
    $ ufw default allow outgoing
    $ ufw allow from 10.0.0.0/8 to any port 22 proto tcp
    $ ufw allow from 172.16.0.0/12 to any port 22 proto tcp
    $ ufw allow from 192.168.0.0/16 to any port 22 proto tcp
    $ ufw allow from 169.254.0.0/16 to any port 22 proto tcp
    $ ufw allow from fc00::/7 to any port 22 proto tcp
    $ ufw allow from fe80::/10 to any port 22 proto tcp
    $ ufw allow from ff00::/8 to any port 22 proto tcp
    $ ufw status
    $ ufw enable
    $ exit
    ```

1. Install fail2ban:
    ```bash
    $ apt install -y fail2ban
    ```

That's it. Now I've got a fresh headless Raspberry Pi ready to go. Let me know if you have any ideas how I can improve this in the comments below.