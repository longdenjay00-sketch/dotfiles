import './style.css';

const RUNTIME_DATA = {
  red: {
    badge: '🔴 RED PILL // THE CONSTRUCT (KALI PROOT & PORTABLE CONTAINERS)',
    title: 'Guest Container Runtime: Kali GNU/Linux Rolling (aarch64)',
    summary:
      'Runs inside a Termux proot-distro Debian container on the BYYBUO SmartPad T10—or clones cleanly into any fresh Debian, Ubuntu, Kali, Alpine, or Docker container while keeping the signature two-line root㉿kali prompt.',
    files: [
      {
        name: '.zshrc',
        target: '~/.zshrc (or symlink -> 55_INFRA/dotfiles/.zshrc)',
        desc: 'Two-line Kali prompt (PROMPT_ALTERNATIVE=twoline), Ctrl-P one-line toggle, syntax highlighting, autosuggestions, pydocs-extract, and the morpheus telemetry command.',
      },
      {
        name: '.bashrc',
        target: '~/.bashrc (or symlink -> 55_INFRA/dotfiles/.bashrc)',
        desc: 'Identical two-line root㉿kali prompt for interactive Bash sessions, completion hooks, OpenCode & ~/.local/bin PATH exports, and morpheus telemetry.',
      },
      {
        name: '.profile',
        target: '~/.profile',
        desc: 'Login shell bootstrap sourcing ~/.bashrc, ~/.local/bin/env, and wiring ~/.opencode/bin and ~/.local/bin into PATH.',
      },
      {
        name: '.gitconfig',
        target: '~/.gitconfig',
        desc: 'Portable GitHub credential helper via !gh auth git-credential (resolves gh dynamically on PATH in any container) with zero stored tokens.',
      },
    ],
  },
  blue: {
    badge: '🔵 BLUE PILL // ZION GATE (ANDROID TERMUX HOST)',
    title: 'Host Runtime: Android Termux (/data/data/com.termux/files/home)',
    summary:
      'Configures the outer Android tablet layer: pitch-black fullscreen UI, two-row tmux hardware extra-keys, PRoot login aliases (deb / kali), and the canonical Johnny Decimal filesystem spine.',
    files: [
      {
        name: 'termux.properties',
        target: '~/.termux/termux.properties',
        desc: 'Fullscreen black terminal UI, 2000-line scrollback, and a custom two-row extra-keys matrix tuned for tmux (Ctrl-b, arrows, PgUp/PgDn, Home/End).',
      },
      {
        name: 'termux/.bashrc',
        target: '~/.bashrc (Termux Host)',
        desc: 'Matrix-green operator prompt on the Android host with instant `deb` and `kali` aliases (`proot-distro login debian`) to enter the Construct.',
      },
      {
        name: '55_INFRA/dotfiles/',
        target: 'Live Host Infrastructure Bridge',
        desc: 'Holds the live symlinked dotfiles on the primary tablet. setup.sh detects these symlinks and never overwrites or breaks them.',
      },
      {
        name: 'Johnny Decimal Spine',
        target: '00_INBOX .. 91_OBSIDIAN',
        desc: 'Twelve structured directories living in Termux home and bridged into /root inside the Kali PRoot guest.',
      },
    ],
  },
};

const JD_AREAS = [
  { code: '00_INBOX', tag: 'Landing', desc: 'Unsorted incoming files. Sort promptly; never leave finished work here.' },
  { code: '10_DEV', tag: 'Code', desc: 'Repositories and active engineering (`10_DEV/11_PROJECTS`).' },
  { code: '20_MEDIA', tag: 'Media', desc: 'Video renders, audio assets, and Turbo-The-Turtle pipeline outputs.' },
  { code: '30_DOCS', tag: 'Manuals', desc: 'Technical documentation, Kali references, and session notes.' },
  { code: '40_BUSINESS', tag: 'Ops/Biz', desc: 'Business records, client paperwork, and eBay operations (`40_BUSINESS/ebay/`).' },
  { code: '50_OPS', tag: 'Host Services', desc: 'Machine daemon scripts: `sshd`, `wake-lock`, and `Termux:X11`.' },
  { code: '55_INFRA', tag: 'Dotfiles', desc: 'Live infrastructure and symlinked dotfiles (`55_INFRA/dotfiles/`).' },
  { code: '60_TEMPLATES', tag: 'Scaffolds', desc: 'Reusable project boilerplates and document starters.' },
  { code: '70_BACKUP', tag: 'Snapshots', desc: 'Small dated config backups before system modifications.' },
  { code: '80_ARCHIVE', tag: 'Cold Storage', desc: 'Cold tarballs and rootfs snapshots (`80_ARCHIVE/debian.tar`).' },
  { code: '90_VAULT', tag: 'chmod 700', desc: 'Restricted secrets vault. Never copied into another area or Git repo.', vault: true },
  { code: '91_OBSIDIAN', tag: 'Knowledge', desc: 'Obsidian knowledge graph and linked second-brain notes.' },
];

