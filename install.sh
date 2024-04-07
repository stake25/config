#!/bin/bash

# Check if the script is given at least one argument
if [ $# -eq 0 ]; then
	echo "Usage: $0 [name]"
	exit 1
fi

# Store the first argument in a variable
name=$1

# run the command based on the argument
if [[ "$1" == "all" ]]; then
	exec './configs/zsh/install.sh'
fi
