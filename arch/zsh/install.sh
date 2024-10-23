#!/bin/bash

# Check if Zsh is installed
if ! command -v zsh &> /dev/null
then
    echo "Zsh not found, installing..."
    sudo pacman -S zsh
else
    echo "Zsh is already installed."
fi

# Check the current default shell
if [ "$SHELL" != "$(which zsh)" ]; then
    echo "Changing default shell to Zsh..."

    # Change the default shell to Zsh
    chsh -s $(which zsh)

    echo "Default shell changed to Zsh. Please log out and log back in for changes to take effect."
else
    echo "Zsh is already the default shell."
fi

