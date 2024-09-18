#!/bin/bash

PROGRAM="nvim"

# Check if the program is installed
if ! which "$PROGRAM" &> /dev/null; then
  echo "$PROGRAM is not installed. Installing..."
 
  curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim-linux64.tar.gz
  sudo rm -rf /opt/nvim
  sudo tar -C /opt -xzf nvim-linux64.tar.gz
  rm -f nvim-linux64.tar.gz

  echo "$PROGRAM has been installed."
else
  echo "$PROGRAM is already installed."

  rm -f nvim-linux64.tar.gz
fi

