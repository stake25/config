#!/bin/sh

# paths for configs
tmuxPath="${HOME}/.config/tmux/*"
lvimPath="${HOME}/.config/lvim/*"

# copy config files into config project
mkdir -p ./configs/tmux/
rm -rf ./configs/tmux/*
cp -r $tmuxPath ./configs/tmux/

mkdir -p ./configs/lvim/
rm -rf ./configs/lvim/*
cp -r $lvimPath ./configs/lvim/

mkdir -p ./configs/zsh/
rm -rf ./configs/zsh/*
cp "${HOME}/.zshrc" ./configs/zsh/zshrc
cp "${HOME}/.zsh_profile" ./configs/zsh/zsh_profile

