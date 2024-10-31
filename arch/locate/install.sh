if ! command -v locate &> /dev/null; then
    echo "mlocate not found. Installing..."
    sudo pacman -S mlocate
    echo "Initializing locate database..."
    sudo updatedb
else
    echo "mlocate is already installed"
fi

