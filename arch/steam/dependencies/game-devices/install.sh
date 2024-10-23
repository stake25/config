#!/bin/bash

# Function to install required packages for game devices
install_game_device_udev() {
    echo "Installing required packages for game devices..."

    # Update package database
    sudo pacman -Syu

    # Install the necessary packages
    sudo pacman -S --needed libevdev evdev udev
}

# Check if the required packages are installed
if ! pacman -Qs libevdev &> /dev/null || ! pacman -Qs evdev &> /dev/null || ! pacman -Qs udev &> /dev/null; then
    install_game_device_udev
else
    echo "Required packages for game devices are already installed."
fi

