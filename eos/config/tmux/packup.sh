#!/bin/bash

# get the absolute path to this files directory
CURR_PATH=$(dirname "$(readlink -f "$0")")
REPO="$CURR_PATH"

cp -f "$HOME/.tmux.conf" "$REPO/tmux.conf"

echo "$HOME/.tmux.conf -> $REPO/tmux.conf"
