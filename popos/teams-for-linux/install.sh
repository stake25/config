#!/bin/bash

# Check if Teams is already installed
if ! dpkg -l | grep teams-for-linux >/dev/null 2>&1; then
  echo "Teams for Linux is not installed. Installing now..."

  # Update package list
  sudo apt update

  # Add the Teams for Linux repository
  curl -sS https://packagecloud.io/install/repositories/yoheikb/teams-for-linux/script.deb.sh | sudo bash

  # Install Teams for Linux
  sudo apt install teams-for-linux

  echo "Teams for Linux has been installed."
else
  echo "Teams for Linux is already installed."
fi
