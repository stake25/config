#!/bin/bash

# Check if the first argument is provided
if [[ -z "$1" ]]; then
  echo "Usage: $0 <youtube_url>"
  exit 1
fi

# Regular expression to match YouTube URLs
youtube_regex="^(https?://)?(www\.)?(youtube\.com|youtu\.be)/.+$"

# Verify the first argument matches the YouTube URL regex
if [[ "$1" =~ $youtube_regex ]]; then
  echo "Valid YouTube URL: $1"
else
  echo "Error: The provided argument is not a valid YouTube URL."
  exit 1
fi

echo "Downloading audio from YouTube via yt-dlp with the link: $1"
yt-dlp --extract-audio --audio-format flac "$1"
