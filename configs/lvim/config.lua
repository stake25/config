-- Read the docs: https://www.lunarvim.org/docs/configuration
-- Video Tutorials: https://www.youtube.com/watch?v=sFA9kX-Ud_c&list=PLhoH5vyxr6QqGu0i7tt_XoVK9v-KvZ3m6
-- Forum: https://www.reddit.com/r/lunarvim/
-- Discord: https://discord.com/invite/Xb9B4Ny

----------------- config -------------------------
-- set clipboard always on
lvim.builtin.clipboard = {
  enabled = true,
}

----------------------- plugins ------------------------
lvim.plugins = {
  {
    "christoomey/vim-tmux-navigator",
    lazy = false,
  }
}

------------------- keybinds --------------------------
local keyOpts = { noremap = true, silent = true}

-- local term_opts = { silent = true }

-- shorten function name
local keymap = vim.api.nvim_set_keymap

-- Normal Mode --


-- Insert Mode --
keymap("i", "jk", "<ESC>", keyOpts)

