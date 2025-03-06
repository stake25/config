#!/bin/bash

# Iterate over all files in the current directory
for file in *; do
  # Check if the file is not a shell script
  if [[ -f "$file" && "${file##*.}" != "sh" ]]; then
    # Get the filename without the extension
    dirname="${file%.*}"
    # Create a directory with the same name as the file
    mkdir -p "$dirname"
    # Move the file into the newly created directory
    mv "$file" "$dirname/"
  fi
done
