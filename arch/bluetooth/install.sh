#!/bin/bash

# Function to install bluez
install_bluetooth() {
    echo "Installing bluez..."

    # Update package database
    sudo pacman -Syu

    # Install bluez
    sudo pacman -S --needed bluez
    sudo pacman -S --needed bluez-utils
}

# Check if bluez is installed
install_bluetooth

sudo systemctl enable bluetooth

