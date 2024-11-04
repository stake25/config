#!/bin/bash

# Save the current directory
original_dir=$(pwd)

# Find all install.sh scripts and iterate over them
find . -name "install.sh" | while read -r install_script
do
    # Get the directory of the install.sh script
    script_dir=$(dirname "$install_script")

    echo "Navigating to $script_dir"
    
    # Navigate to the directory
    cd "$script_dir" || continue

    # Run the install.sh script and capture its output safely
    echo "Running $install_script"
    ./install.sh | tee -a "$original_dir/install_log.txt" 2>&1

    # Return to the original directory
    echo "Returning to $original_dir"
    cd "$original_dir"
done
