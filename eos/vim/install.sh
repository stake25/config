#!/bin/bash

# get the absolute path to this files directory
CURR_PATH=$(dirname "$(readlink -f "$0")")
REPO="$CURR_PATH/resources"

cp -f "$REPO/vimrc" "$HOME/.vimrc"

echo "$REPO/vimrc -> $HOME/.vimrc"
