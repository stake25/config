#!/bin/bash

# Define variables
REPO="OpsLevel/cli"
ARCH="linux-amd64"
DOWNLOAD_URL=$(curl -s https://api.github.com/repos/$REPO/releases/latest | grep "browser_download_url" | grep "$ARCH" | cut -d '"' -f 4)
DESTINATION="/usr/local/bin/opslevel"
DOWNLOAD_DIR="$HOME/Downloads"

# Download and install the latest release
if [ -n "$DOWNLOAD_URL" ]; then
    echo "Downloading OpsLevel CLI from $DOWNLOAD_URL to $DOWNLOAD_DIR..."
    curl -L "$DOWNLOAD_URL" -o "$DOWNLOAD_DIR/opslevel.tar.gz"
    echo "Extracting OpsLevel CLI in $DOWNLOAD_DIR..."
    tar -xzf "$DOWNLOAD_DIR/opslevel.tar.gz" -C "$DOWNLOAD_DIR" opslevel
    chmod +x "$DOWNLOAD_DIR/opslevel"
    echo "Moving OpsLevel CLI to $DESTINATION..."
    sudo mv "$DOWNLOAD_DIR/opslevel" "$DESTINATION"
    rm "$DOWNLOAD_DIR/opslevel.tar.gz"
    echo "OpsLevel CLI installed successfully."
else
    echo "Failed to find the latest OpsLevel CLI release."
    exit 1
fi
