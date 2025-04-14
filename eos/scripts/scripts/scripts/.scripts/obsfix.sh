# select version 0.13.2-1 for both of these:
sudo downgrade v4l2loopback-dkms
sudo downgrade v4l2loopback-utils

#refresh the module (or you could just reboot and skip these two commands)
sudo rmmod -f v4l2loopback
sudo modprobe v4l2loopback

