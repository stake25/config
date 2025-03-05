#!/bin/bash

echo "Converting $1 to m4a"

book_name=$(basename "$1")
book_name="${book_name%.*}"
echo "Book name: $book_name"

og_dir=$(dirname "$1")
echo "Original directory: $og_dir"

og_path=$(dirname "$(realpath "$1")")
echo "Original path: $og_path"

dest_dir="$og_dir/converted"
echo "Destination directory: $dest_dir"

rcrack_dir="./tables"
echo "Rcrack directory: $rcrack_dir"

if [ ! -d "$rcrack_dir" ]; then
    echo "Rcrack directory not found. pulling from git."
    git clone https://github.com/inAudible-NG/tables.git
fi
mkdir -p "$dest_dir"

if [ -f "$dest_dir/$book_name.m4a" ]; then
    echo "File already exists. Exiting."
    exit 1
fi

# Get the checksum to calculate the activation_bytes
CHECKSUM=$(ffprobe "$1" 2>&1 | grep -oP 'checksum == \K[0-9a-f]+')

if [ -z "$CHECKSUM" ]; then
    echo "No checksum found. Exiting."
    exit 1
else
    echo "Checksum: $CHECKSUM"
fi

cd $rcrack_dir
result=$(./rcrack . -h $CHECKSUM)
cd $current_dir

# Extract the value after "hex:"
activation_bytes=$(echo "$result" | grep -oP 'hex:\K[0-9a-f]+')

echo "Activation bytes: $activation_bytes"

# Convert to M4A
ffmpeg -activation_bytes $activation_bytes -i "$og_path/$book_name.aax" -vn -c:a aac -b:a 256k "$og_path/converted/$book_name.m4a"
