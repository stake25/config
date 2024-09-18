#!/bin/bash

PACKAGE_NAME="ranger"

# Check if the package is already installed
if dpkg -l | grep -q "^ii  $PACKAGE_NAME"; then
  echo "$PACKAGE_NAME is already installed."
else
  echo "$PACKAGE_NAME is not installed. Installing..."

  # Update the package list
  sudo apt update

  # Install the package
  sudo apt install -y "$PACKAGE_NAME"

  echo "$PACKAGE_NAME has been installed."
fi

