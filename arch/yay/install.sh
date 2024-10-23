#!/bin/bash

# Check if yay is installed
if ! command -v yay &> /dev/null
then
    echo "yay not found, installing..."
    
    # Update package database
    sudo pacman -Syu
    
    # Install required dependencies
    sudo pacman -S --needed base-devel git
    
    # Clone the yay repository
    git clone https://aur.archlinux.org/yay.git
    
    # Navigate into the yay directory
    cd yay || exit
    
    # Build and install yay
    makepkg -si --noconfirm
    
    # Clean up
    cd ..
    rm -rf yay
    
    echo "yay has been installed."
else
    echo "yay is already installed."
fi

