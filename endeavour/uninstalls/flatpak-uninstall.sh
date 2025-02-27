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
  echo "$FLATPAK_ID is installed.... removing"

  # Install app via Flatpak
  flatpak uninstall --assumeyes "$FLATPAK_ID"

  echo "$FLATPAK_ID uninstall completed."
else
  echo "$FLATPAK_ID is not installed. Exiting..."
fi
