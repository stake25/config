#!/bin/bash

# Function to enable multilib repository
enable_multilib() {
    echo "Enabling multilib repository..."

    # Backup the current pacman.conf
    sudo cp /etc/pacman.conf /etc/pacman.conf.bak

    # Uncomment the multilib section in pacman.conf
    sudo sed -i '/^\[multilib\]/,/^#/{s/^#//; s/^#//;}' /etc/pacman.conf

    # Uncomment the lines under multilib (packages)
    sudo sed -i '/^\[multilib\]/,/^#/{s/^#//; /^Include/!d;}' /etc/pacman.conf

    # Update package database
    sudo pacman -Sy
}

# Check if multilib is enabled
if ! grep -q "^\[multilib\]" /etc/pacman.conf || ! grep -q "^\s*Include" /etc/pacman.conf; then
    enable_multilib
else
    echo "Multilib repository is already enabled."
fi

# Check if Steam is installed
if ! command -v steam &> /dev/null; then
    echo "Steam not found, installing via pacman..."
    
    # Install Steam using pacman
    sudo pacman -S steam
else
    echo "Steam is already installed."
fi

