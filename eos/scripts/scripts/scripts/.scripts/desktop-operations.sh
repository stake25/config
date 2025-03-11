#!/bin/bash

# Function to create a default .desktop file
create_default_desktop_file() {
  echo "Creating default .desktop file..."

  # Add .desktop extension if it doesn't exist
  if [[ "$1" != *.desktop ]]; then
    file_path="${1}.desktop"
  else
    file_path="$1"
  fi

  cat <<EOL > "$file_path"
[Desktop Entry]
Name=DefaultApp
Comment=Default Application
Exec=/usr/bin/defaultapp
Icon=$HOME/.icons/defaultapp.png
Type=Application
Terminal=false
Categories=Utility;
StartupNotify=true
EOL

  # Open the file in VSCode
  code "$file_path"
}

# Function to move the .desktop file
move_default_desktop_file() {
  # Add .desktop extension if it doesn't exist
  if [[ "$1" != *.desktop ]]; then
    file_path="${1}.desktop"
  else
    file_path="$1"
  fi

  # Make the desktop file executable
  chmod +x "$file_path"

  # Move the desktop file to the destination directory
  mv "$file_path" "$DEST_DIR"

  # Set the correct permissions
  # chmod 667 "$DEST_DIR/$(basename "$SOURCE_FILE")"

  echo "Desktop file moved to $DEST_DIR"
}

# Function to move the icon file
move_icon_file() {
  local icon_file=$1
  local dest_icon_dir="$HOME/.icons"

  # Create the destination icon directory if it doesn't exist
  mkdir -p "$dest_icon_dir"

  # Move the icon file to the destination directory
  mv "$icon_file" "$dest_icon_dir"

  echo "Icon file moved to $dest_icon_dir"
}

# Check if the source file is provided
if [ -z "$1" ]; then
  echo "Usage: $0 [<source-desktop-file> | <source-icon-file>] [--create | --move | --icon]"
  exit 1
fi

SOURCE_FILE=$1
DEST_DIR="$HOME/.local/share/applications"

# Create the destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Prompt for --create or --move if $2 does not exist
if [ -z "$2" ]; then
  echo "Do you want to create a new .desktop file, move an existing one, or move an icon? (create/move/icon)"
  read -r action
  if [ "$action" == "create" ]; then
    create_default_desktop_file "$SOURCE_FILE"
  elif [ "$action" == "move" ]; then
    move_default_desktop_file "$SOURCE_FILE"
  elif [ "$action" == "icon" ]; then
    move_icon_file "$SOURCE_FILE"
  else
    echo "Invalid option. Exiting."
    exit 1
  fi
else
  # Check if the --create flag is provided
  if [ "$2" == "--create" ]; then
    create_default_desktop_file "$SOURCE_FILE"
  fi

  # Check if the --move flag is provided
  if [ "$2" == "--move" ]; then
    move_default_desktop_file "$SOURCE_FILE"
  fi

  # Check if the --icon flag is provided
  if [ "$2" == "--icon" ] && [ -n "$4" ]; then
    move_icon_file "$4"
  fi
fi


