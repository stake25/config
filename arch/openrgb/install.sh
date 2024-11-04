# Check if Flatpak is installed
if ! command -v flatpak &> /dev/null; then
    echo "Flatpak not found. Installing..."
    sudo pacman -S flatpak --noconfirm
fi

# Add Flathub repository if not already added
if ! flatpak remote-list | grep -q "flathub"; then
    echo "Adding Flathub repository..."
    flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
fi

# Check if OpenRGB is installed
if ! flatpak list | grep -q "org.openrgb.OpenRGB"; then
    echo "OpenRGB is not installed. Installing..."
    flatpak install flathub org.openrgb.OpenRGB -y
else
    echo "OpenRGB is already installed"
fi

