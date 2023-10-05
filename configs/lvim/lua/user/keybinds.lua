------------------- keybinds --------------------------
local opts = { noremap = true, silent = true }

-- local term_opts = { silent = true }

-- shorten function name
local keymap = vim.api.nvim_set_keymap

-- Normal Mode --
-- Navigate buffers
keymap("n", "<c-l>", ":bnext<CR>", opts)
keymap("n", "<c-h>", ":bprevious<CR>", opts)

-- Insert Mode --
keymap("i", "jk", "<ESC>", opts)

