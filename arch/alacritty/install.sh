#!/bin/bash

# Check if Alacritty is installed
if ! command -v alacritty &>/dev/null; then
  echo "Alacritty is not installed. Installing..."
  sudo pacman -Syu --needed alacritty
  if [ $? -eq 0 ]; then
    echo "Alacritty installed successfully!"
  else
    echo "Failed to install Alacritty."
  fi
else
  echo "Alacritty is already installed."
fi
