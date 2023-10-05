#!/bin/sh

# variable paths for configs
tmuxPath="${HOME}/.config/tmux/"
lvimPath="${HOME}/.config/lvim/"

# copy config files into system
mkdir -p $tmuxPath
rm -rf "${tmuxPath}*"
cp -r ./configs/tmux/* $tmuxPath

mkdir -p $lvimPath
rm -rf "${lvimPath}*"
cp -r ./configs/lvim/* $lvimPath

rm "${HOME}/.zshrc" "${HOME}/.zsh_profile"
cp ./configs/zsh/zshrc "${HOME}/.zshrc"
cp ./configs/zsh/zsh_profile "${HOME}/.zsh_profile"

