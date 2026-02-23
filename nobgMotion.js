const images = new Set();
const visibleImages = new Set();
const stateByImage = new WeakMap();
let rafId = 0;
let visibilityObserver = null;
const PERF_MODE = true;

function startsWithNobg(img) {
  try {
    const url = new URL(img.getAttribute("src") || "", window.location.href);
    const file = url.pathname.split("/").pop()?.toLowerCase() || "";
    return file.startsWith("nobg");
  } catch {
    return false;
  }
}

function registerImage(img) {
  if (!(img instanceof HTMLImageElement)) return;
  if (!startsWithNobg(img)) return;
  if (stateByImage.has(img)) return;

  img.classList.add("hp-nobg-motion");

  const state = {
    px: 0,
    py: 0,
    tx: 0,
    ty: 0,
    rx: 0,
    ry: 0,
    hover: false,
    phase: Math.random() * Math.PI * 2,
  };

  const onPointerMove = (event) => {
    const rect = img.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    state.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    state.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  img.addEventListener("pointerenter", () => {
    state.hover = true;
  });
  img.addEventListener("pointermove", onPointerMove);
  img.addEventListener("pointerleave", () => {
    state.hover = false;
    state.tx = 0;
    state.ty = 0;
  });

  stateByImage.set(img, state);
  images.add(img);
  visibilityObserver?.observe(img);
}

function scanImages() {
  document.querySelectorAll("img").forEach((img) => registerImage(img));
}

function tick(time) {
  if (PERF_MODE) return;
  const mobile = window.innerWidth < 768;
  const maxRotate = mobile ? 3 : 7;
  const sideShift = mobile ? 4 : 10;
  const liftShift = mobile ? 3 : 7;
  const lerp = 0.08;

  visibleImages.forEach((img) => {
    const state = stateByImage.get(img);
    if (!state) return;

    state.px += (state.tx - state.px) * lerp;
    state.py += (state.ty - state.py) * lerp;

    state.ry += ((state.px * maxRotate) - state.ry) * lerp;
    state.rx += ((-state.py * maxRotate * 0.85) - state.rx) * lerp;

    const floatY = Math.sin(time * 0.0011 + state.phase) * (mobile ? 4 : 7);
    const driftX = state.px * sideShift;
    const driftY = state.py * liftShift;
    const scale = state.hover ? 1.012 : 1;

    img.style.transform = `translate3d(${driftX.toFixed(2)}px, ${(floatY + driftY).toFixed(2)}px, 0px) rotateX(${state.rx.toFixed(2)}deg) rotateY(${state.ry.toFixed(2)}deg) scale(${scale})`;
  });

  rafId = window.requestAnimationFrame(tick);
}

function ensureStyles() {
  if (document.getElementById("hp-nobg-motion-style")) return;
  const style = document.createElement("style");
  style.id = "hp-nobg-motion-style";
  style.textContent = `
    .hp-nobg-motion {
      transform-origin: center center;
      transform-style: preserve-3d;
      will-change: transform;
      backface-visibility: hidden;
      filter: drop-shadow(0 14px 28px rgba(10,44,110,0.18));
      transition: filter 220ms ease-out, transform 220ms ease-out;
      pointer-events: auto;
    }
    .hp-nobg-motion:hover {
      filter: drop-shadow(0 20px 34px rgba(10,44,110,0.24)) drop-shadow(0 0 18px rgba(86,151,255,0.18));
    }
    @media (prefers-reduced-motion: reduce) {
      .hp-nobg-motion {
        transform: none !important;
        transition: filter 160ms ease-out;
      }
    }
  `;
  document.head.appendChild(style);
}

function setupVisibilityObserver() {
  visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleImages.add(entry.target);
        } else {
          visibleImages.delete(entry.target);
        }
      });
    },
    { root: null, rootMargin: "120px", threshold: 0.01 }
  );
}

function boot() {
  ensureStyles();
  setupVisibilityObserver();
  scanImages();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches?.("img")) registerImage(node);
        node.querySelectorAll?.("img").forEach((img) => registerImage(img));
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  if (!rafId) {
    if (!PERF_MODE) {
      rafId = window.requestAnimationFrame(tick);
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
