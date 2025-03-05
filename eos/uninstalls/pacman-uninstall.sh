#!/bin/bash

package=$1
if pacman -Q "$package" &>/dev/null; then
  echo "$package is installed. Uninstalling..."
  sudo pacman -R --noconfirm "$package"
else
  echo "$package is not installed. Skipping..."
fi
