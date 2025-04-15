#!/bin/bash

echo "ZSH files -> <filename>.bak"

cp -f "$HOME/.zshrc" "$HOME/.zshrc.bak"
cp -f "$HOME/.zsh_profile" "$HOME/.zsh_profile.bak"
