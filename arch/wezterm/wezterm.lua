-- Pull in the wezterm API
local wezterm = require("wezterm")

-- This will hold the configuration.
local config = wezterm.config_builder()

-- This is where you actually apply your config choices
config.window_close_confirmation = "NeverPrompt"
config.font = wezterm.font_with_fallback({
        "Fira Code Nerd Font",
        "DejaVu Sans",
        "Noto Sans Symbols"
    })

config.hide_tab_bar_if_only_one_tab = true
config.window_background_opacity = 0.98

-- For example, changing the color scheme:
config.color_scheme = "Catppuccin Mocha"

-- Set Ctrl+Space as the leader key
config.leader = { key = "Space", mods = "CTRL" }

-- Define keybindings
config.keys = {
	-- Create a new tab (Ctrl+Space, c)
	{ key = "c", mods = "LEADER", action = wezterm.action({ SpawnTab = "DefaultDomain" }) },

	-- Split horizontal (Ctrl+Space, h)
	{
		key = "h",
		mods = "LEADER",
		action = wezterm.action({ SplitHorizontal = { domain = "CurrentPaneDomain" } }),
	},

	-- Split vertical (Ctrl+Space, j)
	{ key = "j", mods = "LEADER", action = wezterm.action({ SplitVertical = { domain = "CurrentPaneDomain" } }) },

	-- Close pane (Ctrl+Space, x)
	{ key = "x", mods = "LEADER", action = wezterm.action({ CloseCurrentPane = { confirm = true } }) },

	-- Move to the next pane (Ctrl+Space, o)
	{ key = "o", mods = "LEADER", action = wezterm.action({ ActivatePaneDirection = "Next" }) },

	-- Move to the previous pane (Ctrl+Space, Ctrl+o)
	{ key = "o", mods = "LEADER|CTRL", action = wezterm.action({ ActivatePaneDirection = "Prev" }) },

	-- Resize pane (Ctrl+Space, arrow keys)
	{ key = "LeftArrow", mods = "LEADER", action = wezterm.action({ AdjustPaneSize = { "Left", 1 } }) },
	{ key = "RightArrow", mods = "LEADER", action = wezterm.action({ AdjustPaneSize = { "Right", 1 } }) },
	{ key = "UpArrow", mods = "LEADER", action = wezterm.action({ AdjustPaneSize = { "Up", 1 } }) },
	{ key = "DownArrow", mods = "LEADER", action = wezterm.action({ AdjustPaneSize = { "Down", 1 } }) },

	-- Move to the next tab (Ctrl+Space, n)
	{ key = "n", mods = "LEADER", action = wezterm.action({ ActivateTabRelative = 1 }) },

	-- Move to the previous tab (Ctrl+Space, p)
	{ key = "p", mods = "LEADER", action = wezterm.action({ ActivateTabRelative = -1 }) },
}

-- and finally, return the configuration to wezterm
return config
