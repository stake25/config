#!/bin/bash

# Check if tailscale is installed
if ! command -v tailscale &> /dev/null; then
  curl -fsSL https://tailscale.com/install.sh | sh
fi

# If lazygit is installed, continue with the script logic
echo "tailscale is installed."


