#!/bin/bash

# Source and destination directories
src_dir="$HOME/Pictures/wallpaper"
dest_dir="./wallpapers"

# Create the destination directory if it doesn't exist
mkdir -p "$dest_dir"

# Find and copy image files
find "$src_dir" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.bmp" \) -exec cp {} "$dest_dir" \;

echo "All image files have been copied to $dest_dir"

