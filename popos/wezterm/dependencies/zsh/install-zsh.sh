#!/bin/bash

PROGRAM="zsh"

# Check if zsh is installed
if ! command -v $PROGRAM &> /dev/null; then
  echo "$PROGRAM is not installed. Installing..."
  sudo apt install -y $PROGRAM

  echo "changing default shell to $PROGRAM"
  chsh -s $(which $PROGRAM)

  echo "you will need to restart your computer for default shell to be $PROGRAM"
fi

# If $PROGRAM is installed, let the user know
echo "$PROGRAM is installed."

