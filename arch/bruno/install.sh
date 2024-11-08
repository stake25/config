#!/bin/bash

# Check if Flatpak is installed, install it if not
if ! command -v flatpak &> /dev/null; then
    echo "Flatpak not found. Installing Flatpak..."
    sudo pacman -S --noconfirm flatpak
fi

# Check if Bruno is already installed
if ! flatpak list | grep -iq "Bruno"; then
    echo "Bruno is not installed. Installing Bruno..."
    flatpak install -y flathub com.usebruno.Bruno
else
    echo "Bruno is already installed."
fi

