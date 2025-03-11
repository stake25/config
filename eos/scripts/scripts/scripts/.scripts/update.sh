#!/bin/bash

# update all packages
echo "[INFO]: Update all eos packages..."
sudo eos-update --yay
echo "[INFO]: update all flatpak packages..."
flatpak update
