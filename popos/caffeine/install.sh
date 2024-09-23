#!/bin/bash

# Check if Caffeine is installed
if ! command -v caffeine &> /dev/null; then
    echo "Caffeine is not installed. Installing Caffeine..."
    
    sudo apt update
    
    # Install Steam
    sudo apt install -y caffeine

    echo "Caffeine has been installed."
else
    echo "Caffeine is already installed."
fi

