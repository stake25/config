#!/bin/sh

# copy config files into config project
mkdir -p ./configs/zsh/
rm -rf ./configs/zsh/*
cp "${HOME}/.zshrc" ./configs/zsh/zshrc
cp "${HOME}/.zsh_profile" ./configs/zsh/zsh_profile

mkdir -p ./configs/wezterm
rm -rf ./configs/wezterm/*
cp "${HOME}/.wezterm.lua" ./configs/wezterm/wezterm.lua
