#!/bin/bash

# check if a program is not installed
notInstalled() {
	program="$1"
	check=$(which "$program")
	notFound="not found"

	echo "$check"

	# Check if the string does not contain the substring
	if [[ ! $check == *"$notFound"* ]]; then
		echo "$program not found... Installing"
		return 1
	else
		echo "$program is already installed"
		return 1
	fi
}

# install lazygit
if notInstalled lazygit; then
	LAZYGIT_VERSION=$(curl -s "https://api.github.com/repos/jesseduffield/lazygit/releases/latest" | grep -Po '"tag_name": "v\K[^"]*')
	curl -Lo lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/latest/download/lazygit_${LAZYGIT_VERSION}_Linux_x86_64.tar.gz"
	tar xf lazygit.tar.gz lazygit
	sudo install lazygit /usr/local/bin
	rm lazygit lazygit.tar.gz
fi

# install wezterm

# install neovim
if notInstalled neovim; then
	sudo apt-get update
	sudo apt-get install ninja-build gettext libtool libtool-bin autoconf automake cmake g++ pkg-config unzip curl doxygen
	git clone https://github.com/neovim/neovim.git
	cd neovim
	make CMAKE_BUILD_TYPE=RelWithDebInfo
	sudo make install
	cd ../
	rm -rf neovim
fi

# install oh my zsh
# sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# install packaged apps
if notInstalled tldr; then
	sudo apt install tldr
fi

if notInstalled plocate; then
	sudo apt install plocate
fi

if notInstalled ranger; then
	sudo apt install ranger
fi
