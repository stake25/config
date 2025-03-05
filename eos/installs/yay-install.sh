#!/bin/bash

# Install yay if not already installed (AUR helper)
if ! command -v yay &>/dev/null; then
  echo "yay not found, installing yay..."
  sudo pacman -S yay --noconfirm
fi

PACKAGE_NAME="$1"

# Check if program is installed, install it if not
if ! pacman -Qi "$PACKAGE_NAME" &>/dev/null; then
  echo "$PACKAGE_NAME is not installed. Installing $PACKAGE_NAME..."
  yay -S --noconfirm --sudoloop $PACKAGE_NAME
else
  echo "$PACKAGE_NAME is already installed."
fi
