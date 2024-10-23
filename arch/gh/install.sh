#!/bin/bash

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if GitHub CLI is installed
if command_exists gh; then
  echo "GitHub CLI is already installed."
else
  echo "GitHub CLI is not installed. Installing..."

  # Install GitHub CLI
  yay -S github-cli-git

  echo "GitHub CLI installed successfully."
fi
