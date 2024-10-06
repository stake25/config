#!/bin/bash

# Save the current directory
original_dir=$(pwd)

# Find all install scripts (e.g., install.sh) recursively and execute them
find . -name 'install.sh' | while read -r script; do
  # Get the directory of the script
  script_dir=$(dirname "$script")
  
  # Navigate to the script's directory
  cd "$script_dir" || continue

  # Run the script
  echo "Running $script in $script_dir"
  ./install.sh

  # Return to the original directory
  cd "$original_dir" || exit
done

