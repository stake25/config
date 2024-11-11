#!/bin/bash

# Check if Fish is installed
if ! command -v fish &>/dev/null; then
  echo "Fish shell is not installed. Installing..."
  sudo pacman -S --noconfirm fish
else
  echo "Fish shell is already installed."
fi

# Set Fish as the default shell
if ! grep -q "$(which fish)" /etc/shells; then
  echo "Adding Fish shell to /etc/shells..."
  echo "$(which fish)" | sudo tee -a /etc/shells >/dev/null
fi

# Change the default shell to Fish
echo "Changing default shell to Fish..."
chsh -s "$(which fish)"

echo "Fish shell has been set as the default shell. Please log out and log back in for changes to take effect."
