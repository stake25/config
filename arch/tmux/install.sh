#!/bin/bash

# Check if tmux is installed
if ! command -v tmux &>/dev/null; then
  echo "tmux is not installed. Installing..."
  sudo pacman -Syu --needed tmux
  if [ $? -eq 0 ]; then
    echo "tmux installed successfully!"
  else
    echo "Failed to install tmux."
  fi
else
  echo "tmux is already installed."
fi
