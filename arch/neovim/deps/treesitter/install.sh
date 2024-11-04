if ! command -v tree-sitter &> /dev/null; then
    sudo pacman -S tree-sitter --noconfirm
else
    echo "tree-sitter is already installed"
fi

