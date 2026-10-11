# dotfiles

Shell config for two runtimes on one tablet:

- **Guest** — Kali GNU/Linux Rolling 2026.3 (`aarch64`) inside a Termux
  `proot-distro` Debian container. Files install into `$HOME` (`/root`).
- **Host** — Termux app settings. `termux.properties` installs into
  `~/.termux/` on the Termux side, not inside the guest.

Nothing in this repo is a secret store: no keys, tokens, history, or `.env`.

## Layout

| File | Role |
| --- | --- |
| `.zshrc` | Interactive zsh. Kali two-line prompt, emacs bindings, completion, history, syntax highlighting, autosuggestions, `pydocs-extract`. |
| `.bashrc` | Interactive bash. Same Kali prompt variables (`PROMPT_ALTERNATIVE`, `NEWLINE_BEFORE_PROMPT`). |
| `.profile` | Login shells. Sources `.bashrc` when bash is the login shell, then `~/.local/bin/env`. |
| `.gitconfig` | GitHub credential helper via `gh auth git-credential` only. No user name or email. |
| `termux.properties` | Host only. Fullscreen, black UI, modest scrollback, two-row extra keys aimed at tmux (`Ctrl-b`). |

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

Host install (run from Termux, not from the guest):

```bash
mkdir -p ~/.termux
cp ~/dotfiles/termux.properties ~/.termux/termux.properties
termux-reload-settings
```

Extra-keys changes apply to the next session. `allow-external-apps` stays off.

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
- the rest of `/data/data/com.termux/files/home` (only `termux.properties` is tracked)

One heavy process at a time on this tablet (OpenCode, Ollama, or a build).
Ollama stays on the Termux host, not in this guest.
