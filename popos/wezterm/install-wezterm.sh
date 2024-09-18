#!/bin/bash

PACKAGE_NAME="org.wezfurlong.wezterm"  # Replace with the actual Flatpak package name

# Check if the Flatpak package is installed
if flatpak list | grep -q "$PACKAGE_NAME"; then
  echo "$PACKAGE_NAME is already installed."
else
  echo "$PACKAGE_NAME is not installed. Installing..."
  flatpak install -y "$PACKAGE_NAME"
fi

