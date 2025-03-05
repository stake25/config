#!/bin/bash

# Save the current directory
original_dir=$(pwd)

# Find all config.sh scripts and iterate over them
find . -name "config.sh" | while read -r config_script
do
    # Get the directory of the config.sh script
    script_dir=$(dirname "$config_script")

    echo "Navigating to $script_dir"
    
    # Navigate to the directory
    cd "$script_dir" || continue

    # Run the config.sh script and capture its output safely
    echo "Running $config_script"
    ./config.sh | tee -a "$original_dir/config_log.txt" 2>&1

    # Return to the original directory
    echo "Returning to $original_dir"
    cd "$original_dir"
done
