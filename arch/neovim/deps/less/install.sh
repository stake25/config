#!/bin/bash

# Check if less is installed
if ! command -v less &> /dev/null
then
    echo "less not found, installing via pacman..."
    
    # Install less using pacman
    sudo pacman -S less --noconfirm
else
    echo "less is already installed."
fi

