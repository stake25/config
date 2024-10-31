#!/bin/bash

# Check if luarocks is installed
if ! command -v luarocks &>/dev/null; then
  echo "Luarocks is not installed. Installing..."
  sudo pacman -S --noconfirm luarocks
else
  echo "Luarocks is already installed."
fi
