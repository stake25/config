#!/bin/bash

# Check if fzf is installed
if ! command -v fzf &> /dev/null
then
    echo "fzf not found, installing via pacman..."
    
    # Install fzf using pacman
    sudo pacman -S fzf
else
    echo "fzf is already installed."
fi

