#!/bin/sh

# copy zsh files into config project
mkdir -p ./configs/zsh/
rm -rf ./configs/zsh/*
cp "${HOME}/.zshrc" ./configs/zsh/zshrc
cp "${HOME}/.zsh_profile" ./configs/zsh/zsh_profile

# packup wezterm config
mkdir -p ./configs/wezterm
rm -rf ./configs/wezterm/*
cp "${HOME}/.wezterm.lua" ./configs/wezterm/wezterm.lua

# packup neovim config
mkdir -p ./configs/neovim
rm -rf ./configs/neovim/*
cp -r "${HOME}/.config/nvim/" ./configs/neovim/nvim/
