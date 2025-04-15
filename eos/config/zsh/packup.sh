#!/bin/bash

# get the absolute path to this files directory
CURR_PATH=$(dirname "$(readlink -f "$0")")
REPO="$CURR_PATH/resources"

echo "$HOME zsh files -> $REPO zsh files"

cp -f "$HOME/.zshrc" "$REPO/zshrc"
cp -f "$HOME/.zsh_profile" "$REPO/zsh_profile"
