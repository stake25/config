local opts = { noremap = true, silent = true}

-- local term_opts = { silent = true }

-- shorten function name
local keymap = vim.api.nvim_set_keymap

-- Normal Mode --


-- Insert Mode --
keymap("i", "jk", "<ESC>", opts)

