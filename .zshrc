# ~/.zshrc file for zsh interactive shells.
# Kali GNU/Linux Rolling + Portable Container Zsh Config (Morpheus Edition)

setopt autocd              # change directory just by typing its name
#setopt correct            # auto correct mistakes
setopt interactivecomments # allow comments in interactive mode
setopt magicequalsubst     # enable filename expansion for arguments of the form ‘anything=expression’
setopt nonomatch           # hide error message if there is no match for the pattern
setopt notify              # report the status of background jobs immediately
setopt numericglobsort     # sort filenames numerically when it makes sense
setopt promptsubst         # enable command substitution in prompt

WORDCHARS='_-' # Don't consider certain characters part of the word

# hide EOL sign ('%')
PROMPT_EOL_MARK=""

# configure key keybindings
bindkey -e                                        # emacs key bindings
bindkey ' ' magic-space                           # do history expansion on space
bindkey '^U' backward-kill-line                   # ctrl + U
bindkey '^[[3;5~' kill-word                       # ctrl + Supr
bindkey '^[[3~' delete-char                       # delete
bindkey '^[[1;5C' forward-word                    # ctrl + ->
bindkey '^[[1;5D' backward-word                   # ctrl + <-
bindkey '^[[5~' beginning-of-buffer-or-history    # page up
bindkey '^[[6~' end-of-buffer-or-history          # page down
bindkey '^[[H' beginning-of-line                  # home
bindkey '^[[F' end-of-line                        # end
bindkey '^[[Z' undo                               # shift + tab undo last action

# enable completion features
autoload -Uz compinit
mkdir -p ~/.cache
compinit -d ~/.cache/zcompdump
zstyle ':completion:*:*:*:*:*' menu select
zstyle ':completion:*' auto-description 'specify: %d'
zstyle ':completion:*' completer _expand _complete
zstyle ':completion:*' format 'Completing %d'
zstyle ':completion:*' group-name ''
zstyle ':completion:*' list-colors ''
zstyle ':completion:*' list-prompt %SAt %p: Hit TAB for more, or the character to insert%s
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'
zstyle ':completion:*' rehash true
zstyle ':completion:*' select-prompt %SScrolling active: current selection at %p%s
zstyle ':completion:*' use-compctl false
zstyle ':completion:*' verbose true
zstyle ':completion:*:kill:*' command 'ps -u $USER -o pid,%cpu,tty,cputime,cmd'

# History configurations
HISTFILE=~/.zsh_history
HISTSIZE=1000
SAVEHIST=2000
setopt hist_expire_dups_first # delete duplicates first when HISTFILE size exceeds HISTSIZE
setopt hist_ignore_dups       # ignore duplicated commands history list
setopt hist_ignore_space      # ignore commands that start with space
setopt hist_verify            # show command with history expansion to user before running it

# force zsh to show the complete history
alias history="history 0"

# configure `time` format
TIMEFMT=$'\nreal\t%E\nuser\t%U\nsys\t%S\ncpu\t%P'

# set variable identifying the chroot you work in (used in the prompt below)
if [ -z "${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then
    debian_chroot=$(cat /etc/debian_chroot)
fi

# set a fancy prompt (non-color, unless we know we "want" color)
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

configure_prompt() {
    prompt_symbol=㉿
    # Keep the iconic Kali host label by default while allowing override via KALI_PROMPT_HOST
    local prompt_host="${KALI_PROMPT_HOST:-kali}"
    case "$PROMPT_ALTERNATIVE" in
        twoline)
            PROMPT=$'%F{%(#.blue.green)}┌──${debian_chroot:+($debian_chroot)─}${VIRTUAL_ENV:+($(basename $VIRTUAL_ENV))─}(%B%F{%(#.red.blue)}%n'$prompt_symbol$prompt_host$'%b%F{%(#.blue.green)})-[%B%F{reset}%(6~.%-1~/…/%4~.%5~)%b%F{%(#.blue.green)}]\n└─%B%(#.%F{red}#.%F{blue}$)%b%F{reset} '
            ;;
        oneline)
            PROMPT=$'${debian_chroot:+($debian_chroot)}${VIRTUAL_ENV:+($(basename $VIRTUAL_ENV))}%B%F{%(#.red.blue)}%n@'$prompt_host$'%b%F{reset}:%B%F{%(#.blue.green)}%~%b%F{reset}%(#.#.$) '
            RPROMPT=
            ;;
        backtrack)
            PROMPT=$'${debian_chroot:+($debian_chroot)}${VIRTUAL_ENV:+($(basename $VIRTUAL_ENV))}%B%F{red}%n@'$prompt_host$'%b%F{reset}:%B%F{blue}%~%b%F{reset}%(#.#.$) '
            RPROMPT=
            ;;
    esac
    unset prompt_symbol
}

# The following block is surrounded by two delimiters.
# These delimiters must not be modified. Thanks.
# START KALI CONFIG VARIABLES
PROMPT_ALTERNATIVE=twoline
NEWLINE_BEFORE_PROMPT=yes
# STOP KALI CONFIG VARIABLES

