#!/bin/bash

find . -type f -name "install.sh" -exec {} \;
find . -type f -name "uninstall.sh" -exec {} \;