let activePill = 'red';

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="container">
    <header class="operator-bar">
      <div class="pulse-group">
        <span class="pulse-dot"></span>
        <span>NEBUCHADNEZZAR CONSTRUCT // DOTFILES OPERATOR CONSOLE</span>
      </div>
      <div>HOST: <strong>BYYBUO SmartPad T10 (aarch64)</strong> &nbsp;|&nbsp; GUIDE: <strong>MORPHEUS (AGENTS.md)</strong></div>
    </header>

    <section class="hero">
      <div class="construct-card">
        <div>
          <div class="construct-tag">longdenjay00-sketch / dotfiles // Matrix Edition</div>
          <h1 class="hero-title">Two Runtimes. One Tablet. Zero Broken Symlinks.</h1>
          <blockquote class="hero-quote">
            “You take the blue pill, you stay in Termux host. You take the red pill, you enter the Kali PRoot Construct—and I show you how deep the rabbit hole goes.”
          </blockquote>
          <p class="hero-desc">
            A portable, container-aware dotfiles &amp; AI harness bootstrap designed for our <code>aarch64</code> Android tablet (<strong>Termux</strong> + <strong>Debian PRoot</strong> + <strong>Kali GNU/Linux Rolling</strong>)—and engineered to clone cleanly into any fresh container while configuring <strong>Antigravity (<code>agy</code>)</strong>, <strong>Grok</strong>, and <strong>OpenCode</strong> to operate as <strong>Morpheus</strong>.
          </p>
        </div>

        <div>
          <div class="construct-tag" style="margin-bottom: 0.4rem;">SELECT RUNTIME LAYER TO INSPECT:</div>
          <div class="pill-selector">
            <button class="pill-btn red active" id="btn-red" type="button">
              🔴 Red Pill: Kali Guest &amp; Containers
            </button>
            <button class="pill-btn blue" id="btn-blue" type="button">
              🔵 Blue Pill: Termux Android Host
            </button>
            <a class="pill-btn" href="https://github.com/longdenjay00-sketch/dotfiles" target="_blank" rel="noopener">
              GitHub Repo ↗
            </a>
          </div>
        </div>
      </div>

      <div class="terminal-window">
        <div class="terminal-titlebar">
          <span>root㉿kali: ~/dotfiles (zsh)</span>
          <span>^P: toggle twoline/oneline</span>
        </div>
        <div class="terminal-content">
          <div>
            <span class="kali-prompt-blue">┌──(</span><span class="kali-prompt-red">root㉿kali</span><span class="kali-prompt-blue">)-[</span><span class="kali-prompt-white">~/10_DEV/11_PROJECTS/repos/dotfiles</span><span class="kali-prompt-blue">]</span>
          </div>
          <div>
            <span class="kali-prompt-blue">└─</span><span class="kali-prompt-red">#</span> <span class="kali-prompt-white">morpheus</span>
          </div>
          <div class="morpheus-box">
            <div><strong>┌──[ MORPHEUS // NEBUCHADNEZZAR CONSTRUCT ]</strong></div>
            <div>│ Host Arch : aarch64 (BYYBUO SmartPad T10)</div>
            <div>│ Runtime   : Kali GNU/Linux Rolling (PRoot Guest)</div>
            <div>│ Harnesses : agy=ONLINE grok=ONLINE opencode=ONLINE</div>
            <div>│ Guide     : /root/AGENTS.md (Morpheus Active)</div>
            <div><strong>└─&gt; "Free your mind."</strong></div>
          </div>
          <div style="margin-top: 0.9rem;">
            <span class="kali-prompt-blue">┌──(</span><span class="kali-prompt-red">root㉿kali</span><span class="kali-prompt-blue">)-[</span><span class="kali-prompt-white">~</span><span class="kali-prompt-blue">]</span>
          </div>
          <div>
            <span class="kali-prompt-blue">└─</span><span class="kali-prompt-red">#</span> <span style="color: var(--matrix-green);">./setup.sh --dry-run</span>
          </div>
          <div style="color: var(--text-sub); font-size: 0.75rem; margin-top: 0.25rem;">
            ✓ Active 55_INFRA symlinks preserved · ✓ Zero secrets tracked
          </div>
        </div>
      </div>
    </section>

    <section class="runtime-panel" id="runtime-panel"></section>

    <section>
      <div class="section-head">
        <h2 class="section-title"><span>[01]</span> Interactive <code>setup.sh</code> Bootstrap Simulator</h2>
        <span class="section-meta">NON-DESTRUCTIVE CONTAINER ADAPTATION</span>
      </div>

      <div class="sim-grid">
        <div class="sim-controls">
          <div class="construct-tag">CONFIGURE BOOTSTRAP FLAGS</div>
          <div class="control-group">
            <label>
              <input type="radio" name="sim-mode" value="proot" checked />
              <span>Primary Tablet (Kali PRoot with active 55_INFRA symlinks)</span>
            </label>
            <label>
              <input type="radio" name="sim-mode" value="container" />
              <span>Fresh Container Clone (Debian / Ubuntu / Docker / Alpine)</span>
            </label>
            <label>
              <input type="radio" name="sim-mode" value="termux" />
              <span>Termux Host Mode (<code>--termux</code>)</span>
            </label>
          </div>

          <div class="control-group" style="border-top: 1px dashed var(--border-green); padding-top: 0.75rem;">
            <label>
              <input type="checkbox" id="chk-dry" />
              <span><code>--dry-run</code> (Preview actions without writing files)</span>
            </label>
            <label>
              <input type="checkbox" id="chk-jd" />
              <span><code>--init-jd</code> (Create local Johnny Decimal folders if unmounted)</span>
            </label>
          </div>

          <div>
            <div class="extrakeys-label">GENERATED COMMAND:</div>
            <div class="cmd-copy-box">
              <code id="sim-cmd">./setup.sh</code>
              <button class="copy-btn" id="copy-btn" type="button">Copy</button>
            </div>
          </div>
        </div>

        <div class="terminal-window">
          <div class="terminal-titlebar">
            <span>setup.sh execution telemetry</span>
            <span>SAFE-SKIP SYMLINK GUARD</span>
          </div>
          <pre class="terminal-content" id="sim-output" style="white-space: pre-wrap;"></pre>
        </div>
      </div>
    </section>

    <section>
      <div class="section-head">
        <h2 class="section-title"><span>[02]</span> Morpheus AI Harness Integration (<code>agents/</code>)</h2>
        <span class="section-meta">AGY · GROK · OPENCODE</span>
      </div>

      <div class="harness-grid">
        <article class="harness-card">
          <h3>Antigravity (<code>agy</code>)</h3>
          <div class="harness-path">Target: ~/.gemini/GEMINI.md &amp; ~/AGENTS.md</div>
          <p>
            Loads the <strong>Morpheus</strong> system operator persona, PRoot environmental awareness (no <code>systemd</code>/<code>journalctl</code>, one heavy process at a time, <code>uv</code> over raw <code>pip</code>), and strict Johnny Decimal filing discipline.
          </p>
        </article>

        <article class="harness-card">
          <h3>Grok CLI (<code>grok</code>)</h3>
          <div class="harness-path">Target: ~/.grok/personas/Morpheus.toml &amp; ~/.grok/GROK.md</div>
          <p>
            Installs the dedicated <code>Morpheus.toml</code> persona profile and workspace rules so Grok answers directly as the Kali guide and never duplicates the Johnny Decimal directory tree.
          </p>
        </article>

        <article class="harness-card">
          <h3>OpenCode (<code>opencode</code>)</h3>
          <div class="harness-path">Target: ~/AGENTS.md &amp; ~/.opencode/bin</div>
          <p>
            Automatically wires <code>~/.opencode/bin</code> into <code>PATH</code> across both <code>.zshrc</code> and <code>.bashrc</code> while sharing the root <code>AGENTS.md</code> one-file-per-commit GitHub rules.
          </p>
        </article>
      </div>
    </section>

    <section>
      <div class="section-head">
        <h2 class="section-title"><span>[03]</span> Johnny Decimal System Spine (<code>00</code>–<code>91</code>)</h2>
        <span class="section-meta">BRIDGED FROM TERMUX HOST INTO /ROOT</span>
      </div>

      <div class="jd-grid">
        ${JD_AREAS.map(
          (a) => `
          <div class="jd-card ${a.vault ? 'vault' : ''}">
            <div class="jd-code">
              <span>${a.code}</span>
              <span style="font-size: 0.7rem; opacity: 0.85;">[${a.tag}]</span>
            </div>
            <p class="jd-desc">${a.desc}</p>
          </div>
        `
        ).join('')}
      </div>
    </section>

    <footer class="footer">
      <span>MORPHEUS DOTFILES CONSTRUCT // Built with Vite &amp; Deployed via GitHub Actions</span>
      <span><a href="https://longdenjay00-sketch.github.io/longdenjay00-sketch/">← Back to Main Scriptorium Profile</a></span>
    </footer>
  </div>
`;

function renderRuntimePanel() {
  const data = RUNTIME_DATA[activePill];
  const panel = document.querySelector('#runtime-panel');
  const extraKeysHtml =
    activePill === 'blue'
      ? `
      <div class="extrakeys-wrap">
        <div class="extrakeys-label">TERMUX.PROPERTIES // TWO-ROW TMUX EXTRA-KEYS MATRIX (CTRL-B WORKFLOW)</div>
        <div class="key-row">
          <div class="key-cap">ESC</div>
          <div class="key-cap">/</div>
          <div class="key-cap">-</div>
          <div class="key-cap">HOME</div>
          <div class="key-cap">▲ UP</div>
          <div class="key-cap">END</div>
          <div class="key-cap">PGUP</div>
        </div>
        <div class="key-row">
          <div class="key-cap">TAB</div>
          <div class="key-cap">CTRL</div>
          <div class="key-cap">ALT</div>
          <div class="key-cap">◀ LEFT</div>
          <div class="key-cap">▼ DOWN</div>
          <div class="key-cap">▶ RIGHT</div>
          <div class="key-cap">PGDN</div>
        </div>
      </div>
    `
      : '';

  panel.innerHTML = `
    <div class="construct-tag">${data.badge}</div>
    <h3 style="font-family: var(--font-mono); font-size: 1.2rem; margin-bottom: 0.4rem;">${data.title}</h3>
    <p style="color: var(--text-sub); font-size: 0.9rem;">${data.summary}</p>
    <div class="runtime-grid">
      ${data.files
        .map(
          (f) => `
        <div class="file-card">
          <h4>${f.name}</h4>
          <div class="file-target">${f.target}</div>
          <p>${f.desc}</p>
        </div>
      `
        )
        .join('')}
    </div>
    ${extraKeysHtml}
  `;
}

function updateSimulator() {
  const mode = document.querySelector('input[name="sim-mode"]:checked').value;
  const dry = document.querySelector('#chk-dry').checked;
  const jd = document.querySelector('#chk-jd').checked;

  const flags = [];
  if (mode === 'termux') flags.push('--termux');
  if (mode === 'container') flags.push('--guest');
  if (dry) flags.push('--dry-run');
  if (jd) flags.push('--init-jd');

  const cmd = `./setup.sh${flags.length ? ' ' + flags.join(' ') : ''}`;
  document.querySelector('#sim-cmd').textContent = cmd;

  const out = document.querySelector('#sim-output');
  const tag = dry ? '(DRY-RUN)' : '(SAFE-APPLY)';

  if (mode === 'proot') {
    out.textContent = `[MORPHEUS] Detected Arch: aarch64 | OS: Kali GNU/Linux Rolling ${tag}
[MORPHEUS] Configuring Container / Kali Guest (Red Pill / The Construct)...
  ├─[SAFE-SKIP] Kali .zshrc is an active symlink (/root/.zshrc -> 55_INFRA/dotfiles/.zshrc); preserving intact.
  ├─[SAFE-SKIP] Kali .bashrc is an active symlink (/root/.bashrc -> 55_INFRA/dotfiles/.bashrc); preserving intact.
  ├─[SAFE-SKIP] Kali .profile is an active symlink (/root/.profile -> 55_INFRA/dotfiles/.profile); preserving intact.
  ├─[SAFE-SKIP] Portable .gitconfig is an active symlink (/root/.gitconfig -> 55_INFRA/dotfiles/.gitconfig); preserving intact.
[MORPHEUS] Verifying Johnny Decimal bridge (/data/data/com.termux/files/home)...
  ├─[SAFE-SKIP] Areas 00_INBOX .. 91_OBSIDIAN already linked in /root
[MORPHEUS] Loading Morpheus operator instructions for AI harnesses...
  ├─> Installed Morpheus AGENTS.md -> /root/AGENTS.md
  ├─> Installed Antigravity GEMINI.md -> /root/.gemini/GEMINI.md
  ├─> Installed Grok Morpheus.toml -> /root/.grok/personas/Morpheus.toml
└─> "Welcome to the real world."`;
  } else if (mode === 'container') {
    out.textContent = `[MORPHEUS] Detected Container Guest | Adapting nuances ${tag}
[MORPHEUS] Configuring Container / Kali Guest (Red Pill / The Construct)...
  ├─> Backed up existing .bashrc to ~/.dotfiles_backup/timestamp/.bashrc
  ├─> Installed Kali .zshrc (root㉿kali twoline prompt) -> ~/.zshrc
  ├─> Installed Kali .bashrc (root㉿kali twoline prompt) -> ~/.bashrc
  ├─> Installed Kali .profile -> ~/.profile
  ├─> Installed Portable .gitconfig (!gh auth git-credential) -> ~/.gitconfig
${jd ? '[MORPHEUS] Initialized local Johnny Decimal directories (00_INBOX..90_VAULT chmod 700)\n' : ''}[MORPHEUS] Loading Morpheus operator instructions for AI harnesses...
  ├─> Installed Morpheus AGENTS.md -> ~/AGENTS.md
  ├─> Installed Antigravity GEMINI.md -> ~/.gemini/GEMINI.md
  ├─> Installed Grok Morpheus.toml -> ~/.grok/personas/Morpheus.toml
└─> "Free your mind." (Run 'morpheus' in your shell for status)`;
  } else {
    out.textContent = `[MORPHEUS] Detected Android Termux Host (Blue Pill / Zion Gate) ${tag}
  ├─> Installed termux.properties (2-row tmux extra-keys) -> ~/.termux/termux.properties
  ├─> Installed Termux .bashrc (alias deb="proot-distro login debian") -> ~/.bashrc
  ├─> Installed Portable .gitconfig -> ~/.gitconfig
  ├─> Reloaded Termux settings via termux-reload-settings
└─> Type 'deb' or 'kali' to enter the Kali PRoot Construct.`;
  }
}

document.querySelector('#btn-red').addEventListener('click', () => {
  activePill = 'red';
  document.querySelector('#btn-red').classList.add('active');
  document.querySelector('#btn-blue').classList.remove('active');
  renderRuntimePanel();
});

document.querySelector('#btn-blue').addEventListener('click', () => {
  activePill = 'blue';
  document.querySelector('#btn-blue').classList.add('active');
  document.querySelector('#btn-red').classList.remove('active');
  renderRuntimePanel();
});

document.querySelectorAll('input[name="sim-mode"], #chk-dry, #chk-jd').forEach((el) => {
  el.addEventListener('change', updateSimulator);
});

document.querySelector('#copy-btn').addEventListener('click', (e) => {
  const cmd = document.querySelector('#sim-cmd').textContent;
  navigator.clipboard?.writeText(cmd);
  e.currentTarget.textContent = 'Copied!';
  setTimeout(() => {
    e.currentTarget.textContent = 'Copy';
  }, 1400);
});

renderRuntimePanel();
updateSimulator();
