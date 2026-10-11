# dotfiles

Guest shell config for Kali GNU/Linux Rolling 2026.3 (`aarch64`) inside a
Termux `proot-distro` Debian container. Host (Termux) dotfiles stay on the
host. This repo is the guest copy only.

Tracked files live in `$HOME` of the guest (`/root` here). Nothing in this
repo is a secret store: no keys, tokens, history, or `.env`.

## Layout

| File | Role |
| --- | --- |
| `.zshrc` | Interactive zsh. Kali two-line prompt, emacs bindings, completion, history, syntax highlighting, autosuggestions, `pydocs-extract`. |
| `.bashrc` | Interactive bash. Same Kali prompt variables (`PROMPT_ALTERNATIVE`, `NEWLINE_BEFORE_PROMPT`). |
| `.profile` | Login shells. Sources `.bashrc` when bash is the login shell, then `~/.local/bin/env`. |
| `.gitconfig` | GitHub credential helper via `gh auth git-credential` only. No user name or email. |

Prompt defaults (do not edit the `START`/`STOP KALI CONFIG VARIABLES` markers):

```
PROMPT_ALTERNATIVE=twoline
NEWLINE_BEFORE_PROMPT=yes
```

`^P` toggles the zsh prompt between two-line and one-line.

## Install

From a fresh guest checkout:

```bash
git clone https://github.com/longdenjay00-sketch/dotfiles.git ~/dotfiles
cd ~/dotfiles
cp -a .zshrc .bashrc .profile .gitconfig ~
```

Existing files are overwritten. Back them up first if they differ.

Optional packages the zsh config looks for but does not require:

```bash
sudo apt install zsh zsh-syntax-highlighting zsh-autosuggestions
```

GitHub auth for the credential helper:

```bash
gh auth login
```

## What stays out

Do not commit:

- `~/.ssh`, `~/.config/gh`, `~/.secrets`
- shell history (`.zsh_history`, `.bash_history`)
- `~/.local`, caches, `node_modules`, venvs
- host Termux files under `/data/data/com.termux/files/home`

One heavy process at a time on this tablet (OpenCode, Ollama, or a build).
Ollama stays on the Termux host, not in this guest.
