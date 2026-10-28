# ~/.bashrc for Android Termux Host (Blue Pill / Zion Gate)
# Launches the Kali/Debian PRoot container via `deb` or `kali`.

case $- in
    *i*) ;;
      *) return;;
esac

alias deb="proot-distro login debian"
alias kali="proot-distro login debian"
alias ll="ls -la --color=auto"

export PATH="$HOME/.local/bin:$PATH"

# Matrix Green Termux Host Prompt
PS1='\[\033[0;32m\]┌──(\[\033[1;32m\]operator㉿termux-host\[\033[0;32m\])-[\[\033[0;1m\]\w\[\033[0;32m\]]\n└─\[\033[1;32m\]\$\[\033[0m\] '
