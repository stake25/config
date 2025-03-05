#!/bin/bash

#!/bin/bash

# Check if an argument is provided
if [ -z "$1" ]; then
  echo "Error: No argument provided."
  echo "Usage: $0 <email>"
  exit 1
fi

# Validate the email format using a regular expression
if [[ ! "$1" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
  echo "Error: Invalid email format."
  exit 1
fi

# If the email format is valid, continue with the script logic
echo "Valid email: $1"

ssh-keygen -t ed25519 -C "$1"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
