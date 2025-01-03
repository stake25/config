#!/bin/bash

# Check if Slack is already installed
if ! pacman -Qi slack-desktop &>/dev/null; then
  echo "Slack is not installed. Installing with yay..."
  if command -v yay &>/dev/null; then
    yay -S --noconfirm slack-desktop
    echo "Slack has been installed successfully."
  else
    echo "Error: yay is not installed. Please install yay first."
    exit 1
  fi
else
  echo "Slack is already installed. No action needed."
fi
