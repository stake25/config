#!/bin/bash

# Iterate over all files in the current directory
for file in *; do
  # Skip if not a file
  if [[ -f "$file" ]]; then
    # Remove text inside square brackets along with the brackets
    new_name=$(echo "$file" | sed 's/\[[^]]*\]//g')

    # Remove leading/trailing whitespace in the new filename
    new_name=$(echo "$new_name" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

    # Rename the file only if the new name differs from the original
    if [[ "$file" != "$new_name" ]]; then
      mv "$file" "$new_name"
      echo "Renamed: $file -> $new_name"
    fi
  fi
done
