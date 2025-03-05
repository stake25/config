#!/bin/bash

# Install NVM
if [ ! -d "$HOME/.nvm" ]; then
  echo "NVM is not installed. Installing now..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
  echo "NVM installation completed."
else
  echo "NVM is already installed."
fi
