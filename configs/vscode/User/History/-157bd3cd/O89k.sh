#!/bin/bash

# install zsh config
cp "${HOME}/.zshrc" "${HOME}/.zshrc.bak"
cp "${HOME}/.zsh_profile" "${HOME}/.zsh_profile.bak"

# install neovim config
cp -r "${HOME}/.config/nvim/" "${HOME}/.config/nvim.bak/"

# install tmux config
cp "${HOME}/.tmux.conf" "${HOME}/.tmux.conf.bak"

# install alacritty config
cp -r "${HOME}/.config/alacritty/" "${HOME}/.config/alacritty.bak/"

# packup wezterm config
cp -r "${HOME}/.wezterm.lua" "${HOME}/.wezterm.lua.bak"
