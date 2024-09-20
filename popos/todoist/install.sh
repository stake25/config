#!/bin/bash

# Define the Flatpak application ID for todoist 
FLATPAK_ID="com.todoist.Todoist"

# Check if todoist is already installed
if flatpak list | grep -q "$FLATPAK_ID"; then
  echo "todoist is already installed."
else
  echo "todoist is not installed. Proceeding with installation..."

  # Install todoist via Flatpak
  flatpak install -y flathub "$FLATPAK_ID"

  echo "todoist installation completed."
fi

