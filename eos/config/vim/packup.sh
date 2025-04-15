#!/bin/bash

# get the absolute path to this files directory
CURR_PATH=$(dirname "$(readlink -f "$0")")
REPO="$CURR_PATH/resources"

cp -f "$HOME/.vimrc" "$REPO/vimrc"

echo "$HOME/.vimrc -> $REPO/vimrc"
