#!/bin/bash

############################################
# Prerequisites for installation

clear

# get the absolute path to this files directory
CURR_PATH="$(dirname "$(readlink -f "$0")")"
echo "Current path: $CURR_PATH"

# enable multilib repository
echo "Checking if multilib repository is enabled..."
if ! grep -q '^\[multilib\]' /etc/pacman.conf || grep -q '^\[multilib\]' /etc/pacman.conf | grep -q '^#'; then
  echo "Enabling multilib repository..."
  sudo cp /etc/pacman.conf /etc/pacman.conf.bak # Backup the current pacman.conf
  sudo sed -i '/^\[multilib\]/,/^#/{s/^#//; s/^#//;}' /etc/pacman.conf # Uncomment the multilib section in pacman.conf
  sudo sed -i '/^\[multilib\]/,/^#/{s/^#//; /^Include/!d;}' /etc/pacman.conf # Uncomment the lines under multilib (packages)
  sudo pacman -Sy # Update the package database
else
  echo "Multilib repository is already enabled."
fi

###########################################
# store and list all the packages to install

# List of pacman packages to install
pacmanPackages=(
  "bitwarden"
  "bluez-utils"
  "bluez"
  "btop"
  "discord"
  "docker-compose"
  "docker"
  "dosfstools"
  "flameshot"
  "jq"
  "lazygit"
  "libevdev"
  "mlocate"
  "ntfsprogs"
  "ranger"
  "syncthing"
  "tailscale"
  "udev"
  "v4l2loopback-dkms"
  "vim"
  "vlc"
  "xclip"
  "zsh-autosuggestions"
  "zsh"
)

yayPackages=(
  "cura-bin"
  "extension-manager"
  "github-cli-git"
  "google-chrome"
  "lazydocker"
  "obs-studio-git"
  "slack-desktop"
  "visual-studio-code-bin"
  "waterfox-bin"
)

flatpakPackages=(
  "com.bitwarden.desktop"
  "com.github.iwalton3.jellyfin-media-player"
  "com.makemkv.MakeMKV"
  "com.spotify.Client"
  "com.system76.Popsicle"
  "com.usebruno.Bruno"
  "fr.handbrake.ghb"
  "org.onlyoffice.desktopeditors"
  "org.openrgb.OpenRGB"
  "org.signal.Signal"
)

customPackages=(
  "rust"
  "starship"
  "nvm"
)

############################################
# add packages for work
pacmanPackages+=(
  "networkmanager-openconnect"
  "act"
)

yayPackages+=(
  "teams-for-linux-bin"
  "outlook-for-linux-bin"
)

flatpakPackages+=(
  "us.zoom.Zoom"
)

customPackages+=(
  "repsrv-vpn"
)

############################################
# Install packages

# create logs directory
mkdir -p "$CURR_PATH/logs"

# Iterate over the packages and run the pacman-install.sh script
for package in "${pacmanPackages[@]}"
do
    $CURR_PATH/installs/pacman-install.sh "$package" | tee -a "$CURR_PATH/logs/pacman_install_log.txt" 2>&1
done

# Iterate over the packages and run the pacman-install.sh script
for package in "${yayPackages[@]}"
do
  $CURR_PATH/installs/yay-install.sh "$package" | tee -a "$CURR_PATH/logs/yay_install_log.txt" 2>&1
done

# Iterate over the packages and run the pacman-install.sh script
for package in "${flatpakPackages[@]}"
do
  $CURR_PATH/installs/flatpak-install.sh "$package" | tee -a "$CURR_PATH/logs/flatpak_install_log.txt" 2>&1
done

# Iterate over the packages and run the custom installation scripts
for package in "${customPackages[@]}"
do
  echo "Installing $package with script $CURR_PATH/installs/custom/$package/$package.sh..."
  $CURR_PATH/installs/custom/$package/$package.sh | tee -a "$CURR_PATH/logs/custom_install_log.txt" 2>&1
done

############################################
# add extra finishing steps for packages

# update locate database for mlocate
echo "updating locate database"
sudo updatedb

# Enable and start Tailscale service
echo "enabling tailscaled"
sudo systemctl enable --now tailscaled

# Enable and start Syncthing for the current user
echo "enabling syncthing@$USER"
sudo systemctl enable --now syncthing@$USER

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
echo "Current Path: $CURR_PATH"
$CURR_PATH/scripts/install.sh

# Run the configuration script for Vim
echo "Configuring Vim..."
$CURR_PATH/vim/config.sh

# Run the configuration script for Wallpapers
echo "Configuring Wallpapers..."
$CURR_PATH/wallpaper/install.sh

# Run the configuration script for Zsh
echo "Configuring Zsh..."
$CURR_PATH/zsh/install.sh
