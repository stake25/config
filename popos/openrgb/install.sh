#!/bin/bash

# Check if OpenRGB is already installed
if command -v openrgb >/dev/null 2>&1; then
  echo "OpenRGB is already installed."
else
  echo "OpenRGB is not installed. Proceeding with installation."

  # Add the OpenRGB repository
  sudo add-apt-repository ppa:thopiekar/openrgb -y

  # Update package list
  sudo apt update

  # Install OpenRGB
  sudo apt install openrgb -y

  echo "OpenRGB has been installed."
fi
