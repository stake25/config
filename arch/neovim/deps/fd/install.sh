if ! command -v fd &> /dev/null; then
    sudo pacman -S fd
else
    echo "fd is already installed"
fi

