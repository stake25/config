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

  # Detect the package manager and install GitHub CLI
  if command_exists apt; then
    echo "Detected Debian-based system. Installing with apt..."
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /usr/share/keyrings/githubcli-archive-keyring.gpg >/dev/null
    echo "deb [signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list >/dev/null
    sudo apt update && sudo apt install -y gh
  elif command_exists pacman; then
    echo "Detected Arch-based system. Installing with pacman..."
    sudo pacman -Syu github-cli
  elif command_exists dnf; then
    echo "Detected Fedora-based system. Installing with dnf..."
    sudo dnf install -y gh
  else
    echo "Unsupported package manager. Please install GitHub CLI manually."
    exit 1
  fi

  echo "GitHub CLI installed successfully."
fi
