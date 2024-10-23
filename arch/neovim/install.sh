#!/bin/bash

# Function to install Neovim
install_neovim() {
    echo "Installing Neovim..."

    # Update package database
    sudo pacman -Syu

    # Install Neovim
    sudo pacman -S --needed neovim
}

# Check if Neovim is installed
if ! command -v nvim &> /dev/null; then
    install_neovim
else
    echo "Neovim is already installed."
fi

