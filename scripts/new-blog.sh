#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

formatted_date=$(date +"%Y-%m-%d %H:%M")

echo "Enter the title of the blog post:"
read -r title

echo "Enter the description of the blog post:"
read -r description

# Convert the string to lowercase and replace spaces with hyphens (kebab case)
slug=$(echo "$title" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

# Truncate the string to a maximum of 20 characters
slug=${slug:0:20}

mkdir -p "content/blog/${slug}"

cat <<EOF > "content/blog/${slug}/index.md"
---
title: ${title}
date: ${formatted_date}
description: ${description}
tags: []
---
EOF