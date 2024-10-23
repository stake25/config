#!/bin/bash

# Define the Flatpak application ID for todoist 
FLATPAK_ID="com.spotify.Client"

# Check if todoist is already installed
if flatpak list | grep -q "$FLATPAK_ID"; then
  echo "spotify is already installed."
else
  echo "spotify is not installed. Proceeding with installation..."

  # Install todoist via Flatpak
  flatpak install -y flathub "$FLATPAK_ID"

  echo "spotify installation completed."
fi

