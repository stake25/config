#!/bin/bash

# Define the URL for the Visual Studio Code .deb package
VS_CODE_DEB_URL="https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64"

# Define the local filename for the .deb package
DEB_FILE="code_latest_amd64.deb"

# Check if Visual Studio Code is already installed
if command -v code &> /dev/null; then
  echo "Visual Studio Code is already installed."
else
  echo "Visual Studio Code is not installed. Proceeding with installation..."

  # Download the .deb package
  echo "Downloading Visual Studio Code..."
  wget -O "$DEB_FILE" "$VS_CODE_DEB_URL"

  # Install the .deb package
  echo "Installing Visual Studio Code..."
  sudo dpkg -i "$DEB_FILE"

  # Fix any missing dependencies
  echo "Fixing missing dependencies..."
  sudo apt-get install -f

  # Clean up by removing the .deb package
  rm "$DEB_FILE"

  echo "Visual Studio Code installation completed."
fi

