#!/bin/bash

# Install Rust
if ! command -v rustup &>/dev/null; then
  echo "Rustup is not installed. Installing now..."
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  echo "Rustup installation completed."
else
  echo "Rustup is already installed."
fi
