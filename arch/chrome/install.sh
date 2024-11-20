#!/bin/bash

# Check if yay is installed, install it if not
if ! command -v yay &>/dev/null; then
  echo "yay is not installed. Installing yay..."
  sudo pacman -S --needed --noconfirm base-devel
  git clone https://aur.archlinux.org/yay.git
  cd yay
  makepkg -si
  cd ..
  rm -rf yay
else
  echo "yay is already installed."
fi

# Check if Google Chrome is installed, install it if not
if ! pacman -Qi google-chrome &>/dev/null; then
  echo "Google Chrome is not installed. Installing Google Chrome..."
  yay -S --noconfirm google-chrome
else
  echo "Google Chrome is already installed."
fi
