#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if xclip is installed
if command_exists xclip; then
    echo "xclip is already installed."
else
    echo "xclip is not installed. Installing..."

    # Detect the package manager and install xclip
    if command_exists apt; then
        echo "Detected Debian-based system. Installing with apt..."
        sudo apt update && sudo apt install -y xclip
    elif command_exists pacman; then
        echo "Detected Arch-based system. Installing with pacman..."
        sudo pacman -Syu xclip
    elif command_exists dnf; then
        echo "Detected Fedora-based system. Installing with dnf..."
        sudo dnf install -y xclip
    else
        echo "Unsupported package manager. Please install xclip manually."
        exit 1
    fi

    echo "xclip installed successfully."
fi

