#!/bin/bash

# Ensure the system is up-to-date
sudo pacman -Syu --noconfirm

# Install yay if not already installed (AUR helper)
if ! command -v yay &>/dev/null; then
  echo "yay not found, installing yay..."
  sudo pacman -S yay --noconfirm
fi

# Check if Flatpak is installed, if not, install it
if ! command -v flatpak &>/dev/null; then
  echo "Flatpak not found, installing Flatpak..."
  sudo pacman -S flatpak --noconfirm
fi

# Install OpenRGB from Flatpak
echo "Installing OpenRGB via Flatpak..."
flatpak install flathub org.openrgb.OpenRGB --assumeyes

# Path to the udev rules file
UDEV_RULES_FILE="/etc/udev/rules.d/99-openrgb.rules"

# Check if the udev rules file already exists
if [ ! -f "$UDEV_RULES_FILE" ]; then
  echo "Creating udev rules for OpenRGB..."

  sudo bash -c 'cat <<EOF > /etc/udev/rules.d/99-openrgb.rules
# OpenRGB udev rules
SUBSYSTEM=="usb", ATTR{idVendor}=="1b1c", ATTR{idProduct}=="1b0f", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="1b1c", ATTR{idProduct}=="1b12", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="093a", ATTR{idProduct}=="2510", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="1b1c", ATTR{idProduct}=="0c0f", MODE="0666"
EOF'

  # Reload udev rules
  echo "Reloading udev rules..."
  sudo udevadm control --reload-rules
else
  echo "Udev rules for OpenRGB already exist. Skipping creation."
fi

# Inform the user to restart or log out
echo "Installation complete. Please restart your system or log out and back in to apply the changes."

# Provide instructions to run OpenRGB
echo "To run OpenRGB, simply execute: flatpak run com.openrgb.OpenRGB"
