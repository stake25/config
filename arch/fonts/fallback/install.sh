#!/bin/bash

# Update package database
sudo pacman -Sy

# Install DejaVu and Noto Sans Symbols fonts
sudo pacman -S --needed ttf-dejavu noto-fonts-emoji

