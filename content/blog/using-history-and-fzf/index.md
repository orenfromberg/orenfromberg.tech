---
title: Search your command history with fzf
date: 2023-09-16 10:00
description: A powerful way to search your command history using fzf.
tags: ["shell","linux","bash","zsh"]
---

Try using history with [fzf](https://github.com/junegunn/fzf) to search your shell history and find old commands:

```shell
history -f | fzf
```

`history -f` will print out a timestamp along with the command so you know when you last used it.