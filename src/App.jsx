import React, { useState } from 'react';

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

export default function App() {
  const [activePill, setActivePill] = useState('red');
  const [simMode, setSimMode] = useState('proot');
  const [dryRun, setDryRun] = useState(false);
  const [initJd, setInitJd] = useState(false);
  const [copied, setCopied] = useState(false);

  const runtime = RUNTIME_DATA[activePill];

  const flags = [];
  if (simMode === 'termux') flags.push('--termux');
  if (simMode === 'container') flags.push('--guest');
  if (dryRun) flags.push('--dry-run');
  if (initJd) flags.push('--init-jd');
  const commandString = `./setup.sh${flags.length ? ' ' + flags.join(' ') : ''}`;
  const modeTag = dryRun ? '(DRY-RUN)' : '(SAFE-APPLY)';

  const getSimOutput = () => {
    if (simMode === 'proot') {
      return `[MORPHEUS] Detected Arch: aarch64 | OS: Kali GNU/Linux Rolling ${modeTag}
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
    }
    if (simMode === 'container') {
      return `[MORPHEUS] Detected Container Guest | Adapting nuances ${modeTag}
[MORPHEUS] Configuring Container / Kali Guest (Red Pill / The Construct)...
  ├─> Backed up existing .bashrc to ~/.dotfiles_backup/timestamp/.bashrc
  ├─> Installed Kali .zshrc (root㉿kali twoline prompt) -> ~/.zshrc
  ├─> Installed Kali .bashrc (root㉿kali twoline prompt) -> ~/.bashrc
  ├─> Installed Kali .profile -> ~/.profile
  ├─> Installed Portable .gitconfig (!gh auth git-credential) -> ~/.gitconfig
${initJd ? '[MORPHEUS] Initialized local Johnny Decimal directories (00_INBOX..90_VAULT chmod 700)\n' : ''}[MORPHEUS] Loading Morpheus operator instructions for AI harnesses...
  ├─> Installed Morpheus AGENTS.md -> ~/AGENTS.md
  ├─> Installed Antigravity GEMINI.md -> ~/.gemini/GEMINI.md
  ├─> Installed Grok Morpheus.toml -> ~/.grok/personas/Morpheus.toml
└─> "Free your mind." (Run 'morpheus' in your shell for status)`;
    }
    return `[MORPHEUS] Detected Android Termux Host (Blue Pill / Zion Gate) ${modeTag}
  ├─> Installed termux.properties (2-row tmux extra-keys) -> ~/.termux/termux.properties
  ├─> Installed Termux .bashrc (alias deb="proot-distro login debian") -> ~/.bashrc
  ├─> Installed Portable .gitconfig -> ~/.gitconfig
  ├─> Reloaded Termux settings via termux-reload-settings
└─> Type 'deb' or 'kali' to enter the Kali PRoot Construct.`;
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(commandString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="container">
      <header className="operator-bar">
        <div className="pulse-group">
          <span className="pulse-dot" />
          <span>NEBUCHADNEZZAR CONSTRUCT // REACT + VITE DOTFILES CONSOLE</span>
        </div>
        <div>
          HOST: <strong>BYYBUO SmartPad T10 (aarch64)</strong> &nbsp;|&nbsp; GUIDE:{' '}
          <strong>MORPHEUS (AGENTS.md)</strong>
        </div>
      </header>

      <div className="hero-banner-frame">
        <img
          src="./hero.png"
          alt="Morpheus Nebuchadnezzar Matrix Construct Console with Red and Blue Pill and Kali Terminal"
          className="hero-banner-img"
        />
        <div className="hero-banner-overlay">
          <span>GROK IMAGINE // NEBUCHADNEZZAR CONSTRUCT — RED PILL (KALI PROOT) VS BLUE PILL (TERMUX HOST)</span>
        </div>
      </div>

      <section className="hero">
        <div className="construct-card">
          <div>
            <div className="construct-tag">longdenjay00-sketch / dotfiles // Matrix React Edition</div>
            <h1 className="hero-title">Two Runtimes. One Tablet. Zero Broken Symlinks.</h1>
            <blockquote className="hero-quote">
              “You take the blue pill, you stay in Termux host. You take the red pill, you enter the Kali PRoot Construct—and I show you how deep the rabbit hole goes.”
            </blockquote>
            <p className="hero-desc">
              A portable, container-aware dotfiles &amp; AI harness bootstrap designed for our <code>aarch64</code> Android tablet (<strong>Termux</strong> + <strong>Debian PRoot</strong> + <strong>Kali GNU/Linux Rolling</strong>)—and engineered to clone cleanly into any fresh container while configuring <strong>Antigravity (<code>agy</code>)</strong>, <strong>Grok</strong>, and <strong>OpenCode</strong> to operate as <strong>Morpheus</strong>.
            </p>
          </div>

          <div>
            <div className="construct-tag" style={{ marginBottom: '0.4rem' }}>
              SELECT RUNTIME LAYER TO INSPECT:
            </div>
            <div className="pill-selector">
              <button
                className={`pill-btn red ${activePill === 'red' ? 'active' : ''}`}
                onClick={() => setActivePill('red')}
                type="button"
              >
                🔴 Red Pill: Kali Guest &amp; Containers
              </button>
              <button
                className={`pill-btn blue ${activePill === 'blue' ? 'active' : ''}`}
                onClick={() => setActivePill('blue')}
                type="button"
              >
                🔵 Blue Pill: Termux Android Host
              </button>
              <a
                className="pill-btn"
                href="https://github.com/longdenjay00-sketch/dotfiles"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repo ↗
              </a>
            </div>
          </div>
        </div>

        <div className="terminal-window">
          <div className="terminal-titlebar">
            <span>root㉿kali: ~/dotfiles (zsh)</span>
            <span>^P: toggle twoline/oneline</span>
          </div>
          <div className="terminal-content">
            <div>
              <span className="kali-prompt-blue">┌──(</span>
              <span className="kali-prompt-red">root㉿kali</span>
              <span className="kali-prompt-blue">)-[</span>
              <span className="kali-prompt-white">~/10_DEV/11_PROJECTS/repos/dotfiles</span>
              <span className="kali-prompt-blue">]</span>
            </div>
            <div>
              <span className="kali-prompt-blue">└─</span>
              <span className="kali-prompt-red">#</span>{' '}
              <span className="kali-prompt-white">morpheus</span>
            </div>
            <div className="morpheus-box">
              <div>
                <strong>┌──[ MORPHEUS // NEBUCHADNEZZAR CONSTRUCT ]</strong>
              </div>
              <div>│ Host Arch : aarch64 (BYYBUO SmartPad T10)</div>
              <div>│ Runtime   : Kali GNU/Linux Rolling (PRoot Guest)</div>
              <div>│ Harnesses : agy=ONLINE grok=ONLINE opencode=ONLINE</div>
              <div>│ Guide     : /root/AGENTS.md (Morpheus Active)</div>
              <div>
                <strong>└─&gt; &quot;Free your mind.&quot;</strong>
              </div>
            </div>
            <div style={{ marginTop: '0.9rem' }}>
              <span className="kali-prompt-blue">┌──(</span>
              <span className="kali-prompt-red">root㉿kali</span>
              <span className="kali-prompt-blue">)-[</span>
              <span className="kali-prompt-white">~</span>
              <span className="kali-prompt-blue">]</span>
            </div>
            <div>
              <span className="kali-prompt-blue">└─</span>
              <span className="kali-prompt-red">#</span>{' '}
              <span style={{ color: 'var(--matrix-green)' }}>./setup.sh --dry-run</span>
            </div>
            <div style={{ color: 'var(--text-sub)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              ✓ Active 55_INFRA symlinks preserved · ✓ Zero secrets tracked
            </div>
          </div>
        </div>
      </section>

      <section className="runtime-panel">
        <div className="construct-tag">{runtime.badge}</div>
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', marginBottom: '0.4rem' }}>
          {runtime.title}
        </h3>
        <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>{runtime.summary}</p>
        <div className="runtime-grid">
          {runtime.files.map((f) => (
            <div className="file-card" key={f.name}>
              <h4>{f.name}</h4>
              <div className="file-target">{f.target}</div>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        {activePill === 'blue' && (
          <div className="extrakeys-wrap">
            <div className="extrakeys-label">
              TERMUX.PROPERTIES // TWO-ROW TMUX EXTRA-KEYS MATRIX (CTRL-B WORKFLOW)
            </div>
            <div className="key-row">
              {['ESC', '/', '-', 'HOME', '▲ UP', 'END', 'PGUP'].map((k) => (
                <div className="key-cap" key={k}>
                  {k}
                </div>
              ))}
            </div>
            <div className="key-row">
              {['TAB', 'CTRL', 'ALT', '◀ LEFT', '▼ DOWN', '▶ RIGHT', 'PGDN'].map((k) => (
                <div className="key-cap" key={k}>
                  {k}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="section-head">
          <h2 className="section-title">
            <span>[01]</span> Interactive <code>setup.sh</code> Bootstrap Simulator
          </h2>
          <span className="section-meta">NON-DESTRUCTIVE CONTAINER ADAPTATION</span>
        </div>

        <div className="sim-grid">
          <div className="sim-controls">
            <div className="construct-tag">CONFIGURE BOOTSTRAP FLAGS</div>
            <div className="control-group">
              <label>
                <input
                  type="radio"
                  name="sim-mode"
                  value="proot"
                  checked={simMode === 'proot'}
                  onChange={() => setSimMode('proot')}
                />
                <span>Primary Tablet (Kali PRoot with active 55_INFRA symlinks)</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="sim-mode"
                  value="container"
                  checked={simMode === 'container'}
                  onChange={() => setSimMode('container')}
                />
                <span>Fresh Container Clone (Debian / Ubuntu / Docker / Alpine)</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="sim-mode"
                  value="termux"
                  checked={simMode === 'termux'}
                  onChange={() => setSimMode('termux')}
                />
                <span>
                  Termux Host Mode (<code>--termux</code>)
                </span>
              </label>
            </div>

            <div
              className="control-group"
              style={{ borderTop: '1px dashed var(--border-green)', paddingTop: '0.75rem' }}
            >
              <label>
                <input
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                />
                <span>
                  <code>--dry-run</code> (Preview actions without writing files)
                </span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={initJd}
                  onChange={(e) => setInitJd(e.target.checked)}
                />
                <span>
                  <code>--init-jd</code> (Create local Johnny Decimal folders if unmounted)
                </span>
              </label>
            </div>

            <div>
              <div className="extrakeys-label">GENERATED COMMAND:</div>
              <div className="cmd-copy-box">
                <code>{commandString}</code>
                <button className="copy-btn" onClick={handleCopy} type="button">
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <div className="terminal-window">
            <div className="terminal-titlebar">
              <span>setup.sh execution telemetry</span>
              <span>SAFE-SKIP SYMLINK GUARD</span>
            </div>
            <pre className="terminal-content" style={{ whiteSpace: 'pre-wrap' }}>
              {getSimOutput()}
            </pre>
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2 className="section-title">
            <span>[02]</span> Morpheus AI Harness Integration (<code>agents/</code>)
          </h2>
          <span className="section-meta">AGY · GROK · OPENCODE</span>
        </div>

        <div className="harness-grid">
          <article className="harness-card">
            <h3>
              Antigravity (<code>agy</code>)
            </h3>
            <div className="harness-path">Target: ~/.gemini/GEMINI.md &amp; ~/AGENTS.md</div>
            <p>
              Loads the <strong>Morpheus</strong> system operator persona, PRoot environmental awareness (no <code>systemd</code>/<code>journalctl</code>, one heavy process at a time, <code>uv</code> over raw <code>pip</code>), and strict Johnny Decimal filing discipline.
            </p>
          </article>

          <article className="harness-card">
            <h3>
              Grok CLI (<code>grok</code>)
            </h3>
            <div className="harness-path">
              Target: ~/.grok/personas/Morpheus.toml &amp; ~/.grok/GROK.md
            </div>
            <p>
              Installs the dedicated <code>Morpheus.toml</code> persona profile and workspace rules so Grok answers directly as the Kali guide and never duplicates the Johnny Decimal directory tree.
            </p>
          </article>

          <article className="harness-card">
            <h3>
              OpenCode (<code>opencode</code>)
            </h3>
            <div className="harness-path">Target: ~/AGENTS.md &amp; ~/.opencode/bin</div>
            <p>
              Automatically wires <code>~/.opencode/bin</code> into <code>PATH</code> across both <code>.zshrc</code> and <code>.bashrc</code> while sharing the root <code>AGENTS.md</code> one-file-per-commit GitHub rules.
            </p>
          </article>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2 className="section-title">
            <span>[03]</span> Johnny Decimal System Spine (<code>00</code>–<code>91</code>)
          </h2>
          <span className="section-meta">BRIDGED FROM TERMUX HOST INTO /ROOT</span>
        </div>

        <div className="jd-grid">
          {JD_AREAS.map((a) => (
            <div className={`jd-card ${a.vault ? 'vault' : ''}`} key={a.code}>
              <div className="jd-code">
                <span>{a.code}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>[{a.tag}]</span>
              </div>
              <p className="jd-desc">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>MORPHEUS DOTFILES CONSTRUCT // Built with React 19 + Vite &amp; Deployed via GitHub Actions</span>
        <span>
          <a href="https://longdenjay00-sketch.github.io/longdenjay00-sketch/">
            ← Back to Main Scriptorium Profile
          </a>
        </span>
      </footer>
    </div>
  );
}
