const ROOT_IDS = [
  "sierra-hero-root",
  "sierra-cv-hero-root",
  "sierra-cv-features-root",
  "sierra-cv-examples-hero-root",
  "sierra-cv-main-hero-root",
  "sierra-cv-full-features-root",
  "sierra-cv-easy-hero-root",
  "sierra-cv-resources-hero-root",
  "sierra-cv-resources-hero-alt-root",
  "sierra-cv-resources-hero-v2-root",
  "sierra-cv-steps-faq-root",
  "sierra-cv-cta-footer-root",
];

const PERF_MODE = true;
const sectionState = new WeakMap();
const visibleSections = new Set();
let ticking = false;
let isMobileView = false;

function injectStyles() {
  if (document.getElementById("hp-scroll-scene-style")) return;

  const style = document.createElement("style");
  style.id = "hp-scroll-scene-style";
  style.textContent = `
    .hp-scroll-shell {
      position: relative;
      isolation: isolate;
      --hp-scroll: 0;
      --hp-enter: 0;
      --hp-tilt: 0deg;
      transform: translateZ(0);
      will-change: transform;
    }

    .hp-scroll-shell::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(circle at calc(12% + var(--hp-scroll) * 10%), 18%, rgba(255,255,255,0.12), transparent 32%),
        radial-gradient(circle at calc(85% - var(--hp-scroll) * 14%), 74%, rgba(37,99,235,0.07), transparent 36%);
      opacity: calc(0.45 + var(--hp-enter) * 0.35);
      transition: opacity 380ms ease;
    }

    .hp-scroll-shell > * {
      position: relative;
      z-index: 1;
    }

    .hp-anim-target {
      opacity: 0;
      transform: translate3d(0, 24px, 0) scale(0.985);
      will-change: transform, opacity, filter;
    }

    .hp-title-word {
      display: inline-block;
      opacity: 0;
      transform: translate3d(0, 18px, 0) rotateX(18deg);
      transform-origin: 50% 100%;
      will-change: transform, opacity;
    }

    .hp-perf .hp-anim-target,
    .hp-perf .hp-title-word {
      opacity: 1 !important;
      transform: none !important;
      filter: none !important;
      will-change: auto;
    }

    @media (prefers-reduced-motion: reduce) {
      .hp-scroll-shell::after {
        display: none;
      }
      .hp-anim-target,
      .hp-title-word {
        opacity: 1 !important;
        transform: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

function splitTitleWords(titleEl) {
  if (PERF_MODE) return;
  if (!titleEl || titleEl.dataset.hpSplit === "1") return;
  const text = titleEl.textContent || "";
  titleEl.textContent = "";

  const words = text.trim().split(/\s+/);
  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "hp-title-word";
    span.textContent = word + (i < words.length - 1 ? " " : "");
    titleEl.appendChild(span);
  });

  titleEl.dataset.hpSplit = "1";
}

function collectSections() {
  const sections = [];

  ROOT_IDS.forEach((id, idx) => {
    const root = document.getElementById(id);
    if (!root) return;

    const section = root.querySelector("section");
    if (!section) return;

    section.classList.add("hp-scroll-shell");
    section.dataset.hpVariant = String(idx % 4);

    const titles = section.querySelectorAll("h1, h2");
    titles.forEach(splitTitleWords);

    const targets = [...section.querySelectorAll("h3, h4, p, img, button, article")];
    targets.forEach((el) => el.classList.add("hp-anim-target"));

    sectionState.set(section, {
      variant: idx % 4,
      animating: false,
      playedOnce: false,
    });

    sections.push(section);
  });

  return sections;
}

function resetSection(section) {
  const words = section.querySelectorAll(".hp-title-word");
  const targets = section.querySelectorAll(".hp-anim-target");

  words.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translate3d(0,18px,0) rotateX(18deg)";
  });

  targets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translate3d(0,24px,0) scale(0.985)";
  });

  section.style.setProperty("--hp-enter", "0");
}

function playSection(section) {
  const state = sectionState.get(section);
  if (!state || state.animating) return;
  if (typeof window.anime !== "function") return;

  const words = section.querySelectorAll(".hp-title-word");
  const targets = section.querySelectorAll(".hp-anim-target");
  const variant = state.variant;
  state.animating = true;

  window.anime({
    targets: section,
    "--hp-enter": [0, 1],
    duration: 700,
    easing: "easeOutQuad",
  });

  if (!PERF_MODE) {
    window.anime({
      targets: words,
      opacity: [0, 1],
      translateY: [18, 0],
      rotateX: [18, 0],
      duration: 780,
      delay: window.anime.stagger(34),
      easing: "easeOutCubic",
    });
  }

  const variantMap = [
    { x: [0, 0], y: [26, 0], rot: [0, 0] },
    { x: [-22, 0], y: [16, 0], rot: [-1.2, 0] },
    { x: [22, 0], y: [16, 0], rot: [1.2, 0] },
    { x: [0, 0], y: [32, 0], rot: [0.8, 0] },
  ][variant];

  window.anime({
    targets: targets,
    opacity: [0, 1],
    translateX: variantMap.x,
    translateY: variantMap.y,
    rotateZ: variantMap.rot,
    scale: [0.985, 1],
    duration: PERF_MODE ? 520 : 720,
    delay: window.anime.stagger(30, { start: 70 }),
    easing: PERF_MODE ? "easeOutQuad" : "easeOutExpo",
    complete: () => {
      state.animating = false;
      state.playedOnce = true;
    },
  });
}

function updateParallax() {
  ticking = false;
  if (PERF_MODE || isMobileView || visibleSections.size === 0) return;
  const vh = window.innerHeight || 1;

  visibleSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
    const tilt = ((progress - 0.5) * 2.2).toFixed(2);

    section.style.setProperty("--hp-scroll", String(progress.toFixed(4)));
    section.style.setProperty("--hp-tilt", `${tilt}deg`);
  });
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateParallax);
}

function boot() {
  injectStyles();
  if (PERF_MODE) {
    document.documentElement.classList.add("hp-perf");
  }
  isMobileView = window.innerWidth < 768;
  const sections = collectSections();

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const section = entry.target;
        const state = sectionState.get(section);
        if (!state) return;

        if (entry.isIntersecting) {
          visibleSections.add(section);
          if (PERF_MODE && state.playedOnce) {
            section.style.setProperty("--hp-enter", "1");
          } else {
            resetSection(section);
            playSection(section);
          }
        } else {
          visibleSections.delete(section);
          state.animating = false;
        }
      });
      onScroll();
    },
    { threshold: 0.28, rootMargin: "0px 0px -10% 0px" }
  );

  sections.forEach((section) => io.observe(section));
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    isMobileView = window.innerWidth < 768;
    onScroll();
  }, { passive: true });
  onScroll();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
