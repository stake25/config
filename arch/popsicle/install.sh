#!/bin/bash

# Ensure Flatpak is installed
if ! command -v flatpak &>/dev/null; then
  echo "Flatpak is not installed. Please install it first."
  exit 1
fi

# Add Flathub repository if not already added
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo

# Check if poposicle is installed and install if necessary
if ! flatpak list | grep -q "com.system76.Popsicle"; then
  echo "Poposicle is not installed. Installing..."
  flatpak install -y flathub com.system76.Popsicle
else
  echo "Poposicle is already installed."
fi
