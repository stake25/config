#!/bin/bash

# get the absolute path to this files directory
CURR_PATH=$(dirname "$(readlink -f "$0")")
REPO="$CURR_PATH/scripts"

cp -r "$HOME/.scripts" "$REPO/scripts/"

echo "$HOME script files -> $REPO script files"
