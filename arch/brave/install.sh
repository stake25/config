#!/bin/bash

# Define the Flatpak application ID for Brave
BRAVE_FLATPAK_ID="com.brave.Browser"

# Check if Brave is already installed
if flatpak list | grep -q "$BRAVE_FLATPAK_ID"; then
  echo "Brave is already installed."
else
  echo "Brave is not installed. Proceeding with installation..."

  # Install Brave via Flatpak
  flatpak install -y flathub "$BRAVE_FLATPAK_ID"

  echo "Brave installation completed."
fi

