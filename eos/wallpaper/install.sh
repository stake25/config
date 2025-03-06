#!/bin/bash

# get the absolute path to this files directory
CURR_PATH=$(dirname "$(readlink -f "$0")")
REPO="$CURR_PATH/wallpapers"

# Source and destination directories
WALLPAPER="$HOME/Pictures/wallpaper"

# Create the destination directory if it doesn't exist
mkdir -p "$WALLPAPER"

# Find and copy image files
find "$REPO" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.bmp" \) -exec cp {} "$WALLPAPER" \;

echo "All image files have been copied to $WALLPAPER"
