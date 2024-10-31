#!/bin/bash

# Check if xclip or xsel is installed
if ! command -v xclip &> /dev/null && ! command -v xsel &> /dev/null; then
    echo "No clipboard tool found. Installing xclip..."
    sudo pacman -S --noconfirm xclip
else
    echo "A clipboard tool is already installed."
fi

