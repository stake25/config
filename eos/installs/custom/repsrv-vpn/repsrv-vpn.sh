#!/bin/bash

# get the absolute path to this files directory
CURR_PATH=$(dirname "$(readlink -f "$0")")

# source the env file
source "$CURR_PATH/repsrv-vpn.env"

# install prereqs
$CURR_PATH/../../pacman-install.sh "webkit2gtk"

# move desktop file and icon to the correct location
echo "Moving desktop file and icon to the correct location..."
mkdir -p "$HOME/.local/share/icons/custom"
cp -f "$CURR_PATH/resources/repsrv.desktop" "$HOME/.local/share/applications/"
cp -f "$CURR_PATH/resources/repsrv.png" "$HOME/.local/share/icons/custom/"

# check for the existence of /opt/cisco/secureclient/bin/vpnui
if [ -f /opt/cisco/secureclient/bin/vpnui ]; then
    echo "Cisco Secure Client VPN UI is already installed."
else
    echo "Cisco Secure Client VPN UI is not installed."
    echo "Opening browser so the user can download the VPN client..."
    xdg-open $REPSRV_VPN_URL
fi
