---
title: Setting up a Headless Raspberry Pi
date: "2020-05-25"
description: "These are the steps I take when I am setting up a headless Raspberry Pi."
tags: ["raspberry pi"]
---

These are the steps I take when setting up a headless Raspberry Pi. 

Headless means that there is no other way to interact with it besides connecting to it via SSH. There's no monitor and no keyboard or mouse. It will sit somewhere in my house running quietly, just doing its thing, whether it's a cron job or hosting some kind of web service.

Some of the information in this post comes from [here](https://www.raspberrypi.org/documentation/configuration/wireless/headless.md) and [here](https://www.tomshardware.com/reviews/raspberry-pi-headless-setup-how-to,6028.html).

I hope this is useful to you!

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

    I keep the script in my home directory so I run it like this (Replace the SSID and Password with your own):

    ```
    $ WIFI_SSID=Linksys WIFI_PASSWORD=hunter2 ~/headless-init.sh
    ```

    You may want to hardcode those values, but having them written out explicitly might keep those credentials fresh in your mind.

1. Eject the sd card and insert it into the Pi and power it up. After a minute, SSH into it and use the default password `raspberry`:

    ```
    $ ssh pi@raspberrypi.local
    ```

1. Make sure that Raspbian has the latest and greatest updates:

    ```
    $ sudo apt update -y; sudo apt upgrade -y; sudo apt autoremove
    ```

1. Run `raspi-config`:

    ```
    $ sudo raspi-config
    ```

    These are the items that need attention:

    * Change User Password
    * Network Options -> Hostname
    * Advanced Options -> Expand Filesystem
    * Advanced Options -> Memory Split -> 16
    * Update

1. Then I SSH back into the Pi and get all my public keys on it so I can SSH in from any of my host machines without a password:

    ```
    $ mkdir .ssh
    $ wget https://github.com/orenfromberg.keys -O ~/.ssh/authorized_keys
    ```

1. Disable password access for `sshd`:
    ```
    $ sudo vim /etc/ssh/sshd_config
    ```
    Then make sure password authentication is set to no:
    ```
    PasswordAuthentication no
    ```
    By disabling password authentication, any user would need to have one of the private keys that are associated with the public keys that we fetched from GitHub in order to log in to the Pi.
1. Install `ufw`:
    ```
    $ sudo su -
    # apt install -y ufw
    # ufw default deny incoming
    # ufw default allow outgoing
    # ufw allow from 10.0.0.0/8 to any port 22 proto tcp
    # ufw allow from 172.16.0.0/12 to any port 22 proto tcp
    # ufw allow from 192.168.0.0/16 to any port 22 proto tcp
    # ufw allow from 169.254.0.0/16 to any port 22 proto tcp
    # ufw allow from fc00::/7 to any port 22 proto tcp
    # ufw allow from fe80::/10 to any port 22 proto tcp
    # ufw allow from ff00::/8 to any port 22 proto tcp
    # ufw status
    # ufw enable
    # exit
    ```

    This step involves denying all incoming connections on all ports and then whitelisting the SSH port 22 on all kinds of private IP CIDR ranges for IP4 and IP6. See [here](https://en.wikipedia.org/wiki/Private_network) for more info.

    After this, if you want to enable incoming connections on any ports, you'll need to whitelist the port. For example, if you want to enable access for HTTP:
    ```
    $ sudo su -
    # ufw disable
    # ufw allow 80/tcp
    # ufw enable
    ```

1. Install fail2ban:
    ```
    $ apt install -y fail2ban
    ```

    See more info on fail2ban [here](https://www.fail2ban.org/wiki/index.php/Main_Page).

That's it. Now I've got a fresh headless Raspberry Pi ready to go. Let me know if you have any ideas how I can improve this in the comments below.