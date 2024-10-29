#!/bin/bash

# Check if networkmanager-openconnect is already installed
if ! pacman -Qi networkmanager-openconnect &>/dev/null; then
  echo "networkmanager-openconnect is not installed. Installing..."
  sudo pacman -S --noconfirm networkmanager-openconnect
else
  echo "networkmanager-openconnect is already installed."
fi
