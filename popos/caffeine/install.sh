#!/bin/bash

# Check if Steam is installed
if ! command -v caffeine &> /dev/null; then
    echo "Caffeine is not installed. Installing Steam..."
    
    sudo apt update
    
    # Install Steam
    sudo apt install -y steam

    echo "Caffeine has been installed."
else
    echo "Caffeine is already installed."
fi

