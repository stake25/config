#!/bin/bash

# Ensure the system is up-to-date
sudo pacman -Syu --noconfirm

# Check if jq is already installed
if ! command -v jq &>/dev/null; then
  echo "jq not found, installing jq..."
  sudo pacman -S jq --noconfirm
else
  echo "jq is already installed."
fi
