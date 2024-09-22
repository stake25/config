#!/bin/bash

if dpkg -l | grep -q libreoffice; then
    sudo apt remove --purge libreoffice* -y && sudo apt autoremove -y
    echo "LibreOffice has been uninstalled."
else
    echo "LibreOffice is not installed."
fi

