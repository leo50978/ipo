const SECTIONS_CONFIG = [
  {
    rootId: "sierra-hero-root",
    selector: "section",
    colors: ["#f5f5f5", "#f8f8ff", "#eef6ff"],
  },
  {
    rootId: "sierra-cv-hero-root",
    selector: "section",
    colors: ["#f8f8ff", "#f0f8ff", "#eef6ff"],
  },
  {
    rootId: "sierra-cv-features-root",
    selector: "section",
    colors: ["#f0f8ff", "#f5fffa", "#eef9f4"],
  },
  {
    rootId: "sierra-cv-examples-hero-root",
    selector: "section",
    colors: ["#f5fffa", "#fffaf0", "#fff7ea"],
  },
  {
    rootId: "sierra-cv-main-hero-root",
    selector: "section",
    colors: ["#fffaf0", "#fff5ee", "#fff1e9"],
  },
  {
    rootId: "sierra-cv-full-features-root",
    selector: "section",
    colors: ["#fff5ee", "#fdf5e6", "#fef8ec"],
  },
  {
    rootId: "sierra-cv-easy-hero-root",
    selector: "section",
    colors: ["#f0fff0", "#f0ffff", "#eaf9f6"],
  },
  {
    rootId: "sierra-cv-resources-hero-root",
    selector: "section",
    colors: ["#f0ffff", "#f8f8ff", "#edf5ff"],
  },
  {
    rootId: "sierra-cv-resources-hero-alt-root",
    selector: "section",
    colors: ["#fff0f5", "#fffaf0", "#fff3f8"],
  },
  {
    rootId: "sierra-cv-resources-hero-v2-root",
    selector: "section",
    colors: ["#f9f5ff", "#f5f5f5", "#eef1ff"],
  },
  {
    rootId: "sierra-cv-steps-faq-root",
    selector: "section",
    colors: ["#2a5bc7", "#174ea6", "#0f3f8d"],
    dark: true,
  },
  {
    rootId: "sierra-cv-cta-footer-root",
    selector: "section > div:first-child",
    colors: ["#f5f5f5", "#f8f8ff", "#eef5ff"],
  },
  {
    rootId: "sierra-cv-cta-footer-root",
    selector: "footer",
    colors: ["#ffffff", "#f9fafb", "#f4f7fc"],
  },
];
const PERF_MODE = true;

function injectStyles() {
  if (document.getElementById("hp-pro-bg-motion-style")) return;

  const style = document.createElement("style");
  style.id = "hp-pro-bg-motion-style";
  style.textContent = `
    .hp-pro-bg {
      position: relative;
      isolation: isolate;
      background: linear-gradient(
        135deg,
        var(--hp-bg-c1),
        var(--hp-bg-c2) 52%,
        var(--hp-bg-c3)
      ) !important;
      background-size: 220% 220%;
      animation: hpBgFlow 22s ease-in-out infinite;
      animation-play-state: paused;
    }

    .hp-pro-bg::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 12% 18%, rgba(255,255,255,0.26), transparent 34%),
        radial-gradient(circle at 84% 24%, rgba(37,99,235,0.09), transparent 40%),
        radial-gradient(circle at 65% 82%, rgba(255,255,255,0.2), transparent 36%);
      animation: hpBgPulse 18s ease-in-out infinite;
      animation-play-state: paused;
      z-index: -1;
    }

    .hp-pro-bg.hp-pro-bg-active {
      animation-play-state: running;
    }

    .hp-pro-bg.hp-pro-bg-active::before {
      animation-play-state: running;
    }

    .hp-bg-perf .hp-pro-bg,
    .hp-bg-perf .hp-pro-bg::before {
      animation: none !important;
      transition: none !important;
    }

    .hp-pro-bg.hp-pro-bg-dark::before {
      background:
        radial-gradient(circle at 12% 18%, rgba(255,255,255,0.13), transparent 34%),
        radial-gradient(circle at 84% 24%, rgba(173,206,255,0.16), transparent 40%),
        radial-gradient(circle at 65% 82%, rgba(255,255,255,0.1), transparent 36%);
    }

    @keyframes hpBgFlow {
      0% { background-position: 0% 35%; }
      50% { background-position: 100% 65%; }
      100% { background-position: 0% 35%; }
    }

    @keyframes hpBgPulse {
      0% { transform: translate3d(0,0,0) scale(1); opacity: 0.78; }
      50% { transform: translate3d(0,-10px,0) scale(1.02); opacity: 1; }
      100% { transform: translate3d(0,0,0) scale(1); opacity: 0.78; }
    }

    @media (prefers-reduced-motion: reduce) {
      .hp-pro-bg {
        animation: none !important;
      }
      .hp-pro-bg::before {
        animation: none !important;
      }
    }
  `;

  document.head.appendChild(style);
}

function styleSection(config) {
  const root = document.getElementById(config.rootId);
  if (!root) return;

  const section = root.querySelector(config.selector);
  if (!section || section.dataset.hpBgAnimated === "1") return;

  section.classList.add("hp-pro-bg");
  if (config.dark) section.classList.add("hp-pro-bg-dark");
  section.style.setProperty("--hp-bg-c1", config.colors[0]);
  section.style.setProperty("--hp-bg-c2", config.colors[1]);
  section.style.setProperty("--hp-bg-c3", config.colors[2]);
  section.dataset.hpBgAnimated = "1";
}

function applyAll() {
  SECTIONS_CONFIG.forEach(styleSection);
}

function boot() {
  if (PERF_MODE) {
    document.documentElement.classList.add("hp-bg-perf");
  }
  injectStyles();
  applyAll();

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("hp-pro-bg-active", entry.isIntersecting);
      });
    },
    { threshold: 0.05, rootMargin: "200px 0px 200px 0px" }
  );

  SECTIONS_CONFIG.forEach((config) => {
    const root = document.getElementById(config.rootId);
    const section = root?.querySelector(config.selector);
    if (section) sectionObserver.observe(section);
  });

  const observer = new MutationObserver(() => {
    applyAll();
    SECTIONS_CONFIG.forEach((config) => {
      const root = document.getElementById(config.rootId);
      const section = root?.querySelector(config.selector);
      if (section) sectionObserver.observe(section);
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
