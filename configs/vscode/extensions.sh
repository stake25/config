#!/bin/sh

for ext in $(cat configs/vscode/extensions.txt); do
  code --install-extension $ext
done
