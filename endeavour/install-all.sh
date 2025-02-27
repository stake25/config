#!/bin/bash

############################################
# Prerequisites for installation

# enable multilib repository
echo "Enabling multilib repository..."
sudo cp /etc/pacman.conf /etc/pacman.conf.bak # Backup the current pacman.conf
sudo sed -i '/^\[multilib\]/,/^#/{s/^#//; s/^#//;}' /etc/pacman.conf # Uncomment the multilib section in pacman.conf
sudo sed -i '/^\[multilib\]/,/^#/{s/^#//; /^Include/!d;}' /etc/pacman.conf # Uncomment the lines under multilib (packages)
sudo pacman -Sy # Update the package database

###########################################
# store and list all the packages to install

# List of pacman packages to install
pacmanPackages=(
  "dosfstools"
  "docker"
  "docker-compose"
  "ntfsprogs"
  "jq"
  "mlocate"
  "ranger"
  "lazygit"
  "libevdev"
  "udev"
  "steam"
  "vim"
  "vlc"
  "zsh"
  "zsh-autosuggestions"
)

yayPackages=(
  "cura-bin"
  "google-chrome"
  "github-cli-git"
  "lazydocker"
  "slack-desktop"
  "visual-studio-code-bin"
)

flatpakPackages=(
  "com.bitwarden.desktop"
  "com.usebruno.Bruno"
  "fr.handbrake.ghb"
  "com.github.iwalton3.jellyfin-media-player"
  "com.makemkv.MakeMKV"
  "org.onlyoffice.desktopeditors"
  "org.openrgb.OpenRGB"
  "com.system76.Popsicle"
  "com.spotify.Client"
)

############################################
# add packages for work
pacmanPackages+=(
  "networkmanager-openconnect"
)

yayPackages+=(
  "teams-for-linux-bin"
  "outlook-for-linux-bin"
)

flatpakPackages+=(
  "us.zoom.Zoom"
)

############################################
# Install typical packages

# Save the current directory
original_dir=$(pwd)

# create logs directory
mkdir -p "$original_dir/logs"

# Iterate over the packages and run the pacman-install.sh script
for package in "${pacmanPackages[@]}"
do
    ./installs/pacman-install.sh "$package" | tee -a "$original_dir/logs/pacman_install_log.txt" 2>&1
done

# Iterate over the packages and run the pacman-install.sh script
for package in "${yayPackages[@]}"
do
    ./installs/yay-install.sh "$package" | tee -a "$original_dir/logs/yay_install_log.txt" 2>&1
done

# Iterate over the packages and run the pacman-install.sh script
for package in "${flatpakPackages[@]}"
do
    ./installs/flatpak-install.sh "$package" | tee -a "$original_dir/logs/flatpak_install_log.txt" 2>&1
done

############################################
# Custom installations

# Install Rust
if ! command -v rustup &>/dev/null; then
  echo "Rustup is not installed. Installing now..."
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  echo "Rustup installation completed."
else
  echo "Rustup is already installed."
fi

# Install NVM
if [ ! -d "$HOME/.nvm" ]; then
  echo "NVM is not installed. Installing now..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
  echo "NVM installation completed."
else
  echo "NVM is already installed."
fi

# Install Starship prompt
if ! command -v starship &>/dev/null; then
  echo "Starship is not installed. Installing now..."
  curl -sS https://starship.rs/install.sh | sh
else
  echo "Starship is already installed."
fi

############################################
# add extra finishing steps for packages

# update locate database for mlocate
echo "updating locate database"
sudo updatedb

# Enable and start Tailscale service
echo "enabling tailscaled"
sudo systemctl enable --now tailscaled

# Enable and start Docker service
echo "enabling docker"
sudo systemctl enable --now docker

# enable the current user to use docker
# Check if the docker group exists, if not, create it
if ! getent group docker > /dev/null; then
  echo "Creating docker group..."
  sudo groupadd docker
fi

# Add the current user to the docker group
if ! groups $USER | grep &>/dev/null "\bdocker\b"; then
  echo "Adding $USER to the docker group..."
  sudo usermod -aG docker $USER
  newgrp docker
fi

# Change the current shell to zsh
if [ "$SHELL" != "$(which zsh)" ]; then
    echo "Changing default shell to Zsh..."

    # Change the default shell to Zsh
    chsh -s $(which zsh)

    echo "Default shell changed to Zsh. Please log out and log back in for changes to take effect."
else
    echo "Zsh is already the default shell."
fi

# setup udev rules for OpenRGB
# Path to the udev rules file
UDEV_RULES_FILE="/etc/udev/rules.d/99-openrgb.rules"

# Check if the udev rules file already exists
if [ ! -f "$UDEV_RULES_FILE" ]; then
  echo "Creating udev rules for OpenRGB..."

  sudo bash -c 'cat <<EOF > /etc/udev/rules.d/99-openrgb.rules
# OpenRGB udev rules
SUBSYSTEM=="usb", ATTR{idVendor}=="1b1c", ATTR{idProduct}=="1b0f", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="1b1c", ATTR{idProduct}=="1b12", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="093a", ATTR{idProduct}=="2510", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="1b1c", ATTR{idProduct}=="0c0f", MODE="0666"
EOF'

  # Reload udev rules
  echo "Reloading udev rules..."
  sudo udevadm control --reload-rules
else
  echo "Udev rules for OpenRGB already exist. Skipping creation."
fi

############################################
# configure packages and installations

# Run the configuration script for saved scripts
echo "Configuring saved scripts..."
./scripts/install.sh

# Run the configuration script for Vim
echo "Configuring Vim..."
./vim/config.sh

# Run the configuration script for Wallpapers
echo "Configuring Wallpapers..."
./wallpaper/config.sh

# Run the configuration script for Zsh
echo "Configuring Zsh..."
./zsh/config.sh
