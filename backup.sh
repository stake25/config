#!/bin/bash

# install zsh config
touch "${HOME}/.zshrc.bak"
touch "${HOME}/.zsh_profile.bak"
cp "${HOME}/.zshrc" "${HOME}/.zshrc.bak"
cp "${HOME}/.zsh_profile" "${HOME}/.zsh_profile.bak"

# install neovim config
mkdir -p "${HOME}/.config/nvim.bak/"
cp -r "${HOME}/.config/nvim/" "${HOME}/.config/nvim.bak/"

# install tmux config
touch "${HOME}/.tmux.conf.bak"
cp "${HOME}/.tmux.conf" "${HOME}/.tmux.conf.bak"

# install alacritty config
mkdir -p "${HOME}/.config/alacritty.bak/"
cp -r "${HOME}/.config/alacritty/" "${HOME}/.config/alacritty.bak/"

# packup wezterm config
touch "${HOME}/.wezterm.lua.bak"
cp -r "${HOME}/.wezterm.lua" "${HOME}/.wezterm.lua.bak"
