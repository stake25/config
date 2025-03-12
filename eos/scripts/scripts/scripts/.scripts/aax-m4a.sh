#!/bin/bash

og_dir=$(pwd)

source_dir=$HOME/Audiobooks/toConvert
echo "Source directory: $source_dir"

dest_dir=$HOME/Audiobooks/converted
echo "Destination directory: $dest_dir"

rcrack_dir=$source_dir/tables
echo "Rcrack directory: $rcrack_dir"

if [ $1 == "update" ]; then
    rm -rf $rcrack_dir
fi

mkdir -p $source_dir
mkdir -p $dest_dir

for file in $source_dir/*.aax; do
    echo "Converting $file to m4a"

    book_name=$(basename "$file")
    book_name="${book_name%.*}"
    echo "Book name: $book_name"

    if [ ! -d "$rcrack_dir" ]; then
        echo "Rcrack directory not found. pulling from git."
        git clone https://github.com/inAudible-NG/tables.git $rcrack_dir
    fi

    if [ -f "$dest_dir/$book_name.m4a" ]; then
        echo "File already exists. Skipping."
        continue
    fi

    # Get the checksum to calculate the activation_bytes
    CHECKSUM=$(ffprobe "$file" 2>&1 | grep -oP 'checksum == \K[0-9a-f]+')

    if [ -z "$CHECKSUM" ]; then
        echo "No checksum found. Exiting."
        exit 1
    else
        echo "Checksum: $CHECKSUM"
    fi

    cd $rcrack_dir
    result=$(./rcrack . -h $CHECKSUM)
    cd $og_dir

    # Extract the value after "hex:"
    activation_bytes=$(echo "$result" | grep -oP 'hex:\K[0-9a-f]+')
    echo "Activation bytes: $activation_bytes"

    # Convert to M4A
    # ffmpeg -activation_bytes $activation_bytes -i "$source_dir/$book_name.aax" -c copy "$dest_dir/$book_name.m4a"
    ffmpeg -y -activation_bytes $activation_bytes -i "$source_dir/$book_name.aax" -map_metadata 0 -id3v2_version 3 -codec:a copy -vn "$dest_dir/$book_name.m4a"
done
