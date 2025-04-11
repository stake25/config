#!/bin/bash

if [ ! -f "$HOME/.local/bin/lvim" ]; then
  echo "lvim is not installed. Installing..."
bash <(curl -s https://raw.githubusercontent.com/lunarvim/lunarvim/master/utils/installer/install.sh)
else
  echo "lvim is already installed."
fi
