#!/bin/bash

# Check if Flatpak is installed, and install it if not
if ! command -v flatpak &> /dev/null; then
    echo "Flatpak is not installed. Installing..."
    sudo pacman -S --noconfirm flatpak
else
    echo "Flatpak is already installed."
fi

# Check if MakeMKV is installed via Flatpak
if flatpak list | grep -q "com.makemkv.MakeMKV"; then
    echo "MakeMKV is already installed via Flatpak."
else
    echo "MakeMKV is not installed. Installing MakeMKV..."
    flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
    flatpak install -y flathub com.makemkv.MakeMKV
fi

