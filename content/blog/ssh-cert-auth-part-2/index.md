---
title: SSH Certificate Authority, Part 2
date: "2019-11-20"
description: How to set up an SSH Certificate Authority by example.
---

## Authentication with an SSH Certificate Authority

In the next two sections we will see how an SSH certificate authority can help with the two trust problems we talked about earlier, as well as the security and scale issues.

First we'll deal with authenticating a server to a client:

- How to generate a host certificate
- How to configure an SSH server to offer that certificate
- how to tell an SSH client to trust a certificate authority.

Then we'll deal with authenticating a client to a server:

- how to generate a client certificate
- how to configure the SSH client to offer that certificate
- how to tell the SSH server to trust the certificate authority

### Host Certificates

Update your terraform file `main.tf` to now have the following contents:

```hcl
provider "aws" {
  region = "us-east-1"
}

variable "my_ip" {
  type = string
}

module "my-server" {
  source = "git@github.com:orenfromberg/infrastructure.git//dev-machine?ref=tags/v0.0.6"
  my-ip  = var.my_ip
  name   = "my-server"
}

module "my-cert-authority" {
  source = "git@github.com:orenfromberg/infrastructure.git//dev-machine?ref=tags/v0.0.6"
  my-ip  = var.my_ip
  name   = "my-cert-authority"
}
```

Apply this terraform:

```shell-session
$ terraform apply
var.my_ip
  Enter a value:
```

Enter your IP address and hit enter. When prompted to apply the terraform, take a look a the plan. It should say `Plan: 8 to add, 0 to change, 0 to destroy.` Enter `yes` and the AWS provider will instantiate your EC2 instances.

Let's SSH to the certificate authority and generate the key pair.

```shell-session
$ ./connect-to-my-cert-authority.sh
```

Once we connect, issue the following command:

```bash
ubuntu@ip-172-31-92-78:~$ ssh-keygen -t rsa -N '' -C 'ca@mydomain' -f ca
Generating public/private rsa key pair.
Your identification has been saved in ca.
Your public key has been saved in ca.pub.
The key fingerprint is:
SHA256:WerD1GjNPsdg/DlBoFlHMz9/8jibjPLmoX+5dSrcVvM ca@mydomain
The key's randomart image is:
+---[RSA 2048]----+
|          o.=    |
|         + o +   |
|        o . . o  |
|         X .   o |
|        S B . . o|
|       = o + o =o|
|        + o.B.oo*|
|         ..++==*E|
|          .*=+*. |
+----[SHA256]-----+
ubuntu@ip-172-31-92-78:~$ cat ca.pub
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDBgDjQP+q3QiPY0pjGonuGib+Jbqziy/lRgZpKX560fBkP0X6Hf7vOdKFayTI7mWx7xuIfsDDE6X0P2G2OvoA5S4LYxe7aZWCA7w47HzO+PpbHqHg4dy/kdMPscYV6M5oVlF04dY+dYJskQj1b61jyah8JUBVzi6iHkB514elRnScVDGDxKqPS53cRqA+N8Q3CjkOAVF6ZKg1hsR7z3wSbM6A8deSq4TboKtGWcAhYB873zv907HQeEmI5/Lc8bJSTWdIh/YhZl26FS01oyWDBlY03HAot9+lkSzLBvjRfPKAnMu9MNsgWV2SGtpIQm5hIliIfrvxb0Trl9xWe8p3J ca@mydomain
```

Here are the parameters of this command:

> `-t rsa`

This specifies the key type that we are creating.

> `-N ''`

This specifies that the new passphrase is the empty string.

> `-C 'ca@mydomain'`

This specifies a comment to attach to the key.

> `-f ca`

This specifies the filename of the keyfile.

Now we'll create a host certificate for our server. To do that, we're going to sign the servers public key with the key we just created.

In another terminal, connect to your server with `./connect-to-my-server.sh`:

```bash

```

### Client Certificates
