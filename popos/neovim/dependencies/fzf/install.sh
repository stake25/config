#!/bin/bash

# Check if fzf is already installed
if command -v fzf &> /dev/null; then
  echo "fzf is already installed."
else
  echo "fzf is not installed. Proceeding with installation..."

  # Update package list and install fzf
  git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
  ~/.fzf/install

  echo "fzf installation completed."
fi

