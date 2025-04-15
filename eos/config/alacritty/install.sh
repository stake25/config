#!/bin/bash

# get the absolute path to this files directory
CURR_PATH=$(dirname "$(readlink -f "$0")")
REPO="$CURR_PATH/alacritty"

cp -rf "$REPO" "$HOME/.config/"

echo "$REPO -> $HOME/.config/"       
