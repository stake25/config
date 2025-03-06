#!/bin/bash

# get the absolute path to this files directory
CURR_PATH=$(dirname "$(readlink -f "$0")")
REPO="$CURR_PATH/resources"

echo "$REPO zsh files -> $HOME zsh files"

cp -f "$REPO/zshrc" "$HOME/.zshrc" 
cp -f "$REPO/zsh_profile" "$HOME/.zsh_profile"
