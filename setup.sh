#!/usr/bin/env bash
# ==============================================================================
#  MORPHEUS // MATRIX DOTFILES & CONTAINER BOOTSTRAP (setup.sh)
#  Repository : https://github.com/longdenjay00-sketch/dotfiles
#  Guarantee  : Non-destructive. Preserves existing 55_INFRA symlinks, backs up
#               any regular files before replacement, and never touches secrets.
# ==============================================================================

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_DIR="${HOME}/.dotfiles_backup/${TIMESTAMP}"
TERMUX_HOME="/data/data/com.termux/files/home"

DRY_RUN=0
MODE="auto"       # auto | termux | guest
INIT_JD=0

GREEN='\033[1;32m'
DIM_GREEN='\033[0;32m'
CYAN='\033[1;36m'
YELLOW='\033[1;33m'
RESET='\033[0m'

usage() {
    cat <<'EOF'
Usage: ./setup.sh [OPTIONS]

Options:
  --dry-run       Preview all detected nuances and actions without writing files
  --termux        Force Termux host mode (installs termux.properties & host .bashrc)
  --guest         Force container/guest mode (installs Kali .zshrc, .bashrc, Morpheus)
  --init-jd       Create Johnny Decimal directories (00_INBOX..91_OBSIDIAN) if missing
  -h, --help      Show this help message
EOF
}

while [ $# -gt 0 ]; do
    case "$1" in
        --dry-run) DRY_RUN=1 ;;
        --termux)  MODE="termux" ;;
        --guest)   MODE="guest" ;;
        --init-jd) INIT_JD=1 ;;
        -h|--help) usage; exit 0 ;;
        *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
    esac
    shift
done

log_matrix() { printf "${GREEN}[MORPHEUS]${RESET} %s\n" "$*"; }
log_info()   { printf "${DIM_GREEN}  ├─>${RESET} %s\n" "$*"; }
log_skip()   { printf "${CYAN}  ├─[SAFE-SKIP]${RESET} %s\n" "$*"; }
log_warn()   { printf "${YELLOW}  ├─[NOTICE]${RESET} %s\n" "$*"; }

# ------------------------------------------------------------------------------
# 1. Detect Runtime & Container Nuances
# ------------------------------------------------------------------------------
detect_environment() {
    ARCH="$(uname -m 2>/dev/null || echo unknown)"
    DISTRO_ID="unknown"
    DISTRO_NAME="Generic Linux"
    if [ -f /etc/os-release ]; then
        # shellcheck disable=SC1091
        . /etc/os-release
        DISTRO_ID="${ID:-unknown}"
        DISTRO_NAME="${PRETTY_NAME:-${NAME:-Linux}}"
    fi

    # Detect package manager
    PKG_MGR="none"
    for pm in apt-get apk pacman dnf yum pkg; do
        if command -v "$pm" >/dev/null 2>&1; then
            PKG_MGR="$pm"
            break
        fi
    done

    # Determine whether we are on raw Termux Host vs PRoot/Container Guest
    IS_PROOT=0
    if [ -r /proc/1/Status ] || [ -d "$TERMUX_HOME" ]; then
        if [ -f /etc/debian_version ] || [ -f /etc/os-release ]; then
            IS_PROOT=1
        fi
    fi

    if [ "$MODE" = "auto" ]; then
        if [ "$IS_PROOT" -eq 0 ] && [ -n "${TERMUX_VERSION:-}" ] && [ ! -f /etc/os-release ]; then
            RUNTIME="termux"
        else
            RUNTIME="guest"
        fi
    else
        RUNTIME="$MODE"
    fi
}

# ------------------------------------------------------------------------------
# 2. Safe File Installer (Never breaks symlinks; backs up differing files)
# ------------------------------------------------------------------------------
safe_install_file() {
    local src="$1"
    local dest="$2"
    local label="${3:-$(basename "$dest")}"

    if [ ! -f "$src" ]; then
        log_warn "Source file missing: $src"
        return 0
    fi

    # CRITICAL SAFETY RULE: Never overwrite or unlink an existing symlink!
    if [ -L "$dest" ]; then
        local target
        target="$(readlink "$dest" 2>/dev/null || echo 'symlink')"
        log_skip "$label is an active symlink ($dest -> $target); preserving intact."
        return 0
    fi

    # If destination already exists and is identical, skip cleanly
    if [ -f "$dest" ] && cmp -s "$src" "$dest"; then
        log_skip "$label is already up to date ($dest)."
        return 0
    fi

    if [ "$DRY_RUN" -eq 1 ]; then
        if [ -f "$dest" ]; then
            log_info "[DRY-RUN] Would back up $dest -> $BACKUP_DIR/ and install $label"
        else
            log_info "[DRY-RUN] Would install new file $label -> $dest"
        fi
        return 0
    fi

    mkdir -p "$(dirname "$dest")"
    if [ -f "$dest" ]; then
        mkdir -p "$BACKUP_DIR"
        cp -a "$dest" "${BACKUP_DIR}/$(basename "$dest")"
        log_info "Backed up existing $label to ${BACKUP_DIR}/$(basename "$dest")"
    fi

    cp -a "$src" "$dest"
    log_info "Installed $label -> $dest"
}

