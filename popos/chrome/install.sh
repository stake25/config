#!/bin/bash

# Define the URL for the apps .deb package
URL="https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb"

# Define the local filename for the .deb package
DEB_FILE="google-chrome-stable_current_amd64.deb"

# Check if app is already installed
if command -v google-chrome &> /dev/null; then
  echo "$DEB_FILE is already installed."
else
  echo "$DEB_FILE is not installed. Proceeding with installation..."

  # Download the .deb package
  echo "Downloading $DEB_FILE..."
  wget -O "$DEB_FILE" "$URL"

  # Install the .deb package
  echo "Installing $DEB_FILE..."
  sudo dpkg -i "$DEB_FILE"

  # Fix any missing dependencies
  echo "Fixing missing dependencies..."
  sudo apt-get install -f

  # Clean up by removing the .deb package
  rm "$DEB_FILE"

  echo "$DEB_FILE installation completed."
fi

