#!/bin/bash

# Check if WezTerm is installed
if ! command -v wezterm &> /dev/null
then
    echo "WezTerm not found, installing via yay..."
    
    # Check if yay is installed
    if ! command -v yay &> /dev/null
    then
        echo "yay is not installed. Please install yay first."
        exit 1
    fi

    # Install wezterm using yay
    yay -S wezterm
else
    echo "WezTerm is already installed."
fi

