#!/bin/bash

# Function to check and install a package
install_if_missing() {
  local package=$1
  if ! yay -Qi "$package" &>/dev/null; then
    echo "$package is not installed. Installing..."
    yay -S "$package"
  else
    echo "$package is already installed."
  fi
}

# Check and install prusa-slicer-git
install_if_missing "prusa-slicer-git"
