# ~/.bashrc: executed by bash(1) for non-login shells.
# Kali GNU/Linux Rolling + Portable Container Bash Config (Morpheus Edition)

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

HISTCONTROL=ignoreboth
shopt -s histappend
HISTSIZE=1000
HISTFILESIZE=2000
shopt -s checkwinsize

if [ -z "${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then
    debian_chroot=$(cat /etc/debian_chroot)
fi

case "$TERM" in
    xterm-color|*-256color) color_prompt=yes;;
esac

force_color_prompt=yes

if [ -n "$force_color_prompt" ]; then
    if [ -x /usr/bin/tput ] && tput setaf 1 >&/dev/null; then
        color_prompt=yes
    else
        color_prompt=
    fi
fi

# The following block is surrounded by two delimiters.
# These delimiters must not be modified. Thanks.
# START KALI CONFIG VARIABLES
PROMPT_ALTERNATIVE=twoline
NEWLINE_BEFORE_PROMPT=yes
# STOP KALI CONFIG VARIABLES

if [ "$color_prompt" = yes ]; then
    VIRTUAL_ENV_DISABLE_PROMPT=1

    prompt_color='\[\033[;32m\]'
    info_color='\[\033[1;34m\]'
    prompt_symbol=㉿
    prompt_host="${KALI_PROMPT_HOST:-kali}"
    if [ "$EUID" -eq 0 ]; then
        prompt_color='\[\033[;94m\]'
        info_color='\[\033[1;31m\]'
    fi
    case "$PROMPT_ALTERNATIVE" in
        twoline)
            PS1=$prompt_color'┌──${debian_chroot:+($debian_chroot)──}${VIRTUAL_ENV:+(\[\033[0;1m\]$(basename $VIRTUAL_ENV)'$prompt_color')}('$info_color'\u'$prompt_symbol$prompt_host$prompt_color')-[\[\033[0;1m\]\w'$prompt_color']\n'$prompt_color'└─'$info_color'\$\[\033[0m\] ';;
        oneline)
            PS1='${VIRTUAL_ENV:+($(basename $VIRTUAL_ENV)) }${debian_chroot:+($debian_chroot)}'$info_color'\u@'$prompt_host'\[\033[00m\]:'$prompt_color'\[\033[01m\]\w\[\033[00m\]\$ ';;
        backtrack)
            PS1='${VIRTUAL_ENV:+($(basename $VIRTUAL_ENV)) }${debian_chroot:+($debian_chroot)}\[\033[01;31m\]\u@'$prompt_host'\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ ';;
    esac
    unset prompt_color
    unset info_color
    unset prompt_symbol
    unset prompt_host
else
    PS1='${debian_chroot:+($debian_chroot)}\u@kali:\w\$ '
fi
unset color_prompt force_color_prompt

case "$TERM" in
xterm*|rxvt*|Eterm|aterm|kterm|gnome*|alacritty)
    PS1="\[\e]0;${debian_chroot:+($debian_chroot)}\u@kali: \w\a\]$PS1"
    ;;
*)
    ;;
esac

[ "$NEWLINE_BEFORE_PROMPT" = yes ] && PROMPT_COMMAND="PROMPT_COMMAND=echo"

if [ -x /usr/bin/dircolors ] || command -v dircolors >/dev/null 2>&1; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    export LS_COLORS="$LS_COLORS:ow=30;44:"

    alias ls='ls --color=auto'
    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
    alias diff='diff --color=auto'
    alias ip='ip --color=auto'

    export LESS_TERMCAP_mb=$'\E[1;31m'
    export LESS_TERMCAP_md=$'\E[1;36m'
    export LESS_TERMCAP_me=$'\E[0m'
    export LESS_TERMCAP_so=$'\E[01;33m'
    export LESS_TERMCAP_se=$'\E[0m'
    export LESS_TERMCAP_us=$'\E[1;32m'
    export LESS_TERMCAP_ue=$'\E[0m'
    export MANROFFOPT="-c"
fi

alias ll='ls -l'
alias la='ls -A'
alias l='ls -CF'

if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi
if [ -f ~/.bashrc_alias ]; then
    . ~/.bashrc_alias
fi

if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi

# Portable PATH additions (OpenCode, local bin, Antigravity)
[ -d "$HOME/.opencode/bin" ] && export PATH="$HOME/.opencode/bin:$PATH"
[ -f "$HOME/.local/bin/env" ] && . "$HOME/.local/bin/env"
export PATH="$HOME/.local/bin:$PATH"

# extract offline Python docs archive to a directory
pydocs-extract() {
    local archive="${1:-$HOME/python-docs-html.zip}"
    local dest="${2:-$HOME/python-docs}"
    [ -f "$archive" ] || { echo "archive not found: $archive" >&2; return 1; }
    mkdir -p "$dest" || return 1
    case "$archive" in
        *.zip)          unzip -q -o "$archive" -d "$dest" ;;
        *.tar.bz2)      tar -xjf "$archive" -C "$dest" ;;
        *.tar.gz|*.tgz) tar -xzf "$archive" -C "$dest" ;;
        *) echo "unsupported archive: $archive" >&2; return 1 ;;
    esac
    echo "extracted to $dest"
    local index
    index=$(find "$dest" -maxdepth 2 -name index.html 2>/dev/null | head -n1)
    [ -n "$index" ] && echo "open: $index"
}

# Morpheus / Matrix Construct Telemetry
morpheus() {
    local distro="Unknown"
    [ -f /etc/os-release ] && distro=$(. /etc/os-release && echo "${PRETTY_NAME:-$NAME}")
    printf "\033[1;32m┌──[ MORPHEUS // NEBUCHADNEZZAR CONSTRUCT ]\033[0m\n"
    printf "\033[0;32m│\033[0m Host Arch : %s\n" "$(uname -m)"
    printf "\033[0;32m│\033[0m Runtime   : %s\n" "$distro"
    printf "\033[0;32m│\033[0m Harnesses : agy=%s grok=%s opencode=%s\n" \
        "$(command -v agy >/dev/null 2>&1 && echo 'ONLINE' || echo 'absent')" \
        "$(command -v grok >/dev/null 2>&1 && echo 'ONLINE' || echo 'absent')" \
        "$(command -v opencode >/dev/null 2>&1 && echo 'ONLINE' || echo 'absent')"
    printf "\033[0;32m│\033[0m Guide     : %s\n" "$([ -f "$HOME/AGENTS.md" ] && echo "$HOME/AGENTS.md (Morpheus Active)" || echo 'Unlinked')"
    printf "\033[1;32m└─> \"Free your mind.\"\033[0m\n"
}
