#!/bin/bash

# Check if Vim is installed
if ! command -v vim &> /dev/null
then
    echo "Vim not found, installing via pacman..."
    
    # Install vim using pacman
    sudo pacman -S vim
else
    echo "Vim is already installed."
fi

