#!/bin/bash

# Get the battery status using acpi
BATTERY_INFO=$(acpi -b)

# Extract the percentage and the charging status
BATTERY_PERCENTAGE=$(echo "$BATTERY_INFO" | grep -oP '\d+%' | tr -d '%')
BATTERY_STATUS=$(echo "$BATTERY_INFO" | grep -oP '(Charging|Discharging|Full)')

# Define icons for different statuses
ICON=""
if [ "$BATTERY_STATUS" = "Charging" ]; then
    ICON="🔌"
elif [ "$BATTERY_STATUS" = "Full" ]; then
    ICON="🔋"
else
    ICON="🔋"
fi

# Print the battery status with an icon
echo "$ICON $BATTERY_PERCENTAGE%"

