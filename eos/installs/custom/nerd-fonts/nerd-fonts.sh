#!/bin/bash

# Primary font to apply
APPLIED_FONT_NAME="ComicShannsMono"
APPLIED_NERD_FONT_NAME="$APPLIED_FONT_NAME Nerd Font"
APPLIED_FONT_FILE_NAME="${APPLIED_FONT_NAME}NerdFont-Regular.ttf"

# Additional fonts (just for availability)
OTHER_FONTS=("FiraCode" "Hack" "JetBrainsMono" "CascadiaCode")

# Font install directory
FONT_DIR="$HOME/.local/share/fonts/NerdFonts"
mkdir -p "$FONT_DIR"

# Function to download a Nerd Font
download_nerd_font() {
  local name="$1"
  local file="${name}NerdFont-Regular.ttf"
  if [ ! -f "$FONT_DIR/$file" ]; then
    echo "Downloading $name Nerd Font..."
    wget -q --show-progress -O "$FONT_DIR/$file" \
      "https://github.com/ryanoasis/nerd-fonts/raw/master/patched-fonts/$name/Regular/complete/$file"
  else
    echo "$name Nerd Font already downloaded."
  fi
}

# Download the primary font
download_nerd_font "$APPLIED_FONT_NAME"

# Download the additional fonts
for font in "${OTHER_FONTS[@]}"; do
  download_nerd_font "$font"
done

# Update font cache
echo "Updating font cache..."
fc-cache -fv "$FONT_DIR"

# Set ComicShannsMono as KGX font
GSETTINGS_SCHEMA="org.gnome.Console"
GSETTINGS_KEY="font"
NEW_FONT_VALUE="$APPLIED_NERD_FONT_NAME 12"

echo "Setting KGX font to '$NEW_FONT_VALUE'..."
gsettings set "$GSETTINGS_SCHEMA" "$GSETTINGS_KEY" "$NEW_FONT_VALUE"

echo "✅ All fonts installed. ComicShannsMono applied to GNOME Console."
