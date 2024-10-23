#!/bin/bash

# Define the Flatpak application ID for app to install
FLATPAK_ID="com.bitwarden.desktop"

# Check if the app is already installed
if flatpak list | grep -q "$FLATPAK_ID"; then
  echo "$FLATPAK_ID is already installed."
else
  echo "$FLATPAK_ID is not installed. Proceeding with installation..."

  # Install app via Flatpak
  flatpak install -y flathub "$FLATPAK_ID"

  echo "$FLATPAK_ID installation completed."
fi
