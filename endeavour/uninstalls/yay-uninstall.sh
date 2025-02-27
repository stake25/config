#!/bin/bash

# Install yay if not already installed (AUR helper)
if ! command -v yay &>/dev/null; then
  echo "yay not found, installing yay..."
  sudo pacman -S yay --noconfirm
fi

PACKAGE_NAME="$1"

if yay -Qs $PACKAGE_NAME > /dev/null; then
    echo "$PACKAGE_NAME is installed. Uninstalling..."
    yay -Rns --noconfirm $PACKAGE_NAME
else
    echo "$PACKAGE_NAME is not installed."
fi
