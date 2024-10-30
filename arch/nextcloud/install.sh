#!/bin/bash

# Check if Nextcloud flatpak is installed
if flatpak list | grep -q "com.nextcloud.desktopclient.nextcloud"; then
    echo "Nextcloud Desktop Client is already installed."
else
    echo "Nextcloud Desktop Client is not installed. Installing..."
    # Install Nextcloud Desktop Client
    flatpak install -y flathub com.nextcloud.desktopclient.nextcloud
fi