if [ "$color_prompt" = yes ]; then
    VIRTUAL_ENV_DISABLE_PROMPT=1

    configure_prompt

    # enable syntax-highlighting (checks Debian/Kali and Termux paths)
    for _hl in /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh \
               "${PREFIX:-}/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh"; do
        if [ -f "$_hl" ]; then
            . "$_hl"
            ZSH_HIGHLIGHT_HIGHLIGHTERS=(main brackets pattern)
            ZSH_HIGHLIGHT_STYLES[default]=none
            ZSH_HIGHLIGHT_STYLES[unknown-token]=underline
            ZSH_HIGHLIGHT_STYLES[reserved-word]=fg=cyan,bold
            ZSH_HIGHLIGHT_STYLES[suffix-alias]=fg=green,underline
            ZSH_HIGHLIGHT_STYLES[global-alias]=fg=green,bold
            ZSH_HIGHLIGHT_STYLES[precommand]=fg=green,underline
            ZSH_HIGHLIGHT_STYLES[commandseparator]=fg=blue,bold
            ZSH_HIGHLIGHT_STYLES[autodirectory]=fg=green,underline
            ZSH_HIGHLIGHT_STYLES[path]=bold
            ZSH_HIGHLIGHT_STYLES[globbing]=fg=blue,bold
            ZSH_HIGHLIGHT_STYLES[history-expansion]=fg=blue,bold
            ZSH_HIGHLIGHT_STYLES[command-substitution-delimiter]=fg=magenta,bold
            ZSH_HIGHLIGHT_STYLES[process-substitution-delimiter]=fg=magenta,bold
            ZSH_HIGHLIGHT_STYLES[single-hyphen-option]=fg=green
            ZSH_HIGHLIGHT_STYLES[double-hyphen-option]=fg=green
            ZSH_HIGHLIGHT_STYLES[back-quoted-argument-delimiter]=fg=blue,bold
            ZSH_HIGHLIGHT_STYLES[single-quoted-argument]=fg=yellow
            ZSH_HIGHLIGHT_STYLES[double-quoted-argument]=fg=yellow
            ZSH_HIGHLIGHT_STYLES[dollar-quoted-argument]=fg=yellow
            ZSH_HIGHLIGHT_STYLES[rc-quote]=fg=magenta
            ZSH_HIGHLIGHT_STYLES[dollar-double-quoted-argument]=fg=magenta,bold
            ZSH_HIGHLIGHT_STYLES[back-double-quoted-argument]=fg=magenta,bold
            ZSH_HIGHLIGHT_STYLES[back-dollar-quoted-argument]=fg=magenta,bold
            ZSH_HIGHLIGHT_STYLES[redirection]=fg=blue,bold
            ZSH_HIGHLIGHT_STYLES[comment]=fg=black,bold
            ZSH_HIGHLIGHT_STYLES[arg0]=fg=cyan
            ZSH_HIGHLIGHT_STYLES[bracket-error]=fg=red,bold
            ZSH_HIGHLIGHT_STYLES[bracket-level-1]=fg=blue,bold
            ZSH_HIGHLIGHT_STYLES[bracket-level-2]=fg=green,bold
            ZSH_HIGHLIGHT_STYLES[bracket-level-3]=fg=magenta,bold
            ZSH_HIGHLIGHT_STYLES[bracket-level-4]=fg=yellow,bold
            ZSH_HIGHLIGHT_STYLES[bracket-level-5]=fg=cyan,bold
            ZSH_HIGHLIGHT_STYLES[cursor-matchingbracket]=standout
            break
        fi
    done
    unset _hl
else
    PROMPT='${debian_chroot:+($debian_chroot)}%n@kali:%~%(#.#.$) '
fi
unset color_prompt force_color_prompt

toggle_oneline_prompt(){
    if [ "$PROMPT_ALTERNATIVE" = oneline ]; then
        PROMPT_ALTERNATIVE=twoline
    else
        PROMPT_ALTERNATIVE=oneline
    fi
    configure_prompt
    zle reset-prompt
}
zle -N toggle_oneline_prompt
bindkey ^P toggle_oneline_prompt

# If this is an xterm set the title to user@host:dir
case "$TERM" in
xterm*|rxvt*|Eterm|aterm|kterm|gnome*|alacritty)
    TERM_TITLE=$'\e]0;${debian_chroot:+($debian_chroot)}${VIRTUAL_ENV:+($(basename $VIRTUAL_ENV))}%n@kali: %~\a'
    ;;
*)
    ;;
esac

precmd() {
    print -Pnr -- "$TERM_TITLE"

    if [ "$NEWLINE_BEFORE_PROMPT" = yes ]; then
        if [ -z "$_NEW_LINE_BEFORE_PROMPT" ]; then
            _NEW_LINE_BEFORE_PROMPT=1
        else
            print ""
        fi
    fi
}

# enable color support of ls, less and man, and also add handy aliases
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

    zstyle ':completion:*' list-colors "${(s.:.)LS_COLORS}"
    zstyle ':completion:*:*:kill:*:processes' list-colors '=(#b) #([0-9]#)*=0=01;31'
fi

alias ll='ls -l'
alias la='ls -A'
alias l='ls -CF'

# enable auto-suggestions based on the history
for _as in /usr/share/zsh-autosuggestions/zsh-autosuggestions.zsh \
           "${PREFIX:-}/share/zsh-autosuggestions/zsh-autosuggestions.zsh"; do
    if [ -f "$_as" ]; then
        . "$_as"
        ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=244'
        break
    fi
done
unset _as

if [ -f /etc/zsh_command_not_found ]; then
    . /etc/zsh_command_not_found
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
