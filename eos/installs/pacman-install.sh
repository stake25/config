#!/bin/bash

package=$1
if ! pacman -Qi "$package" &>/dev/null; then
  echo "$package is not installed. Installing..."
  sudo pacman -S --noconfirm "$package"
else
  echo "$package is already installed."
fi
