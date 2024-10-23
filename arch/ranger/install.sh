#!/bin/bash

# Check if Ranger is installed
if ! command -v ranger &> /dev/null
then
    echo "Ranger not found, installing via pacman..."
    
    # Install ranger using pacman
    sudo pacman -S ranger
else
    echo "Ranger is already installed."
fi

