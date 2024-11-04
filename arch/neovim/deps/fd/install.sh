if ! command -v fd &> /dev/null; then
    sudo pacman -S fd --noconfirm
else
    echo "fd is already installed"
fi

