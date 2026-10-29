(function () {
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");
  const themeLabel = document.getElementById("themeLabel");
  const themeMeta = document.getElementById("theme-color");

  function setTheme(name) {
    root.setAttribute("data-theme", name);
    if (themeLabel) themeLabel.textContent = name;
    if (themeMeta) themeMeta.setAttribute("content", name === "suede" ? "#18070b" : "#fbf8f3");
    try { localStorage.setItem("gourav-theme", name); } catch (_) {}
  }

  function toggleTheme() {
    const current = root.getAttribute("data-theme") || "suede";
    setTheme(current === "suede" ? "paper" : "suede");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }

  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "t" || e.key === "T") toggleTheme();
  });

  const notes = {
    "write-1": {
      category: "systems & devops · container architecture",
      title: "zero-trust multi-container reverse proxy topologies with Docker Compose & Nginx",
      meta: "oct, 2026 · Docker, Nginx 1.27, Node.js 24, Redis 8, MySQL 8",
      content: `
        <p>Deploying multi-tier web applications often leads to accidental exposure of internal database ports or unauthenticated service interfaces. In production-grade container engineering, the host should strictly expose a single ingress point.</p>
        <h4>Isolated Network Segmentation</h4>
        <p>In our architecture, the Nginx reverse proxy is the <em>only</em> service binding to host port <code>80</code>. All other services (React frontend, Node.js API, Redis cache, and MySQL) communicate exclusively over an isolated internal Docker network with strict DNS aliasing:</p>
        <pre>
                           ┌────────────────┐
                           │  Host Traffic  │
                           └───────┬────────┘
                                   │  :80 (only exposed port)
                           ┌───────▼────────┐
                           │ reverse-proxy  │  (Nginx 1.27)
                           └───┬────────┬───┘
                               │        │
               (path: "/")     │        │  (path: "/api/*")
           ┌───────────────────▼──┐  ┌──▼──────────────────┐
           │  taskflow-frontend   │  │    taskflow-api     │
           │  (React 19 / Vite)   │  │ (Node 24 / Express) │
           └──────────────────────┘  └──┬───────────────┬──┘
                                        │               │
                                ┌───────▼──────┐ ┌──────▼──────┐
                                │    redis     │ │    mysql    │
                                │ (cache :6379)│ │ (store:3306)│
                                └──────────────┘ └─────────────┘
        </pre>
        <h4>Healthcheck Orchestration</h4>
        <p>To eliminate race conditions on boot, services declare granular dependency healthchecks: the Express API container defers execution until MySQL passes <code>mysqladmin ping</code> and Redis responds to <code>redis-cli ping</code>.</p>
      `
    },
    "write-2": {
      category: "networking · privacy & protocol routing",
      title: "automating cross-platform SOCKS5 and PAC proxy rotation across browsers in Go",
      meta: "sep, 2026 · Go, SOCKS5, PAC daemon, Tor control protocol",
      content: `
        <p>Automating browser proxy routing across macOS, Linux, and Windows typically breaks due to conflicting registry entries, platform-specific environment variables, and erratic DNS leaks. This monograph details the engineering of a zero-friction local SOCKS5 proxy engine.</p>
        <h4>Dynamic PAC Daemon Architecture</h4>
        <p>Rather than relying on static system-wide proxy overrides, the gateway serves a dynamic, in-memory Proxy Auto-Configuration (PAC) script over a local HTTP socket:</p>
        <ul>
          <li><strong>Dynamic Circuit Renewal:</strong> Sends <code>AUTHENTICATE</code> and <code>SIGNAL NEWNYM</code> commands over the Tor control port whenever circuit latency degrades or egress blocks are detected.</li>
          <li><strong>Cross-Browser Integration:</strong> Dispatches platform-native hooks (<code>gsettings</code> on Linux, <code>networksetup</code> on Darwin, and wininet registry keys on Windows) without terminating running browser instances.</li>
          <li><strong>DNS Leak Prevention:</strong> Enforces SOCKS5h remote DNS resolution to ensure no unencrypted queries escape the encrypted tunnel.</li>
        </ul>
      `
    },
    "write-3": {
      category: "systems tooling · headless observability",
      title: "building a zero-bloat server telemetry CLI in C++ and Go for headless Linux",
      meta: "sep, 2026 · C++, Go, procfs, Linux kernel telemetry",
      content: `
        <p>Most server monitoring tools (e.g. Prometheus agents, Electron dashboards) consume excessive memory and CPU ticks simply observing the system they are meant to measure. We set out to build a sub-10MB telemetry monitor that operates directly from a headless TTY.</p>
        <h4>Direct Kernel Interface Sampling</h4>
        <p>By avoiding child process spawning (<code>fork</code>/<code>exec</code>) and directly parsing <code>/proc/stat</code>, <code>/proc/meminfo</code>, and <code>/proc/net/dev</code> via memory-mapped buffers, CPU consumption remains under 0.2% even at 100ms sample intervals.</p>
        <pre>
Kernel /proc buffers ──(mmap read)──► Lock-Free Ring Buffer ──► ANSI Delta Renderer
   [zero fork/exec]                        [C++20 atomics]           [VT100 escape codes]
        </pre>
        <p>The interface renders through raw ANSI escape codes with double-buffering, eliminating terminal flicker entirely over remote SSH connections.</p>
      `
    },
    "write-4": {
      category: "algorithmic finance · event-driven systems",
      title: "WebSocket market feeds and low-latency execution pipelines for algorithmic options",
      meta: "aug, 2026 · Python, C++ extensions, WebSockets, asyncio",
      content: `
        <p>High-frequency option pricing models require processing non-stop tick streams with predictable millisecond latency. Even microsecond stalls during volatile market open auctions can trigger severe execution slippage.</p>
        <h4>Pipeline Invariants & Circuit Breakers</h4>
        <ul>
          <li><strong>Zero-Copy Tick Parsing:</strong> Asynchronous WebSocket frame ingestion decoding raw binary payloads directly into structured memory structs without intermediary JSON overhead.</li>
          <li><strong>Hardware Timestamping:</strong> Correlating gateway arrival time against internal clock signals to compute feed delay in real time.</li>
          <li><strong>Automated Risk Invariants:</strong> Hard circuit breakers halt order routing instantly if delta exposure drifts beyond pre-set VaR (Value at Risk) bounds.</li>
        </ul>
      `
    },
    "build-1-spec": {
      category: "architecture specification · networking",
      title: "tor-rotator-stealth-gateway v3 · technical monograph",
      meta: "2026 · Go runtime · status: under work / in progress",
      content: `
        <p><code>tor-rotator-stealth-gateway</code> is an experimental local daemon that transforms standard applications and web browsers into rotating stealth network clients.</p>
        <p><em>Notice: This project is actively being developed locally and has not yet been pushed to public GitHub.</em></p>
        <h4>Core Architecture Highlights</h4>
        <ul>
          <li><strong>Automated IP Shuffling:</strong> Configurable interval or event-driven circuit renewal (e.g., auto-switch when receiving HTTP 403 or Cloudflare challenge pages).</li>
          <li><strong>PAC Engine:</strong> Generates dynamic proxy exclusion rules so intranet and localhost traffic never hit external relays.</li>
          <li><strong>TLS Fingerprint Masking:</strong> Integrates custom cipher suites to match common browser JA3/JA4 fingerprints.</li>
        </ul>
      `
    },
    "build-2-spec": {
      category: "architecture specification · devops & container systems",
      title: "taskflow — advanced multi-service docker architecture",
      meta: "2026 · Docker Compose, Node.js 24, Redis 8, MySQL 8, Nginx 1.27 · status: local build",
      content: `
        <p><code>TaskFlow</code> is a production-grade multi-service containerized architecture built to demonstrate zero-trust Docker networking, deterministic dependency healthchecks, and isolated ingress routing.</p>
        <p><em>Notice: This project is running and tested locally in Docker containers; git push to public GitHub is currently pending.</em></p>
        <h4>Service Breakdown</h4>
        <ul>
          <li><strong>Nginx Ingress (Port 80):</strong> The only port exposed to the host system. Routes frontend assets and proxies <code>/api/*</code> traffic to the backend cluster.</li>
          <li><strong>API Gateway (Node.js 24):</strong> Managed by <code>tini</code> process reaper for signal handling, utilizing <code>mysql2</code> connection pools and Valkey/Redis cache layers.</li>
          <li><strong>Database Tier (MySQL 8.0 &amp; Redis 8):</strong> Bound to private internal Docker bridges with healthcheck guards preventing race conditions on startup.</li>
          <li><strong>Frontend (React 19 &amp; Vite):</strong> Compiles to static assets served with HTTP caching headers.</li>
        </ul>
      `
    },
    "build-3-spec": {
      category: "runtime profile · systems telemetry",
      title: "headless server performance & telemetry CLI · runtime profile",
      meta: "2026 · C++ & Go · public repository on GitHub",
      content: `
        <p>Detailed performance benchmarks of the <code>Server-Stats</code> tool on low-spec AWS t4g.nano and bare-metal ARM64 boards:</p>
        <ul>
          <li><strong>Memory Footprint:</strong> 6.8 MB RSS under continuous 500ms sampling.</li>
          <li><strong>Binary Size:</strong> 4.1 MB static binary with zero external shared library dependencies.</li>
          <li><strong>Sampling Overhead:</strong> &lt; 0.15% single-core CPU utilization on 2.4GHz vCPU.</li>
          <li><strong>Repository:</strong> Available publicly at <a href="https://github.com/gouravroy27/Server-Stats" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">gouravroy27/Server-Stats</a>.</li>
        </ul>
      `
    },
    "sys-1": {
      category: "systems & architecture · enterprise proposal",
      title: "Intelligent Document Management & Automated Routing System (KMRL SIH Proposal)",
      meta: "enterprise architecture · OCR pipeline · role-based state machines · proposal status",
      content: `
        <p>A comprehensive technical proposal engineered for the Kochi Metro Rail Ltd (KMRL) Smart India Hackathon challenge, designed to digitize thousands of disparate physical and digital enterprise documents.</p>
        <h4>Architecture Highlights</h4>
        <ul>
          <li><strong>Multi-stage OCR &amp; Taxonomy Ingestion:</strong> High-throughput layout analysis pipeline extracting structured metadata from complex railway invoices and compliance reports.</li>
          <li><strong>Deterministic Workflow State Machines:</strong> Configurable role-based approval graphs with automated SLA escalations.</li>
          <li><strong>Cryptographic Audit Trails:</strong> SHA-256 chained transaction logs ensuring complete immutability for enterprise audit verification.</li>
        </ul>
      `
    },
    "sys-2": {
      category: "systems & architecture · distributed systems",
      title: "Local-First Distributed Storage & Peer Synchronization Runtimes",
      meta: "distributed systems · CRDT synchronization · peer networking · in research",
      content: `
        <p>Research and prototype implementation of a local-first peer-to-peer storage engine operating across decentralized developer workstations.</p>
        <ul>
          <li><strong>State Synchronization:</strong> Conflict-Free Replicated Data Types (CRDTs) enabling seamless multi-device state convergence without a central master node.</li>
          <li><strong>Cryptographic Authorization:</strong> Public-key Ed25519 signatures protecting all state mutations.</li>
          <li><strong>Zero Cloud Lock-in:</strong> Fully operational in air-gapped environments with opportunistic mesh networking.</li>
        </ul>
      `
    },
    "sys-3": {
      category: "systems & architecture · data pipelines",
      title: "Automated Media Processing, Metadata Generation & Scheduled Publishing Pipelines",
      meta: "media pipeline · FFmpeg · asynchronous orchestration · in progress",
      content: `
        <p>A resilient headless ingestion and publishing pipeline handling automated transcoding, audio waveform extraction, and cross-platform media dispatch.</p>
        <ul>
          <li><strong>Hardware-Accelerated Encoding:</strong> Dynamic fallback across NVENC, VAAPI, and CPU libx264 based on host capabilities.</li>
          <li><strong>Audio-to-Text Alignment:</strong> Automated transcription generating chapter timestamps and search indices.</li>
          <li><strong>Job Queue Resilience:</strong> Atomic file locks and SQLite task queues ensuring zero duplicate publishes upon process recovery.</li>
        </ul>
      `
    },
    "sys-4": {
      category: "systems & architecture · linux environments",
      title: "Custom Linux Desktop Environments, Shell Tooling & Dotfiles Architecture",
      meta: "linux systems · Wayland / X11 · shell optimization · active configuration",
      content: `
        <p>A modular, reproducibly configured Unix workstation ecosystem designed for extreme developer ergonomics and low latency.</p>
        <ul>
          <li><strong>Compositor Architecture:</strong> Custom Hyprland and i3wm configs with bespoke keybindings and window rules.</li>
          <li><strong>Sub-Millisecond Shell Startup:</strong> Heavily profiled Zsh / Bash initialization leveraging compiled Starship prompts and lazy plugin loading.</li>
          <li><strong>Declarative Dotfiles:</strong> Automated bootstrapping via symlink managers and Ansible playbooks for zero-friction laptop provisioning.</li>
        </ul>
      `
    }
  };

  const modal = document.getElementById("monographModal");
  const modalClose = document.getElementById("modalClose");
  const modalCat = document.getElementById("modalCategory");
  const modalTitle = document.getElementById("modalTitle");
  const modalMeta = document.getElementById("modalMeta");
  const modalBody = document.getElementById("modalBody");

  function openModal(id) {
    const item = notes[id];
    if (!item || !modal) return;
    modalCat.textContent = item.category;
    modalTitle.textContent = item.title;
    modalMeta.textContent = item.meta;
    modalBody.innerHTML = item.content;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-modal]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.getAttribute("data-modal")));
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeModal();
    }
  });
})();
