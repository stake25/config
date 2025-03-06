#!/bin/bash

echo "zsh.bak files -> zsh files"

cp -f "$HOME/.zshrc.bak" "$HOME/.zshrc"
cp -f "$HOME/.zsh_profile.bak" "$HOME/.zsh_profile" 
