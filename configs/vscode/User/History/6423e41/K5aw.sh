#!/bin/bash

# copy zsh files into config project
mkdir -p ./configs/zsh/
rm -rf ./configs/zsh/*
cp "${HOME}/.zshrc" ./configs/zsh/zshrc
cp "${HOME}/.zsh_profile" ./configs/zsh/zsh_profile

# packup neovim config
mkdir -p ./configs/neovim
rm -rf ./configs/neovim/*
cp -r "${HOME}/.config/nvim/" ./configs/neovim/nvim/

# packup tmux config
mkdir -p ./configs/tmux
rm -rf ./configs/tmux/*
cp "${HOME}/.tmux.conf" ./configs/tmux/tmux.conf

# packup alacritty config
mkdir -p ./configs/alacritty
rm -rf ./configs/alacritty/
cp -r "${HOME}/.config/alacritty" ./configs/

# packup wezterm config
mkdir -p ./configs/wezterm/
rm -rf ./configs/wezterm/*
cp -r "${HOME}/.wezterm.lua" ./configs/wezterm/wezterm.lua
