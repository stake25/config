#!/bin/bash

# Check if fzf is already installed
if command -v fzf &> /dev/null; then
  echo "fzf is already installed."
else
  echo "fzf is not installed. Proceeding with installation..."

  # Update package list and install fzf
  sudo apt update
  sudo apt install -y fzf

  echo "fzf installation completed."
fi

