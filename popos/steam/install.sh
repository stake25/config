#!/bin/bash

# Check if Steam is installed
if ! command -v steam &> /dev/null; then
    echo "Steam is not installed. Installing Steam..."
    
    sudo apt update
    
    # Install Steam
    sudo apt install -y steam

    echo "Steam has been installed."
else
    echo "Steam is already installed."
fi

