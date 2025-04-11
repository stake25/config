#!/bin/bash

# get the absolute path to this files directory
CURR_PATH=$(dirname "$(readlink -f "$0")")
REPO="$CURR_PATH/resources"

cp -f "$HOME/.config/alacritty/*" "$REPO/"

echo "$HOME/.config/alacritty/* -> $REPO/"
