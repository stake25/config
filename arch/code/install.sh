if ! command -v code &> /dev/null; then
    sudo pacman -S --needed code
else
    echo "Visual Studio Code is already installed."
fi