# ------------------------------------------------------------------------------
# 3. Install Morpheus Agent Instructions (AGENTS.md / GEMINI.md / GROK.md)
# ------------------------------------------------------------------------------
install_morpheus_agents() {
    log_matrix "Loading Morpheus operator instructions for AI harnesses..."
    local agents_src="${REPO_DIR}/agents/AGENTS.md"
    local toml_src="${REPO_DIR}/agents/Morpheus.toml"

    # 1. ~/AGENTS.md (used by OpenCode, Grok, Codex, and general agents)
    safe_install_file "$agents_src" "${HOME}/AGENTS.md" "Morpheus AGENTS.md"

    # 2. ~/.gemini/GEMINI.md (used by Antigravity / agy if ~/.gemini exists)
    if [ -d "${HOME}/.gemini" ] || command -v agy >/dev/null 2>&1; then
        safe_install_file "$agents_src" "${HOME}/.gemini/GEMINI.md" "Antigravity GEMINI.md (Morpheus)"
    fi

    # 3. ~/.grok/personas/Morpheus.toml & ~/.grok/GROK.md (used by Grok)
    if [ -d "${HOME}/.grok" ] || command -v grok >/dev/null 2>&1; then
        safe_install_file "$toml_src" "${HOME}/.grok/personas/Morpheus.toml" "Grok Morpheus.toml persona"
        safe_install_file "$agents_src" "${HOME}/.grok/GROK.md" "Grok GROK.md (Morpheus)"
    fi
}

# ------------------------------------------------------------------------------
# 4. Link or Verify Johnny Decimal Areas
# ------------------------------------------------------------------------------
setup_johnny_decimal() {
    local areas=(
        "00_INBOX"
        "10_DEV"
        "20_MEDIA"
        "30_DOCS"
        "40_BUSINESS"
        "50_OPS"
        "55_INFRA"
        "60_TEMPLATES"
        "70_BACKUP"
        "80_ARCHIVE"
        "90_VAULT"
        "91_OBSIDIAN"
    )

    if [ -d "$TERMUX_HOME" ] && [ "$HOME" != "$TERMUX_HOME" ]; then
        log_matrix "Verifying Johnny Decimal bridge to Termux host ($TERMUX_HOME)..."
        for area in "${areas[@]}"; do
            local host_dir="${TERMUX_HOME}/${area}"
            local guest_link="${HOME}/${area}"
            if [ -L "$guest_link" ] || [ -e "$guest_link" ]; then
                log_skip "Area $area already present at $guest_link"
            elif [ -d "$host_dir" ]; then
                if [ "$DRY_RUN" -eq 1 ]; then
                    log_info "[DRY-RUN] Would symlink $guest_link -> $host_dir"
                else
                    ln -s "$host_dir" "$guest_link"
                    log_info "Linked $guest_link -> $host_dir"
                fi
            fi
        done
    elif [ "$INIT_JD" -eq 1 ]; then
        log_matrix "Initializing local Johnny Decimal areas in $HOME..."
        for area in "${areas[@]}"; do
            local target="${HOME}/${area}"
            if [ -e "$target" ]; then
                log_skip "Area $area already exists"
            elif [ "$DRY_RUN" -eq 1 ]; then
                log_info "[DRY-RUN] Would create directory $target"
            else
                mkdir -p "$target"
                [ "$area" = "90_VAULT" ] && chmod 700 "$target"
                log_info "Created $target"
            fi
        done
    fi
}

# ------------------------------------------------------------------------------
# 5. Execute Setup by Runtime
# ------------------------------------------------------------------------------
detect_environment

printf "\n${GREEN}┌────────────────────────────────────────────────────────────────────┐${RESET}\n"
printf "${GREEN}│  MORPHEUS // MATRIX DOTFILES & CONTAINER SETUP                     │${RESET}\n"
printf "${GREEN}└────────────────────────────────────────────────────────────────────┘${RESET}\n"
log_info "Detected Arch       : ${ARCH}"
log_info "Detected OS/Distro  : ${DISTRO_NAME} (${DISTRO_ID})"
log_info "Package Manager     : ${PKG_MGR}"
log_info "Target Runtime Mode : ${RUNTIME} $([ "$DRY_RUN" -eq 1 ] && echo '(DRY-RUN)' || echo '(SAFE-APPLY)')"
log_info "Harnesses Found     : agy=$(command -v agy >/dev/null 2>&1 && echo yes || echo no) | grok=$(command -v grok >/dev/null 2>&1 && echo yes || echo no) | opencode=$(command -v opencode >/dev/null 2>&1 && echo yes || echo no)"
echo ""

if [ "$RUNTIME" = "termux" ]; then
    log_matrix "Configuring Termux Host (Blue Pill / Zion Gate)..."
    safe_install_file "${REPO_DIR}/termux.properties" "${HOME}/.termux/termux.properties" "termux.properties"
    safe_install_file "${REPO_DIR}/termux/.bashrc" "${HOME}/.bashrc" "Termux .bashrc"
    safe_install_file "${REPO_DIR}/.gitconfig" "${HOME}/.gitconfig" "Termux .gitconfig"
    setup_johnny_decimal
    install_morpheus_agents
    if [ "$DRY_RUN" -eq 0 ] && command -v termux-reload-settings >/dev/null 2>&1; then
        termux-reload-settings || true
        log_info "Reloaded Termux settings."
    fi
else
    log_matrix "Configuring Container / Kali Guest (Red Pill / The Construct)..."
    safe_install_file "${REPO_DIR}/.zshrc" "${HOME}/.zshrc" "Kali .zshrc"
    safe_install_file "${REPO_DIR}/.bashrc" "${HOME}/.bashrc" "Kali .bashrc"
    safe_install_file "${REPO_DIR}/.profile" "${HOME}/.profile" "Kali .profile"
    safe_install_file "${REPO_DIR}/.gitconfig" "${HOME}/.gitconfig" "Portable .gitconfig"
    setup_johnny_decimal
    install_morpheus_agents
fi

echo ""
log_matrix "Setup complete. No existing symlinks or secrets were modified."
printf "${GREEN}  └─> \"Welcome to the real world.\" (Run 'morpheus' in your shell for status)${RESET}\n\n"
