#!/bin/bash

# get the absolute path to this files directory
CURR_PATH=$(dirname "$(readlink -f "$0")")
REPO="$CURR_PATH/scripts"

mkdir -p "$HOME/.scripts"
cp "$REPO/scripts/*" "$HOME/.scripts/"

echo "$REPO script files -> $HOME script files"
