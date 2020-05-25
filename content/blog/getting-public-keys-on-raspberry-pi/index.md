---
title: How I set up a headless Raspberry Pi
date: "2020-05-25"
description: "These are the steps I take when I am setting up a Raspberry Pi "
---

Here are some notes for how I set up a Raspberry PI.

After I finish imaging Rasbian lite on to an SD card, I run the following script in the `/boot` partition:

```bash
#!/usr/bin/env bash

# enable SSH
touch SSH

cat > wpa_supplicant.conf <<EOF
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=US # my two letter ISO 3166-1 country code

network={
 ssid="${WIFI_SSID}"
 psk="${WIFI_PASSWORD}"
}
EOF
```

Next I put the sd card in the Pi and power it up. After a minute I'll SSH into it and use the default password `raspberry`:

```bash
$ ssh pi@raspberrypi.local
```

I make sure that Raspian has the latest and greatest updates:

```bash
$ sudo apt update -y; sudo apt upgrade -y; sudo apt autoremove
```

Finally to get all my public keys onto the Pi so I can SSH in from anywhere:

```bash
$ mkdir .ssh
$ wget https://github.com/orenfromberg.keys -O ~/.ssh/authorized_keys
```