#!/bin/bash

# Function to install Tailscale
install_tailscale() {
    echo "Installing Tailscale..."

    # Update package database
    sudo pacman -Syu

    # Install Tailscale
    sudo pacman -S --needed tailscale

}

# Check if Tailscale is installed
if ! command -v tailscale &> /dev/null; then
    install_tailscale
else
    echo "Tailscale is already installed."
fi

# Enable and start Tailscale service
echo "enabling tailscaled"
sudo systemctl enable --now tailscaled

