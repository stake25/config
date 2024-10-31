#!/bin/bash

FONT_NAME="FiraCode Nerd Font"

# Check if the FiraCode Nerd Font is already installed
if fc-list | grep -i "FiraCode Nerd Font" > /dev/null; then
  echo "$FONT_NAME is already installed."
else
  echo "$FONT_NAME is not installed. Installing..."

  # Create a directory for the fonts
  mkdir -p ~/.local/share/fonts

  # Download the FiraCode Nerd Font
  wget -P ~/.local/share/fonts https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/FiraCode.zip

  # Unzip the font into the fonts directory
  unzip ~/.local/share/fonts/FiraCode.zip -d ~/.local/share/fonts

  # Refresh the font cache
  fc-cache -fv

  # Remove the zip file after installation
  rm ~/.local/share/fonts/FiraCode.zip

  echo "$FONT_NAME has been installed successfully."
fi

