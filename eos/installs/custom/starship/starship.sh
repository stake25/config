#!/bin/bash

# Install Starship prompt
if ! command -v starship &>/dev/null; then
  echo "Starship is not installed. Installing now..."
  curl -sS https://starship.rs/install.sh | sh
else
  echo "Starship is already installed."
fi
