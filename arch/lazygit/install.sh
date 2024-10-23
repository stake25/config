#!/bin/bash

# Check if LazyGit is installed
if ! command -v lazygit &> /dev/null
then
    echo "LazyGit not found, installing via pacman..."
    
    # Install lazygit using pacman
    sudo pacman -S lazygit
else
    echo "LazyGit is already installed."
fi

