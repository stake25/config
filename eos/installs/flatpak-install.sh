#!/bin/bash

# Check if Flatpak is installed, install it if not
if ! command -v flatpak &> /dev/null; then
    echo "Flatpak not found. Installing Flatpak..."
    sudo pacman -S --noconfirm flatpak
fi

# Define the Flatpak application ID for app to install
FLATPAK_ID="$1"

# Check if the app is already installed
if flatpak list | grep -q "$FLATPAK_ID"; then
  echo "$FLATPAK_ID is already installed."
else
  echo "$FLATPAK_ID is not installed. Proceeding with installation..."

  # Install app via Flatpak
  flatpak install --assumeyes flathub "$FLATPAK_ID"

  echo "$FLATPAK_ID installation completed."
fi
