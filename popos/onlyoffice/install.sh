#!/bin/bash

# Check if Flatpak is installed
if ! command -v flatpak &> /dev/null; then
    echo "Flatpak is not installed. Installing Flatpak..."
    sudo apt update
    sudo apt install -y flatpak
fi

if ! flatpak list | grep -q "onlyoffice"; then
  # Add Flathub repository if not already added
  echo "Adding Flathub repository..."
  sudo flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo

# Check if OnlyOffice is installed via Flatpak
    echo "OnlyOffice is not installed. Installing OnlyOffice..."
    sudo flatpak install -y flathub org.onlyoffice.desktopeditors
    echo "OnlyOffice has been installed."
else
    echo "OnlyOffice is already installed."
fi

