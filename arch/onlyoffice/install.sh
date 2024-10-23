#!/bin/bash

# Check if Flatpak is installed
if ! command -v flatpak &> /dev/null
then
    echo "Flatpak is not installed. Please install Flatpak first."
    exit 1
fi

# Check if OnlyOffice is installed via Flatpak
if ! flatpak list | grep -q "onlyoffice"; then
    echo "OnlyOffice is not installed, installing via Flatpak..."
    
    # Install OnlyOffice using Flatpak
    flatpak install flathub org.onlyoffice.desktopeditors -y
else
    echo "OnlyOffice is already installed."
fi

