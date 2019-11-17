---
title: SSH Certificate Authority
date: "2019-11-16"
description: How to set up an SSH Certificate Authority by example.
# draft: true
---

This post is based off [this post](https://jameshfisher.com/2018/03/16/how-to-create-an-ssh-certificate-authority/) by Jim Fisher. I enjoyed reading his post but I wanted to follow along interactively. The goal of this post is to run through the concepts that Jim explained so well in his post about how to achieve user authentication using a certificate authority, but while doing the steps with actual instances. We'll do this using [a terraform module that I wrote](https://github.com/orenfromberg/infrastructure) to provision EC2 instances to mess around with.

## SSH public key-based authentication

Jim begins with the problem that assymetric cryptography solves for SSH:

> "When an SSH client opens an SSH connection to an SSH server, there are a couple of trust issues to resolve. The server needs to know whether this is truly an authorized client, and the client needs to know whether the server is truly the server it claims to be."

According to Jim, most organizations will deal with these trust issues in the followings ways:

- For the server to know whether this is truly an authorized client, it simply needs to check if the clients public key is found in their user authorized keys file (located at `~/.ssh/authorized_keys` on the server).

- For the client to know whether this server is legitimate, it needs to check if the server is found in the clients known hosts file (located at `~/.ssh/known_hosts` on the client).

When the client is checking if the server truly is who it claims to be and the server doesn't exist in the known hosts file, the client will take a leap of faith and trust the server's public key the first time it sees it. This policy is called Trust-On-First-Use (TOFU) and can be exploited by an attacker the first time a client SSHs to a machine.

Let's test this common configuration with the terraform module. First, get your public IP address that is assigned to you by your ISP. You can find this out by googling [what is my ip](https://www.google.com/search?q=what+is+my+ip).

![](2019-11-16-23-32-06.png)

Once you have your public IP, create `main.tf` in an empty directory.

```sh
$ touch main.tf
```

now open up `main.tf` in your favorite editor and paste the following:

```terraform
provider "aws" {
  region  = "us-east-1"
}

module "my-instance" {
  source = "git@github.com:orenfromberg/infrastructure.git//dev-machine?ref=tags/v0.0.5"
  my-ip = "75.96.70.42"
  name  = "my-remote-host"
}
```

Make sure to set `my-ip` as the IP address that you got from google, as well as make sure that you are using your desired region.

Now is a good time to take a look at [the source for this terraform module](https://github.com/orenfromberg/infrastructure/blob/master/dev-machine/main.tf) that you are about to apply. Make sure it isn't doing anything naughty. We'll clean up this instance later, but remember that you will incur a small cost (a matter of cents) for hosting this instance. Apply this terraform at your own risk, I won't be held responsible if you don't clean it up and get a surprise bill from AWS at the end of the month.

If you haven't signed up for AWS yet, go do that [here](https://aws.amazon.com/). Once you do that, you'll need to install terraform which you can do [here](https://www.terraform.io/downloads.html). For this example, we'll be using terraform 0.12 or higher.

Once you've got your AWS credentials configured with terraform, we can initialize and then apply the terraform:

```sh
$ terraform init
Initializing modules...
Downloading git@github.com:orenfromberg/infrastructure.git?ref=tags/v0.0.5 for my-instance...
- my-instance in .terraform/modules/my-instance/dev-machine

Initializing the backend...

Initializing provider plugins...
- Checking for available provider plugins...
- Downloading plugin for provider "aws" (hashicorp/aws) 2.36.0...
- Downloading plugin for provider "tls" (hashicorp/tls) 2.1.1...

The following providers do not have any version constraints in configuration,
so the latest version was installed.

To prevent automatic upgrades to new major versions that may contain breaking
changes, it is recommended to add version = "..." constraints to the
corresponding provider blocks in configuration, with the constraint strings
suggested below.

* provider.aws: version = "~> 2.36"
* provider.tls: version = "~> 2.1"

Terraform has been successfully initialized!

$ terraform apply

...lots of stuff

Plan: 4 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value:
```

type `yes` and hit enter:

```sh
module.my-instance.tls_private_key.dev_machine: Creating...
module.my-instance.tls_private_key.dev_machine: Provisioning with 'local-exec'...
module.my-instance.tls_private_key.dev_machine (local-exec): Executing: ["/bin/sh" "-c" "echo \"-----BEGIN RSA PRIVATE KEY-----\n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\n-----END RSA PRIVATE KEY-----\n\" > my-remote-host-identity.pem; chmod 400 my-remote-host-identity.pem"]
module.my-instance.tls_private_key.dev_machine: Creation complete after 1s [id=80794d13996e22324eed9caa3bf29815fc3bf7ef]
module.my-instance.aws_key_pair.dev_machine: Creating...
module.my-instance.aws_security_group.dev_machine: Creating...
module.my-instance.aws_key_pair.dev_machine: Creation complete after 1s [id=terraform-20191117045704481300000001]
module.my-instance.aws_security_group.dev_machine: Creation complete after 2s [id=sg-092a0b9a0ba1a80c8]
module.my-instance.aws_instance.dev_machine: Creating...
module.my-instance.aws_instance.dev_machine: Still creating... [10s elapsed]
module.my-instance.aws_instance.dev_machine: Still creating... [20s elapsed]
module.my-instance.aws_instance.dev_machine: Still creating... [30s elapsed]
module.my-instance.aws_instance.dev_machine: Provisioning with 'local-exec'...
module.my-instance.aws_instance.dev_machine (local-exec): Executing: ["/bin/sh" "-c" "echo \"#!/bin/bash\n\nssh -i my-remote-host-identity.pem ubuntu@35.174.168.74\" > connect-to-my-remote-host.sh; chmod +x connect-to-my-remote-host.sh"]
module.my-instance.aws_instance.dev_machine: Creation complete after 33s [id=i-04113d2ba80f1f806]

Apply complete! Resources: 4 added, 0 changed, 0 destroyed.
```

We've applied the terraform and now the instance is ready for us to SSH into. Here's a summary of what the terraform module accomplished for us.

1. The module provisioned a key pair and then wrote it out to our disk as an identity file (`my-remote-host-identity.pem`).
1. When the AWS provider instantiates the EC2 instance, it specifies a public key that derived from the key pair we just provisioned.
1. The EC2 instance is automatically created with the public key as an entry in the user `authorized_keys` file.

These steps ensure that the server can authenticate the client when it attempts to SSH into the server.

Now let's SSH to your newly created remote host by running the generated script:

```sh
$ ./connect-to-my-remote-host.sh
The authenticity of host '35.174.168.74 (<no hostip for proxy command>)' can't be established.
ECDSA key fingerprint is SHA256:neDl48IFIDs6NC8Tb7JWfjPb1e9wsVzQ7lIy4vYbqLw.
+---[ECDSA 256]---+
|    . .          |
|     o .       . |
|  + o   o .   . .|
| . * . . * .   o |
|  * =   S * . + +|
|   X   . o + + O |
|  o . + o o * * .|
| .   . = + o = o |
|      . . E. .=. |
+----[SHA256]-----+
Are you sure you want to continue connecting (yes/no)?
```

Notice the initial warning message. The authenticity of the server can't be established because the client has never seen it before. This is where TOFU comes into play.

Take a leap of faith; type yes and hit enter.

```sh
Warning: Permanently added '35.174.168.74' (ECDSA) to the list of known hosts.
Welcome to Ubuntu 18.04.3 LTS (GNU/Linux 4.15.0-1054-aws x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Sun Nov 17 05:02:56 UTC 2019

  System load:  0.1               Processes:              90
  Usage of /:   20.4% of 7.69GB   Users logged in:        0
  Memory usage: 22%               IP address for eth0:    172.31.85.238
  Swap usage:   0%                IP address for docker0: 172.17.0.1

0 packages can be updated.
0 updates are security updates.



The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

ubuntu@ip-172-31-85-238:~$
```

Now that you've logged in, you've seen how public-key based authentication is used to SSH into a remote machine. For every machine that we instantiate with this model, we'll have a new key pair to manage. According to Jim:

> "With this default SSH setup, the `authorized_keys` and `known_hosts` files grow large. A way to avoid this is to change the authentication mechanism to instead use a “certificate authority”."

Now let's exit back to our host machine and see if we can use a certificate authority to make this process more secure and easier to scale.

```sh
ubuntu@ip-172-31-85-238:~$ exit
logout
Connection to 35.174.168.74 closed.
```

Before we start the next section, take a moment to clean up our instance:

```sh
$ terraform destroy

...yet even more stuff

Plan: 0 to add, 0 to change, 4 to destroy.

Do you really want to destroy all resources?
  Terraform will destroy all your managed infrastructure, as shown above.
  There is no undo. Only 'yes' will be accepted to confirm.

  Enter a value: yes

module.my-instance.aws_instance.dev_machine: Destroying... [id=i-04113d2ba80f1f806]
module.my-instance.aws_instance.dev_machine: Still destroying... [id=i-04113d2ba80f1f806, 10s elapsed]
module.my-instance.aws_instance.dev_machine: Still destroying... [id=i-04113d2ba80f1f806, 20s elapsed]
module.my-instance.aws_instance.dev_machine: Still destroying... [id=i-04113d2ba80f1f806, 30s elapsed]
module.my-instance.aws_instance.dev_machine: Still destroying... [id=i-04113d2ba80f1f806, 40s elapsed]
module.my-instance.aws_instance.dev_machine: Destruction complete after 40s
module.my-instance.aws_key_pair.dev_machine: Destroying... [id=terraform-20191117045704481300000001]
module.my-instance.aws_security_group.dev_machine: Destroying... [id=sg-092a0b9a0ba1a80c8]
module.my-instance.aws_key_pair.dev_machine: Destruction complete after 0s
module.my-instance.tls_private_key.dev_machine: Destroying... [id=80794d13996e22324eed9caa3bf29815fc3bf7ef]
module.my-instance.tls_private_key.dev_machine: Destruction complete after 0s
module.my-instance.aws_security_group.dev_machine: Destruction complete after 0s

Destroy complete! Resources: 4 destroyed.
```

## Authentication with a Certificate Authority
