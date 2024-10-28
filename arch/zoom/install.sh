#!/bin/bash

# Function to install Zoom using Flatpak
install_zoom_flatpak() {
    echo "Installing Zoom via Flatpak..."

    # Install Zoom via Flatpak
    flatpak install -y flathub us.zoom.Zoom
}

# Check if Flatpak is installed
if ! command -v flatpak &> /dev/null; then
    echo "Flatpak is not installed. Please install Flatpak first."
    exit 1
fi

# Check if Zoom is installed via Flatpak
if ! flatpak list | grep -q "us.zoom.Zoom"; then
    install_zoom_flatpak
else
    echo "Zoom is already installed via Flatpak."
fi

