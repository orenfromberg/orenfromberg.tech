---
title: SSH Certificate Authority, Part 1
date: "2019-11-19"
description: SSH public key-based authentication with terraform
---

I based this series of posts off [this post](https://jameshfisher.com/2018/03/16/how-to-create-an-ssh-certificate-authority/) by Jim Fisher. I enjoyed reading his post but I wanted to follow along interactively. The goal is to run through the concepts that Jim explained so well in his post about how to achieve user authentication using an SSH certificate authority, but while doing the steps with actual instances.

In this first post, I'm going to show how SSH public-key based authentication commonly works. We'll do this using [a terraform module](https://github.com/orenfromberg/infrastructure) to provision EC2 instances to mess around with. We'll continue to use this terraform module in the next post when we dive into SSH certificate authorities.

## SSH public key-based authentication

Jim begins with the problem that assymetric cryptography solves for SSH:

> When an SSH client opens an SSH connection to an SSH server, there are a couple of trust issues to resolve. The server needs to know whether this is truly an authorized client, and the client needs to know whether the server is truly the server it claims to be.

We can solve these trust issues in the following ways:

- For the server to know whether this is truly an authorized client, it checks if the clients public key exists in their user authorized keys file (located at `~/.ssh/authorized_keys` on the server).

- For the client to know whether this server is legitimate, it checks if the server exists in the clients known hosts file (located at `~/.ssh/known_hosts` on the client).

The first item is always enforced, but the second is not. Often, the client will trust the server's public key the first time it sees it. We call this policy "Trust On First Use" (TOFU) and an attacker can exploit this whenever a client creates an SSH connection to a machine for the first time.

### Example of common SSH public key-based authentication

Let's observe this common configuration with the terraform module I mentioned earlier. First, we will need your public IP address that your ISP assigned to you:

```shell-session
~ on ☁️  orenfromberg.tech(us-east-1)
[ 20:26:53 ] ❯ dig +short myip.opendns.com @resolver1.opendns.com
173.120.226.222
```

Once you have your public IP, create `main.tf` in an empty directory.

```shell-session
~ on ☁️  orenfromberg.tech(us-east-1)
[ 20:27:31 ] ❯ mkdir ssh-cert-auth

~ on ☁️  orenfromberg.tech(us-east-1)
[ 20:28:25 ] ❯ cd ssh-cert-auth

~/ssh-cert-auth on ☁️  orenfromberg.tech(us-east-1)
[ 20:28:34 ] ❯ touch main.tf
```

Open up `main.tf` in your favorite editor and paste the following:

```hcl
provider "aws" {
  region = "us-east-1"
}

variable "my_ip" {
  type = string
}

module "my-remote-host" {
  source = "git@github.com:orenfromberg/infrastructure.git//dev-machine?ref=tags/v0.0.6"
  my-ip  = var.my_ip
  name   = "my-remote-host"
}
```

Make sure that you are using your desired AWS region.

Now is a good time to take a look at [the source for this terraform module](https://github.com/orenfromberg/infrastructure/blob/v0.0.6/dev-machine/main.tf) that you are about to apply. Make sure it isn't doing anything naughty. We'll clean up this instance later, but remember that you will incur a small cost (a matter of cents) for hosting this instance.

Apply this terraform at your own risk. It's your responsibility to clean up after yourself so that you don't get a surprise bill from AWS at the end of the month.

If you haven't signed up for AWS yet, go do that [here](https://aws.amazon.com/). Once you do that, you'll need to install terraform which you can do [here](https://www.terraform.io/downloads.html). For this example, we'll be using terraform 0.12 or higher.

Once you've got your AWS credentials configured with terraform, we can initialize and then apply the terraform:

```shell-session
~/ssh-cert-auth on ☁️  orenfromberg.tech(us-east-1)
[ 20:30:13 ] ❯ terraform init
Initializing modules...
Downloading git@github.com:orenfromberg/infrastructure.git?ref=tags/v0.0.6 for my-remote-host...
- my-remote-host in .terraform/modules/my-remote-host/dev-machine

Initializing the backend...

Initializing provider plugins...
- Checking for available provider plugins...
- Downloading plugin for provider "tls" (hashicorp/tls) 2.1.1...
- Downloading plugin for provider "aws" (hashicorp/aws) 2.38.0...

The following providers do not have any version constraints in configuration,
so the latest version was installed.

To prevent automatic upgrades to new major versions that may contain breaking
changes, it is recommended to add version = "..." constraints to the
corresponding provider blocks in configuration, with the constraint strings
suggested below.

* provider.aws: version = "~> 2.38"
* provider.tls: version = "~> 2.1"

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.

~/ssh-cert-auth on ☁️  orenfromberg.tech(us-east-1) took 16s
[ 20:31:32 ] ❯ terraform apply
var.my_ip
  Enter a value:
```

Enter the IP address from above and hit enter:

```shell-session
module.my-remote-host.data.aws_ami.latest_ubuntu: Refreshing state...

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # module.my-remote-host.aws_instance.dev_machine will be created
  + resource "aws_instance" "dev_machine" {
      + ami                          = "ami-00a208c7cdba991ea"
      + arn                          = (known after apply)
      + associate_public_ip_address  = true
      + availability_zone            = (known after apply)
      + cpu_core_count               = (known after apply)
      + cpu_threads_per_core         = (known after apply)
      + get_password_data            = false
      + host_id                      = (known after apply)
      + id                           = (known after apply)
      + instance_state               = (known after apply)
      + instance_type                = "t2.micro"
      + ipv6_address_count           = (known after apply)
      + ipv6_addresses               = (known after apply)
      + key_name                     = (known after apply)
      + network_interface_id         = (known after apply)
      + password_data                = (known after apply)
      + placement_group              = (known after apply)
      + primary_network_interface_id = (known after apply)
      + private_dns                  = (known after apply)
      + private_ip                   = (known after apply)
      + public_dns                   = (known after apply)
      + public_ip                    = (known after apply)
      + security_groups              = (known after apply)
      + source_dest_check            = true
      + subnet_id                    = (known after apply)
      + tags                         = {
          + "Name" = "my-remote-host"
        }
      + tenancy                      = (known after apply)
      + user_data                    = "0b57dd73b67f3c246523dca5214c0439d0aaac88"
      + volume_tags                  = (known after apply)
      + vpc_security_group_ids       = (known after apply)

      + ebs_block_device {
          + delete_on_termination = (known after apply)
          + device_name           = (known after apply)
          + encrypted             = (known after apply)
          + iops                  = (known after apply)
          + kms_key_id            = (known after apply)
          + snapshot_id           = (known after apply)
          + volume_id             = (known after apply)
          + volume_size           = (known after apply)
          + volume_type           = (known after apply)
        }

      + ephemeral_block_device {
          + device_name  = (known after apply)
          + no_device    = (known after apply)
          + virtual_name = (known after apply)
        }

      + network_interface {
          + delete_on_termination = (known after apply)
          + device_index          = (known after apply)
          + network_interface_id  = (known after apply)
        }

      + root_block_device {
          + delete_on_termination = (known after apply)
          + encrypted             = (known after apply)
          + iops                  = (known after apply)
          + kms_key_id            = (known after apply)
          + volume_id             = (known after apply)
          + volume_size           = (known after apply)
          + volume_type           = (known after apply)
        }
    }

  # module.my-remote-host.aws_key_pair.dev_machine will be created
  + resource "aws_key_pair" "dev_machine" {
      + fingerprint = (known after apply)
      + id          = (known after apply)
      + key_name    = (known after apply)
      + public_key  = (known after apply)
    }

  # module.my-remote-host.aws_security_group.dev_machine will be created
  + resource "aws_security_group" "dev_machine" {
      + arn                    = (known after apply)
      + description            = "Managed by Terraform"
      + egress                 = [
          + {
              + cidr_blocks      = [
                  + "0.0.0.0/0",
                ]
              + description      = ""
              + from_port        = 0
              + ipv6_cidr_blocks = []
              + prefix_list_ids  = []
              + protocol         = "-1"
              + security_groups  = []
              + self             = false
              + to_port          = 0
            },
        ]
      + id                     = (known after apply)
      + ingress                = [
          + {
              + cidr_blocks      = [
                  + "0.0.0.0/0",
                ]
              + description      = ""
              + from_port        = 1025
              + ipv6_cidr_blocks = []
              + prefix_list_ids  = []
              + protocol         = "tcp"
              + security_groups  = []
              + self             = true
              + to_port          = 65535
            },
          + {
              + cidr_blocks      = [
                  + "173.120.226.222/32",
                ]
              + description      = ""
              + from_port        = 22
              + ipv6_cidr_blocks = []
              + prefix_list_ids  = []
              + protocol         = "tcp"
              + security_groups  = []
              + self             = true
              + to_port          = 22
            },
        ]
      + name                   = (known after apply)
      + owner_id               = (known after apply)
      + revoke_rules_on_delete = false
      + vpc_id                 = (known after apply)
    }

  # module.my-remote-host.tls_private_key.dev_machine will be created
  + resource "tls_private_key" "dev_machine" {
      + algorithm                  = "RSA"
      + ecdsa_curve                = "P224"
      + id                         = (known after apply)
      + private_key_pem            = (sensitive value)
      + public_key_fingerprint_md5 = (known after apply)
      + public_key_openssh         = (known after apply)
      + public_key_pem             = (known after apply)
      + rsa_bits                   = 4096
    }

Plan: 4 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value:
```

type `yes` and hit enter:

```shell-session
module.my-remote-host.tls_private_key.dev_machine: Creating...
module.my-remote-host.aws_security_group.dev_machine: Creating...
module.my-remote-host.tls_private_key.dev_machine: Provisioning with 'local-exec'...
module.my-remote-host.tls_private_key.dev_machine (local-exec): Executing: ["/bin/sh" "-c" "echo \"-----BEGIN RSA PRIVATE KEY-----\n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\n-----END RSA PRIVATE KEY-----\n\" > my-remote-host-identity.pem; chmod 400 my-remote-host-identity.pem"]
module.my-remote-host.tls_private_key.dev_machine: Creation complete after 2s [id=a91e62be7e27449a1399b9056380157b48093a7c]
module.my-remote-host.aws_key_pair.dev_machine: Creating...
module.my-remote-host.aws_key_pair.dev_machine: Creation complete after 0s [id=terraform-20191119013348708900000002]
module.my-remote-host.aws_security_group.dev_machine: Creation complete after 3s [id=sg-02bf91ca2333f4764]
module.my-remote-host.aws_instance.dev_machine: Creating...
module.my-remote-host.aws_instance.dev_machine: Still creating... [10s elapsed]
module.my-remote-host.aws_instance.dev_machine: Still creating... [20s elapsed]
module.my-remote-host.aws_instance.dev_machine: Still creating... [30s elapsed]
module.my-remote-host.aws_instance.dev_machine: Provisioning with 'local-exec'...
module.my-remote-host.aws_instance.dev_machine (local-exec): Executing: ["/bin/sh" "-c" "echo \"#!/bin/bash\n\nssh -i my-remote-host-identity.pem ubuntu@54.234.100.25\" > connect-to-my-remote-host.sh; chmod +x connect-to-my-remote-host.sh"]
module.my-remote-host.aws_instance.dev_machine: Creation complete after 34s [id=i-07f16ead7ee21e97a]

Apply complete! Resources: 4 added, 0 changed, 0 destroyed.
```

We've applied the terraform and now the instance is ready for us to SSH into. Here's a summary of what the terraform module accomplished for us.

1. The module provisioned a key pair and then wrote it out to our disk as an identity file (`my-remote-host-identity.pem`).
1. When the AWS provider instantiates the EC2 instance, it specifies a public key that derived from the key pair we provisioned.
1. The EC2 instance is automatically created with the public key as an entry in the user `authorized_keys` file.

These steps ensure that the server can authenticate the client when it attempts to SSH into the server.

First, let's take a look at the public key of the key pair we generated with terraform.
To see the actual public key, we need to get it from the identity file using `ssh-keygen`:

```shell-session
~/ssh-cert-auth on ☁️  orenfromberg.tech(us-east-1)
[ 20:34:06 ] ❯ ssh-keygen -y -f my-remote-host-identity.pem
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQD0akhpv91HIh/xELUIMJQZdm8x7qrxMBKQ8c2vn7/0eWICZK/XnSaZfw7HdF3v8PMELYlJeMOzhm7qUIq4zEHVC5YbnJoWe0Npt7fMVXV/grI1kmoNSm3lmeBRU3LFyd+WbTxW2MC3+1I3IhF6eyTF8YiAnOboz4he2qU28dt5G8UU+380UQ/6ZrSpobam1vwrx0AvglsV9v14/go0aB53HTAcI9gJd8Fg81m5eKeru8Y6MZcZg6WH0n8JI+b2YLCb6etM60RFD9MyC30+PN3gB1AOtautId5B5OwxCnXmTVRemfCMHPA7Nc9DZO5QGR8sQuso5C4Poo4Eas8aPdkb1k7uLVTP0bU9OvrPPrM4pvgpoaMKXQ/VH8X7qPs3gtQrZvJ8UDEAX8XdQ7EjFBdT72GQmdbB0betNnhPxm/LC4R/3FEKlhkEtDKTLOB6qmrzZ+zy1KnWc5tnSgTajnoWxtccwTHw+pTR7Kvwnh6SWK6/Nc3tKmAJM3E5Td8bO1Le4aCLVnLaeRagKCX7A3ZXWv7O8KrSdpF5ZXugD6/65pmC7hfNFuzBzRbQFskDZTJVU27/9XPtmcEObKxg/2S8CBa39nJbFmn+xrwFtNNCLfmQ1zTwPd+ZS7wdPluL9LuiafOFBuxXCfFB2XI6d8vriloRhljocen6RKe8PvUnuw==
```

The terraform module generated a script that will connect you to the EC2 instance:

```bash
~/ssh-cert-auth on ☁️  orenfromberg.tech(us-east-1) took 1m
[ 20:34:02 ] ❯ cat ./connect-to-my-remote-host.sh
#!/bin/bash

ssh -i my-remote-host-identity.pem ubuntu@54.234.100.25
```

Now let's SSH to your newly-created remote host by running the generated script:

```shell-session
~/ssh-cert-auth on ☁️  orenfromberg.tech(us-east-1) took 2m44s
[ 20:34:25 ] ❯ ./connect-to-my-remote-host.sh
The authenticity of host '54.234.100.25 (<no hostip for proxy command>)' can't be established.
ECDSA key fingerprint is SHA256:8xU3w7UM3+X/6h58nE6UhQpUXvUeL9a2mfTbcD5XYiM.
+---[ECDSA 256]---+
|          ......+|
|         . . o++=|
|          . o *==|
|           . + =*|
|        S   o o+*|
|         o .Eo*+O|
|          .  o+OB|
|              oO+|
|             o+o=|
+----[SHA256]-----+
Are you sure you want to continue connecting (yes/no)?
```

Notice the initial warning message. The authenticity of the server can't be established because the client has never seen it before. This is where TOFU comes into play.

`ssh` is asking us to add its key to our `known_hosts` file and trust it on first use. If this host does not provide the same key in the future, we'll get a scary notification like this:

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
```

For now, we'll take a leap of faith and type `yes` and hit enter.

```shell-session
Warning: Permanently added '54.234.100.25' (ECDSA) to the list of known hosts.
Welcome to Ubuntu 18.04.3 LTS (GNU/Linux 4.15.0-1054-aws x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Tue Nov 19 01:36:03 UTC 2019

  System load:  0.82              Processes:              92
  Usage of /:   20.4% of 7.69GB   Users logged in:        0
  Memory usage: 22%               IP address for eth0:    172.31.17.224
  Swap usage:   0%                IP address for docker0: 172.17.0.1

0 packages can be updated.
0 updates are security updates.


*** System restart required ***

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

ubuntu@ip-172-31-17-224:~$
```

Let's check what public key is in the `authorized_keys` file:

```shell-session
ubuntu@ip-172-31-17-224:~$ cat ~/.ssh/authorized_keys
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQD0akhpv91HIh/xELUIMJQZdm8x7qrxMBKQ8c2vn7/0eWICZK/XnSaZfw7HdF3v8PMELYlJeMOzhm7qUIq4zEHVC5YbnJoWe0Npt7fMVXV/grI1kmoNSm3lmeBRU3LFyd+WbTxW2MC3+1I3IhF6eyTF8YiAnOboz4he2qU28dt5G8UU+380UQ/6ZrSpobam1vwrx0AvglsV9v14/go0aB53HTAcI9gJd8Fg81m5eKeru8Y6MZcZg6WH0n8JI+b2YLCb6etM60RFD9MyC30+PN3gB1AOtautId5B5OwxCnXmTVRemfCMHPA7Nc9DZO5QGR8sQuso5C4Poo4Eas8aPdkb1k7uLVTP0bU9OvrPPrM4pvgpoaMKXQ/VH8X7qPs3gtQrZvJ8UDEAX8XdQ7EjFBdT72GQmdbB0betNnhPxm/LC4R/3FEKlhkEtDKTLOB6qmrzZ+zy1KnWc5tnSgTajnoWxtccwTHw+pTR7Kvwnh6SWK6/Nc3tKmAJM3E5Td8bO1Le4aCLVnLaeRagKCX7A3ZXWv7O8KrSdpF5ZXugD6/65pmC7hfNFuzBzRbQFskDZTJVU27/9XPtmcEObKxg/2S8CBa39nJbFmn+xrwFtNNCLfmQ1zTwPd+ZS7wdPluL9LuiafOFBuxXCfFB2XI6d8vriloRhljocen6RKe8PvUnuw== terraform-20191119013348708900000002
```

Check that this is the same as the one we derived from the `.pem` file earlier.

Jim mentioned that each server generates its own SSH keypair when SSH gets installed. Let's take a look:

```shell-session
ubuntu@ip-172-31-17-224:~$ ls -alF /etc/ssh/ssh_host*
-rw------- 1 root root  672 Nov 19 01:34 /etc/ssh/ssh_host_dsa_key
-rw-r--r-- 1 root root  611 Nov 19 01:34 /etc/ssh/ssh_host_dsa_key.pub
-rw------- 1 root root  227 Nov 19 01:34 /etc/ssh/ssh_host_ecdsa_key
-rw-r--r-- 1 root root  183 Nov 19 01:34 /etc/ssh/ssh_host_ecdsa_key.pub
-rw------- 1 root root  411 Nov 19 01:34 /etc/ssh/ssh_host_ed25519_key
-rw-r--r-- 1 root root  103 Nov 19 01:34 /etc/ssh/ssh_host_ed25519_key.pub
-rw------- 1 root root 1679 Nov 19 01:34 /etc/ssh/ssh_host_rsa_key
-rw-r--r-- 1 root root  403 Nov 19 01:34 /etc/ssh/ssh_host_rsa_key.pub
ubuntu@ip-172-31-17-224:~$ cat /etc/ssh/ssh_host_rsa_key.pub
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCmm+0ejmPvm436d4rEL2GjT0/94vxFEuaL7Nv+6d1lmDhxr41pesDjumj7S6BR0YG0xMXHRlM9qFx2hW0y7S7zT0GpUh2/9wQJt8Mk2i2U8LjuFqBgnobUPwQV0RYH/M7DnJN6LsPDFnkT1HvLYcOXl2IPsilFWqC2OgsrMnxx9tYF3J6HSqofhETE6ddRIGc7h1qWaHgROwWEQBLvd2/m0/TCv4SFKDLWXQZfDW8s6WfT+K0WFzni7K07ZOVNJLRUXORZY+HWcD+lryhFy5iX5R2ViLnYPCUB3zUs2jv0/ZPMKMNJyxkffpYfDCbhYE4pQDYOKEGIHMALhotl5Fzp root@ip-172-31-17-224
```

We can also scan the EC2 instance for its public keys from our localhost:

```shell-session
ubuntu@ip-172-31-17-224:~$ exit
logout
Connection to 54.234.100.25 closed.

~/ssh-cert-auth on ☁️  orenfromberg.tech(us-east-1) took 3s
[ 21:08:13 ] ❯ cat ./connect-to-my-remote-host.sh
#!/bin/bash

ssh -i my-remote-host-identity.pem ubuntu@54.234.100.25

~/ssh-cert-auth on ☁️  orenfromberg.tech(us-east-1)
[ 21:08:17 ] ❯ ssh-keyscan 54.234.100.25 | grep ssh-rsa
# 54.234.100.25:22 SSH-2.0-OpenSSH_7.6p1 Ubuntu-4ubuntu0.3
# 54.234.100.25:22 SSH-2.0-OpenSSH_7.6p1 Ubuntu-4ubuntu0.3
# 54.234.100.25:22 SSH-2.0-OpenSSH_7.6p1 Ubuntu-4ubuntu0.3
54.234.100.25 ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCmm+0ejmPvm436d4rEL2GjT0/94vxFEuaL7Nv+6d1lmDhxr41pesDjumj7S6BR0YG0xMXHRlM9qFx2hW0y7S7zT0GpUh2/9wQJt8Mk2i2U8LjuFqBgnobUPwQV0RYH/M7DnJN6LsPDFnkT1HvLYcOXl2IPsilFWqC2OgsrMnxx9tYF3J6HSqofhETE6ddRIGc7h1qWaHgROwWEQBLvd2/m0/TCv4SFKDLWXQZfDW8s6WfT+K0WFzni7K07ZOVNJLRUXORZY+HWcD+lryhFy5iX5R2ViLnYPCUB3zUs2jv0/ZPMKMNJyxkffpYfDCbhYE4pQDYOKEGIHMALhotl5Fzp
```

Check that this key is identical to the one we saw in `/etc/ssh/ssh_host_rsa_key.pub`.

In summary, we've seen that the public key we generated locally with Terraform exists in the users `~/.ssh/authorized_keys` file on the server and that the server keys as seen from within the `/etc/ssh/` directory on the server are identical to the ones we can scan remotely using `ssh-keyscan`.

### Some issues to consider with this approach

Now that we've created an SSH connection with our EC2 instance, you've seen how public-key based authentication is commonly used to allow a client to SSH into a remote server. All in all, this seems like an okay way to manage authentication, but there is an issue to consider with this method.

According to Jim, we're introducing a security vulnerability by practicing TOFU:

> TOFU has the weakness that a man-in-the-middle attack can be performed each time an employee tries to SSH to a machine for the first time. With more employees and more servers, the opportunities for a man-in-the-middle attack grow quadratically. Despite this weakness, TOFU is used by SSH clients by default, and thus by most organizations.

Jim goes on to explain that one could address this weakness by synchronizing a list of server public keys to each user's `known_hosts` file and configure SSH to not enable TOFU. There is a caveat:

> With this default SSH setup, the `authorized_keys` and `known_hosts` files grow large.

This can cause a complexity when it comes to managing the two files on both clients and servers. This is where having an SSH certificate authority can help-- it has the ability to address this complexity in an elegant way.

In the next post in this series, we'll experiment with an SSH certificate authority to see how it addresses this issue to make SSH more secure and easier to scale.
Until then, let's exit back to our host machine and clean up the instance:

```shell-session
ubuntu@ip-172-31-17-224:~$ exit
logout
Connection to 54.234.100.25 closed.

~/ssh-cert-auth on ☁️  orenfromberg.tech(us-east-1) took 9m19s
[ 21:23:31 ] ❯ terraform destroy
var.my_ip
  Enter a value: 173.120.226.222

module.my-remote-host.tls_private_key.dev_machine: Refreshing state... [id=a91e62be7e27449a1399b9056380157b48093a7c]
module.my-remote-host.aws_key_pair.dev_machine: Refreshing state... [id=terraform-20191119013348708900000002]
module.my-remote-host.data.aws_ami.latest_ubuntu: Refreshing state...
module.my-remote-host.aws_security_group.dev_machine: Refreshing state... [id=sg-02bf91ca2333f4764]
module.my-remote-host.aws_instance.dev_machine: Refreshing state... [id=i-07f16ead7ee21e97a]

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  - destroy

Terraform will perform the following actions:

  # module.my-remote-host.aws_instance.dev_machine will be destroyed
  - resource "aws_instance" "dev_machine" {
      - ami                          = "ami-00a208c7cdba991ea" -> null
      - arn                          = "arn:aws:ec2:us-east-1:881815675993:instance/i-07f16ead7ee21e97a" -> null
      - associate_public_ip_address  = true -> null
      - availability_zone            = "us-east-1b" -> null
      - cpu_core_count               = 1 -> null
      - cpu_threads_per_core         = 1 -> null
      - disable_api_termination      = false -> null
      - ebs_optimized                = false -> null
      - get_password_data            = false -> null
      - id                           = "i-07f16ead7ee21e97a" -> null
      - instance_state               = "running" -> null
      - instance_type                = "t2.micro" -> null
      - ipv6_address_count           = 0 -> null
      - ipv6_addresses               = [] -> null
      - key_name                     = "terraform-20191119013348708900000002" -> null
      - monitoring                   = false -> null
      - primary_network_interface_id = "eni-0fa9c80476b6a7012" -> null
      - private_dns                  = "ip-172-31-17-224.ec2.internal" -> null
      - private_ip                   = "172.31.17.224" -> null
      - public_dns                   = "ec2-54-234-100-25.compute-1.amazonaws.com" -> null
      - public_ip                    = "54.234.100.25" -> null
      - security_groups              = [
          - "terraform-20191119013348307200000001",
        ] -> null
      - source_dest_check            = true -> null
      - subnet_id                    = "subnet-1f61b755" -> null
      - tags                         = {
          - "Name" = "my-remote-host"
        } -> null
      - tenancy                      = "default" -> null
      - user_data                    = "0b57dd73b67f3c246523dca5214c0439d0aaac88" -> null
      - volume_tags                  = {} -> null
      - vpc_security_group_ids       = [
          - "sg-02bf91ca2333f4764",
        ] -> null

      - credit_specification {
          - cpu_credits = "standard" -> null
        }

      - root_block_device {
          - delete_on_termination = true -> null
          - encrypted             = false -> null
          - iops                  = 100 -> null
          - volume_id             = "vol-05464baa6ed814b23" -> null
          - volume_size           = 8 -> null
          - volume_type           = "gp2" -> null
        }
    }

  # module.my-remote-host.aws_key_pair.dev_machine will be destroyed
  - resource "aws_key_pair" "dev_machine" {
      - fingerprint = "65:f7:09:f3:6f:d8:43:a2:b9:e9:eb:08:8f:e3:53:2b" -> null
      - id          = "terraform-20191119013348708900000002" -> null
      - key_name    = "terraform-20191119013348708900000002" -> null
      - public_key  = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQD0akhpv91HIh/xELUIMJQZdm8x7qrxMBKQ8c2vn7/0eWICZK/XnSaZfw7HdF3v8PMELYlJeMOzhm7qUIq4zEHVC5YbnJoWe0Npt7fMVXV/grI1kmoNSm3lmeBRU3LFyd+WbTxW2MC3+1I3IhF6eyTF8YiAnOboz4he2qU28dt5G8UU+380UQ/6ZrSpobam1vwrx0AvglsV9v14/go0aB53HTAcI9gJd8Fg81m5eKeru8Y6MZcZg6WH0n8JI+b2YLCb6etM60RFD9MyC30+PN3gB1AOtautId5B5OwxCnXmTVRemfCMHPA7Nc9DZO5QGR8sQuso5C4Poo4Eas8aPdkb1k7uLVTP0bU9OvrPPrM4pvgpoaMKXQ/VH8X7qPs3gtQrZvJ8UDEAX8XdQ7EjFBdT72GQmdbB0betNnhPxm/LC4R/3FEKlhkEtDKTLOB6qmrzZ+zy1KnWc5tnSgTajnoWxtccwTHw+pTR7Kvwnh6SWK6/Nc3tKmAJM3E5Td8bO1Le4aCLVnLaeRagKCX7A3ZXWv7O8KrSdpF5ZXugD6/65pmC7hfNFuzBzRbQFskDZTJVU27/9XPtmcEObKxg/2S8CBa39nJbFmn+xrwFtNNCLfmQ1zTwPd+ZS7wdPluL9LuiafOFBuxXCfFB2XI6d8vriloRhljocen6RKe8PvUnuw==" -> null
    }

  # module.my-remote-host.aws_security_group.dev_machine will be destroyed
  - resource "aws_security_group" "dev_machine" {
      - arn                    = "arn:aws:ec2:us-east-1:881815675993:security-group/sg-02bf91ca2333f4764" -> null
      - description            = "Managed by Terraform" -> null
      - egress                 = [
          - {
              - cidr_blocks      = [
                  - "0.0.0.0/0",
                ]
              - description      = ""
              - from_port        = 0
              - ipv6_cidr_blocks = []
              - prefix_list_ids  = []
              - protocol         = "-1"
              - security_groups  = []
              - self             = false
              - to_port          = 0
            },
        ] -> null
      - id                     = "sg-02bf91ca2333f4764" -> null
      - ingress                = [
          - {
              - cidr_blocks      = [
                  - "0.0.0.0/0",
                ]
              - description      = ""
              - from_port        = 1025
              - ipv6_cidr_blocks = []
              - prefix_list_ids  = []
              - protocol         = "tcp"
              - security_groups  = []
              - self             = true
              - to_port          = 65535
            },
          - {
              - cidr_blocks      = [
                  - "173.120.226.222/32",
                ]
              - description      = ""
              - from_port        = 22
              - ipv6_cidr_blocks = []
              - prefix_list_ids  = []
              - protocol         = "tcp"
              - security_groups  = []
              - self             = true
              - to_port          = 22
            },
        ] -> null
      - name                   = "terraform-20191119013348307200000001" -> null
      - owner_id               = "881815675993" -> null
      - revoke_rules_on_delete = false -> null
      - tags                   = {} -> null
      - vpc_id                 = "vpc-91debfea" -> null
    }

  # module.my-remote-host.tls_private_key.dev_machine will be destroyed
  - resource "tls_private_key" "dev_machine" {
      - algorithm                  = "RSA" -> null
      - ecdsa_curve                = "P224" -> null
      - id                         = "a91e62be7e27449a1399b9056380157b48093a7c" -> null
      - private_key_pem            = (sensitive value)
      - public_key_fingerprint_md5 = "af:44:07:d4:35:27:73:af:c9:dd:f0:97:83:cd:62:b4" -> null
      - public_key_openssh         = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQD0akhpv91HIh/xELUIMJQZdm8x7qrxMBKQ8c2vn7/0eWICZK/XnSaZfw7HdF3v8PMELYlJeMOzhm7qUIq4zEHVC5YbnJoWe0Npt7fMVXV/grI1kmoNSm3lmeBRU3LFyd+WbTxW2MC3+1I3IhF6eyTF8YiAnOboz4he2qU28dt5G8UU+380UQ/6ZrSpobam1vwrx0AvglsV9v14/go0aB53HTAcI9gJd8Fg81m5eKeru8Y6MZcZg6WH0n8JI+b2YLCb6etM60RFD9MyC30+PN3gB1AOtautId5B5OwxCnXmTVRemfCMHPA7Nc9DZO5QGR8sQuso5C4Poo4Eas8aPdkb1k7uLVTP0bU9OvrPPrM4pvgpoaMKXQ/VH8X7qPs3gtQrZvJ8UDEAX8XdQ7EjFBdT72GQmdbB0betNnhPxm/LC4R/3FEKlhkEtDKTLOB6qmrzZ+zy1KnWc5tnSgTajnoWxtccwTHw+pTR7Kvwnh6SWK6/Nc3tKmAJM3E5Td8bO1Le4aCLVnLaeRagKCX7A3ZXWv7O8KrSdpF5ZXugD6/65pmC7hfNFuzBzRbQFskDZTJVU27/9XPtmcEObKxg/2S8CBa39nJbFmn+xrwFtNNCLfmQ1zTwPd+ZS7wdPluL9LuiafOFBuxXCfFB2XI6d8vriloRhljocen6RKe8PvUnuw==\n" -> null
      - public_key_pem             = "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA9GpIab/dRyIf8RC1CDCU\nGXZvMe6q8TASkPHNr5+/9HliAmSv150mmX8Ox3Rd7/DzBC2JSXjDs4Zu6lCKuMxB\n1QuWG5yaFntDabe3zFV1f4KyNZJqDUpt5ZngUVNyxcnflm08VtjAt/tSNyIRensk\nxfGIgJzm6M+IXtqlNvHbeRvFFPt/NFEP+ma0qaG2ptb8K8dAL4JbFfb9eP4KNGge\ndx0wHCPYCXfBYPNZuXinq7vGOjGXGYOlh9J/CSPm9mCwm+nrTOtERQ/TMgt9Pjzd\n4AdQDrWrrSHeQeTsMQp15k1UXpnwjBzwOzXPQ2TuUBkfLELrKOQuD6KOBGrPGj3Z\nG9ZO7i1Uz9G1PTr6zz6zOKb4KaGjCl0P1R/F+6j7N4LUK2byfFAxAF/F3UOxIxQX\nU+9hkJnWwdG3rTZ4T8ZvywuEf9xRCpYZBLQykyzgeqpq82fs8tSp1nObZ0oE2o56\nFsbXHMEx8PqU0eyr8J4ekliuvzXN7SpgCTNxOU3fGztS3uGgi1Zy2nkWoCgl+wN2\nV1r+zvCq0naReWV7oA+v+uaZgu4XzRbswc0W0BbJA2UyVVNu//Vz7ZnBDmysYP9k\nvAgWt/ZyWxZp/sa8BbTTQi35kNc08D3fmUu8HT5bi/S7omnzhQbsVwnxQdlyOnfL\n64paEYZY6HHp+kSnvD71J7sCAwEAAQ==\n-----END PUBLIC KEY-----\n" -> null
      - rsa_bits                   = 4096 -> null
    }

Plan: 0 to add, 0 to change, 4 to destroy.

Do you really want to destroy all resources?
  Terraform will destroy all your managed infrastructure, as shown above.
  There is no undo. Only 'yes' will be accepted to confirm.

  Enter a value: yes

module.my-remote-host.aws_instance.dev_machine: Destroying... [id=i-07f16ead7ee21e97a]
module.my-remote-host.aws_instance.dev_machine: Still destroying... [id=i-07f16ead7ee21e97a, 10s elapsed]
module.my-remote-host.aws_instance.dev_machine: Still destroying... [id=i-07f16ead7ee21e97a, 20s elapsed]
module.my-remote-host.aws_instance.dev_machine: Still destroying... [id=i-07f16ead7ee21e97a, 30s elapsed]
module.my-remote-host.aws_instance.dev_machine: Still destroying... [id=i-07f16ead7ee21e97a, 40s elapsed]
module.my-remote-host.aws_instance.dev_machine: Still destroying... [id=i-07f16ead7ee21e97a, 50s elapsed]
module.my-remote-host.aws_instance.dev_machine: Still destroying... [id=i-07f16ead7ee21e97a, 1m0s elapsed]
module.my-remote-host.aws_instance.dev_machine: Still destroying... [id=i-07f16ead7ee21e97a, 1m10s elapsed]
module.my-remote-host.aws_instance.dev_machine: Still destroying... [id=i-07f16ead7ee21e97a, 1m20s elapsed]
module.my-remote-host.aws_instance.dev_machine: Still destroying... [id=i-07f16ead7ee21e97a, 1m30s elapsed]
module.my-remote-host.aws_instance.dev_machine: Still destroying... [id=i-07f16ead7ee21e97a, 1m40s elapsed]
module.my-remote-host.aws_instance.dev_machine: Destruction complete after 1m43s
module.my-remote-host.aws_key_pair.dev_machine: Destroying... [id=terraform-20191119013348708900000002]
module.my-remote-host.aws_security_group.dev_machine: Destroying... [id=sg-02bf91ca2333f4764]
module.my-remote-host.aws_key_pair.dev_machine: Destruction complete after 0s
module.my-remote-host.tls_private_key.dev_machine: Destroying... [id=a91e62be7e27449a1399b9056380157b48093a7c]
module.my-remote-host.tls_private_key.dev_machine: Destruction complete after 0s
module.my-remote-host.aws_security_group.dev_machine: Destruction complete after 0s

Destroy complete! Resources: 4 destroyed.
```

Don't forget to clean up the identity file and connect script:

```shell-session
~/ssh-cert-auth on ☁️  orenfromberg.tech(us-east-1)
[ 21:35:33 ] ❯ rm connect-to-my-remote-host.sh my-remote-host-identity.pem
rm: remove write-protected regular file 'my-remote-host-identity.pem'? yes
```

Keep an eye out for the second post in this 2-part series where we set up an SSH certificate authority. 👋
