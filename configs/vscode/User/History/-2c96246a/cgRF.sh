#!/bin/bash

# install zsh config
cp ./configs/zsh/zshrc "${HOME}/.zshrc"
cp ./configs/zsh/zsh_profile "${HOME}/.zsh_profile" 

# install neovim config
cp -r ./configs/neovim/nvim/ "${HOME}/.config/nvim/"

# install tmux config
cp ./configs/tmux/tmux.conf "${HOME}/.tmux.conf"

# install alacritty config
cp -r ./configs/alacritty "${HOME}/.config/"

# packup wezterm config
cp -r ./configs/wezterm/wezterm.lua "${HOME}/.wezterm.lua"