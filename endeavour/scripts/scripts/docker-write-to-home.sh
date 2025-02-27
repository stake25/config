#!/bin/bash
OLD_DOCKER="/var/lib/docker"
NEW_DOCKER="$HOME/docker-storage"

echo ""
echo "[INFO]: Stopping Docker"
sudo systemctl stop docker

echo ""
echo "[INFO]: Performing move from $OLD_DOCKER to $NEW_DOCKER"
sudo mv "$OLD_DOCKER/" "$NEW_DOCKER/"

echo ""
echo "[INFO]: Creating symbolic link from $OLD_DOCKER to $NEW_DOCKER"
sudo ln -s "$NEW_DOCKER/" "$OLD_DOCKER"

echo ""
echo "[INFO]: Restarting Docker"
sudo systemctl start docker
