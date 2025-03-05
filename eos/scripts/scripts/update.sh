#!/bin/bash

# update all packages
sudo pacman -Syu && yay -Syu && flatpak update
