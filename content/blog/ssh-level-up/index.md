---
title: "Leveling Up SSH Authentication"
date: "2023-09-02"
description: SSH Authentication from passwords to keys to certificates.
---

## Introduction

Secure Shell (SSH) is a widely used protocol for securely connecting to remote servers and managing them. SSH authentication involves a client assuming a user account that was provisioned on the remote host beforehand. For example, a user can connect to a remote server with the command 

```
ssh sshuser@server.mydomain.local
```

This command initiates an SSH connection using the `sshuser` account and the hostname `server.mydomain.local`. By default, ssh will assume the username is the same on the client and the host, so if the local user account has the same name as the remote account then the command can be shortened to:

```
ssh server.mydomain.local
```

Once an SSH connection has been established, the user must be authenticated by the server. The methods by which a user is authenticated can vary as well as how the host is authenticated. Let's explore some SSH authentication methods and weigh their costs and benefits.

## Level 1: Password-Based Authentication

The simplest way to authenticate is by using a password.

When the client connects to the server successfully, the user will be prompted to enter the password for the sshuser account. Once authenticated, the user will have a command-line shell to interact with the remote server.

All that is required to set up password authentication is to ensure that the SSH server is running and a user account has been provisioned on the remote host and has a password configured. 

### The Setup

To install the SSH server, follow your operating system instructions for how to install [openssh](https://www.openssh.com/).

For Debian the server can be installed with:

```
apt-get install -y openssh-server
```
To set up a user on the remote host, you'll need to run the following commands:

```
useradd -m -d /home/sshuser -s /bin/bash sshuser
echo 'sshuser:password' | chpasswd
```

This will set up the user `sshuser` with the password `password`.

Let's try it out.

### The Execution

Get a shell on your local machine:

```
sshuser@laptop:/$ 
```

Enter `ssh server.mydomain.local` in the prompt and you should see something like the following:
```
The authenticity of host 'server.mydomain.local (192.168.224.3)' can't be established.
ED25519 key fingerprint is SHA256:PzhrcmX8/01Bnw8ulG/n05FTu92G32eJrZ8NrDyTAh4.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? 
```

The ssh client found a host named `server.mydomain.local` at ip `192.168.224.3` but it has no way to verify that it is who it says it is. Any server on the network could pretend to be the host named `server.mydomain.local`. This kind of attack is called a man in the middle (MitM) attack. Is this the real one?

The server provided a hint in the form of an ssh key fingerprint. This is derived from the private key used by the ssh server and is used to verify the authenticity and integrity of the server. If it looks familiar then it is safe to trust the host.

The client prompts the user to choose whether it wants to trust that it is connecting to the real server. If we say no then the client will accept that the host key verification was a failure and exit. 

If we say yes and verify the authenticity of the server then we get a new prompt:

```
Warning: Permanently added 'server.mydomain.local' (ED25519) to the list of known hosts.
sshuser@server.mydomain.local's password:
```

The client added the public key of the server to a file called `known_hosts`. When the client connects to a server, it checks to see if it has seen it before by looking up the mapping between the name and the public key.

Enter the password `password` and you should see the server banner and shell prompt:
```
Linux server.mydomain.local 5.15.0-78-generic #85-Ubuntu SMP Fri Jul 7 15:25:09 UTC 2023 x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Wed Aug 16 12:08:23 2023 from 192.168.224.2
sshuser@server:~$
```
Exit the server with `exit` to go back to the client:

```
sshuser@server:~$ exit
logout
Connection to server.mydomain.local closed.
sshuser@laptop:/$ 
```

Connect again to the same server with `ssh server.mydomain.local` and we are only prompted for a password.

```
sshuser@laptop:/$ ssh server.mydomain.local
sshuser@server.mydomain.local's password: 
```

We do not get prompted to trust the host because ssh recognized the server in the `known_hosts` file.

Enter your password and you get the server banner message and shell prompt:

```
Linux server.mydomain.local 5.15.0-78-generic #85-Ubuntu SMP Fri Jul 7 15:25:09 UTC 2023 x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Wed Aug 16 12:12:32 2023 from 192.168.224.2
sshuser@server:~$ 
```

### The Reflection

This method of authentication is simple to set up but does have some costs to consider. For example, each host could have a different password so remembering and entering passwords can be tedious. Additionally, using a weak password makes the host vulnerable to a brute-force attack.

Another drawback is that the client needs to authenticate the server manually the first time it connects. While this is a one time thing, if the user isn't careful they can expose themselves to a man in the middle attack.

Fortunately, we can benefit from assymetric cryptography to lighten the load and add some security.
  
## Level 2: SSH Key Authentication

SSH key authentication is a more secure alternative to password-based authentication that uses a public-private key pair instead of a password. The private key is a secret and is kept in the users `~/.ssh` directory with strict file permissions. The public key is not sensitive and can be distributed to remote servers.

After the SSH connection is made, the server will verify that the clients public key has been added to the users `authorized_keys` file. If the public key is there then the server will authenticate the user and give them a login shell.

Let's take a look at how to set up this method of authentication.

### The Setup

Note: The following setup assumes that the user is starting on a fresh system without a `known_hosts` file.

To create a key pair, use the `ssh-keygen` command. The user will be prompted where to save the key and if needed will create the `~/.ssh` directory where SSH key pairs and other assets are kept by default. It will then print out a key fingerprint and the keys randomart image:

```
sshuser@laptop:/$ ssh-keygen -t ed25519 -N 'keypass' -C sshuser@laptop.mydomain.local
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/sshuser/.ssh/id_ed25519): 
Created directory '/home/sshuser/.ssh'.
Your identification has been saved in /home/sshuser/.ssh/id_ed25519
Your public key has been saved in /home/sshuser/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:bxQbOkPw25XRFjzAbRvrvysynD13D3yGqfrjjnAgQv0 sshuser@laptop.mydomain.local
The key's randomart image is:
+--[ED25519 256]--+
|      .    .o=.. |
|     . o    .oO  |
|    . . o o oo = |
|   .   o + =  o  |
|    . . E +  .   |
|     . . *   ..o |
|        . = o =.o|
|         + *.= =o|
|          o=B.+o*|
+----[SHA256]-----+
sshuser@laptop:/$ 
```

Inspect the public key with the command:

```
sshuser@laptop:/$ cat ~/.ssh/id_ed25519.pub 
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIH1J72QUaGjK7dT10KX9NK58noeb4g+M9dW4ANDY+Mms sshuser@laptop.mydomain.local
```

Next we copy this public key to the users `authorized_keys` file on the remote host using `ssh-copy-id`. This tool will require us to use our user password one last time.

```
sshuser@laptop:/$ ssh-copy-id server.mydomain.local
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/sshuser/.ssh/id_ed25519.pub"
The authenticity of host 'server.mydomain.local (192.168.32.3)' can't be established.
ED25519 key fingerprint is SHA256:5FpX62dw5O84yrPCv+XPeuAmGvj7zGP0BQh+6gR8chw.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? 
```

SSH is letting us know that it doesn't recognize the host, just like it did with the previous password authentication.

Enter `yes` to continue copying the public key:

```
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
sshuser@server.mydomain.local's password: 

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'server.mydomain.local'"
and check to make sure that only the key(s) you wanted were added.

sshuser@laptop:/$ 
```

The tool asks us to try logging in without using the user password and verify that the correct key was added, so let's try it out.

### The Execution

```
sshuser@laptop:/$ ssh server.mydomain.local
Enter passphrase for key '/home/sshuser/.ssh/id_ed25519':
```

Wait, what? Now you might be thinking -

> Huh? I thought we don't need a password anymore to authenticate. Why am I being prompted for a password now?

This isn't prompting for your user password, it's asking for the **passphrase** on your SSH key. In order to use the key for the authentication challenge, it needs to be unlocked first.

Note that we created the key pair above using the `-N 'keypass` argument to specify the passphrase for unlocking the key.

After entering the passphrase, you will get the server banner and the shell prompt:

```
Linux server.mydomain.local 5.15.0-78-generic #85-Ubuntu SMP Fri Jul 7 15:25:09 UTC 2023 x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Thu Aug 17 18:50:00 2023 from 192.168.16.2
sshuser@server:~$ 
```

Now let's take a look at the users `authorized_keys` file on the server:

```
sshuser@server:~$ cat ~/.ssh/authorized_keys 
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIH1J72QUaGjK7dT10KX9NK58noeb4g+M9dW4ANDY+Mms sshuser@laptop.mydomain.local
```

Sure enough we can see that our public key from above was added properly.

Finally, we can disable password authentication on the server so that we enforce SSH key authentication. To do this, use the following commands to modify the SSH server configuration and restart the daemon:

```
cat "PasswordAuthentication no" >> /etc/ssh/sshd_config
sudo service ssh restart
```

Now password authentication is disabled and we are required to use our SSH key to login to the remote host.

### Reflection

While SSH key authentication is more complex to set up than password authentication, it is far more secure because it is much more difficult to brute force attack an SSH key than a password.

Additionally, it is more convenient since a user no longer needs to remember a password for each host but at most a single passphrase for their private key.

Here are some additional details to keep in mind regarding SSH key authentication:

* the private key should never leave the device and must restrict read/write access to the owner of the key
* To set the file permissions on a private key, use `chmod 600 <filename>` to do so
* SSH key authentication can be more easily automated for tasks and non-interactive connections than password authentication
* a tool called `ssh-agent` is responsible for loading the private key into memory on the client-side. To ensure that the ssh agent is running and the keys have been added, use the following commands:
    ```
    eval "$(ssh-agent)"
    ssh-add
    ```
* Revoking access to a user from a server involves managing the `authorized_keys` file

One last problem with this method is that we still need to authenticate the server the first time we connect to it and are still exposed to a Man-in-the-Middle attack.

Now we can explore how SSH key authentication can be used to authenticate the server as well as the host.

## Server based ssh-key authentication

Again, the following assumes we are starting with a fresh system that does not have a `known_hosts` file.

### The Setup

Go through the steps of setting up the key pair again:

```
ssh-keygen -t ed25519 -N 'keypass' -C sshuser@laptop.mydomain.local
```

Now we need to add the servers public key to the `known_hosts` file. To do this, let's use `ssh-keyscan`:

```
sshuser@laptop:/$ ssh-keyscan server.mydomain.local >> ~/.ssh/known_hosts
```
Now inspect the `known_hosts` file:

```
sshuser@laptop:/$ cat ~/.ssh/known_hosts
server.mydomain.local ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDbnS13HcOPDCXMlba85eq2nE2J8ekINjvaWAId4ArJ5TzaigFNsyigm5NgmMALSlbTeJH0vPH8rmqGfp9psvVpKOeGEwqkMQb+A5XcmsSp1QykDgt3quM6wEKc+cSRxKSrqurtvg/y6SZl8M/qYzVo+n4l9p+CXOqVRp+B5pPznkp+lKsRB/IZwwTY8Fo1UU9wzTCGYdTpbBLgNGBjeI2jsa8ba1dJ0c9rhVx/1pk4j7lBpGDIvmtNHkgQx0aQSZgvdL0JDlQ9gi81yh20sfXF49BWHm9x/m0XkpJ+Xcjx96g8zzPEuAuhr26cRvD0BhCnELXkBni+tLp0QVYESzJEeg7hQ2y9MnIthJhizyrShD8/Mdt0VoZppu1a4A+thao2V624owBqj0Fa/gPfrda9Vah+VaH550AiNo4WdFucCdOWRXCniUbg8Y0YLQNTLhVney28YFDQECuML+Px1XdHjLDqRFG5ienFrAqepk61CEOys+UlinYBlhuOwRHjY4k=
server.mydomain.local ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBOJHUEUcrYk5p6fjx21qSe8Infoz2BpG9Yr6Rgwc/oRE2NnsgufzjNfD92JyfurBvAIFwTBqmRN5qPkUzNGf7Lw=
server.mydomain.local ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIL8JX394OsTpRrYmuy1Wq9YZdoDQgkviCuR8uaanhZ7L
sshuser@laptop:/$ 
```

Here you can see the three public keys for the host `server.mydomain.local`. Each one uses a different algorithm.

Now copy the client public key over to the server with `ssh-copy-id`, using the password once again:

```
sshuser@laptop:/$ ssh-copy-id server.mydomain.local
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/sshuser/.ssh/id_ed25519.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
sshuser@server.mydomain.local's password: 

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'server.mydomain.local'"
and check to make sure that only the key(s) you wanted were added.

sshuser@laptop:/$ 
```

Now we can try the login:

### The Execution

```
sshuser@laptop:/$ ssh server.mydomain.local
Enter passphrase for key '/home/sshuser/.ssh/id_ed25519': 
Linux server.mydomain.local 5.15.0-78-generic #85-Ubuntu SMP Fri Jul 7 15:25:09 UTC 2023 x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
sshuser@server:~$ 
```

### Reflection

That was smooth. We just ssh'd right in!

The problem is that for every host you want to connect to, you need to scan their public keys and add to your `known_hosts` file, and you need to update the `authorized_keys` on the server to have your public key.

This is where certificate authentication can shine.

## Level 3: Host Certificate Authentication

Host certificate authentication involves generating certificates for SSH servers. Certificates are issued by a Certificate Authority (CA) and signed with the CA's private key. Clients verify the server's certificate, ensuring secure connections and protection against man-in-the-middle attacks.

*Pros:*
- Enhances server identity verification.
- Ideal for large-scale environments with multiple servers.
- Adds an extra layer of security through certificate signing.

*Cons:*
- Setup requires creating and managing a Certificate Authority.
- Complexity might be higher compared to other methods.

## Client Certificate Authentication

Client certificate authentication extends the use of certificates to authenticate clients. Users generate a certificate signed by a CA, providing stronger authentication than passwords or even SSH keys.

*Pros:*
- Enhanced security; users need both a private key and a signed certificate.
- Centralized management of user certificates.
- Useful for situations requiring granular user access control.

*Cons:*
- Requires setting up and managing a Certificate Authority.
- More complex initial setup for users and servers.

## Restricting Certificate Authentication to Certain Principals

Certificate authentication can be further restricted by specifying the allowed principals (users or hosts) within the signed certificates. To achieve this:

1. Configure the server's `sshd_config` to require certificates for authentication.
2. Include the `principals` field in the certificate, listing the allowed users or hosts.
3. Servers verify the client certificate's principals to grant access.

## Conclusion

SSH authentication methods play a crucial role in securing remote connections. While passwords and SSH keys are widely used, certificate-based methods provide a higher level of security and flexibility. Host certificate authentication helps protect against man-in-the-middle attacks, while client certificate authentication enhances user identity verification. It's important to choose the right method based on your security needs, and in many cases, a combination of these methods can be employed to create a robust and secure authentication strategy for your SSH infrastructure.
