#!/bin/bash

# get the absolute path to this files directory
CURR_PATH=$(dirname "$(readlink -f "$0")")
REPO="$CURR_PATH/resources"

cp -f "$REPO/tmux.conf" "$HOME/.tmux.conf"

echo "$REPO/tmux.conf -> $HOME/tmux.conf"
