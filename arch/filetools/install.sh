#!/bin/bash

# Function to check and install a package
install_if_missing() {
  local package=$1
  if ! pacman -Qi "$package" &>/dev/null; then
    echo "$package is not installed. Installing..."
    sudo pacman -S --noconfirm "$package"
  else
    echo "$package is already installed."
  fi
}

# Check and install dosfstools and ntfsprogs
install_if_missing "dosfstools"
install_if_missing "ntfsprogs"
