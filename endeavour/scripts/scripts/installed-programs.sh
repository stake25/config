#!/bin/bash

echo "Checking installed packages..."

CURR_PATH="$(dirname "$(readlink -f "$0")")"

# Get pacman-installed packages
pacman_packages=$(pacman -Qq)
# Get AUR packages
aur_packages=$(pacman -Qm)
# Get Flatpak packages
flatpak_packages=$(flatpak list --app --columns=application 2>/dev/null)

echo -e "\n=== Pacman Packages ===" >> "$CURR_PATH/packages.txt"
for pkg in $pacman_packages; do
    if ! grep -qx "$pkg" <<< "$aur_packages"; then
        echo "$pkg" >> "$CURR_PATH/packages.txt"
    fi
done

echo -e "\n=== AUR Packages ===" >> "$CURR_PATH/packages.txt"
echo "$aur_packages" >> "$CURR_PATH/packages.txt"

echo -e "\n=== Flatpak Packages ===" >> "$CURR_PATH/packages.txt"
echo "$flatpak_packages" >> "$CURR_PATH/packages.txt"
