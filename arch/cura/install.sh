#!/bin/bash

# Check if cura-bin is installed
if ! yay -Qi cura-bin &>/dev/null; then
  echo "cura-bin is not installed. Installing..."
  yay -S cura-bin
else
  echo "cura-bin is already installed."
fi
