#!/bin/bash

# Define the Flatpak application ID for todoist 
FLATPAK_ID="com.github.iwalton3.jellyfin-media-player"

# Check if app is already installed
if flatpak list | grep -q "$FLATPAK_ID"; then
  echo "$FLATPAK_ID is already installed."
else
  echo "$FLATPAK_ID is not installed. Proceeding with installation..."

  # Install todoist via Flatpak
  flatpak install -y flathub "$FLATPAK_ID"

  echo "$FLATPAK_ID installation completed."
fi

