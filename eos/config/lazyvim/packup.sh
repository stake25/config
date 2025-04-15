#!/bin/bash

# get the absolute path to this files directory

CURR_PATH=$(dirname "$(readlink -f "$0")")
REPO="$CURR_PATH/.."


cd $HOME/.config/
tar -czf "$REPO/lvim.tar.gz" "lvim/"
cd $REPO

echo "tar $HOME/.config/lvim/ -> $CURR_PATH/lvim.tar.gz"

