const STYLE_ID = "hp-image-scroll-motion-style";
const TARGET_SELECTOR = '[id^="sierra-cv-"] img, #sierra-hero-root .template-media';

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .hp-scroll-image {
      opacity: 0.02;
      translate: 0 26px;
      transition:
        opacity 760ms cubic-bezier(0.22, 0.61, 0.36, 1),
        translate 920ms cubic-bezier(0.2, 0.8, 0.22, 1);
      will-change: opacity, translate;
    }

    .hp-scroll-image.hp-scroll-image-in {
      opacity: 1;
      translate: 0 0;
    }
  `;
  document.head.appendChild(style);
}

function markImages() {
  return Array.from(document.querySelectorAll(TARGET_SELECTOR)).filter((img) => {
    if (!(img instanceof HTMLElement)) return false;
    if (img.dataset.scrollMotionReady === "1") return false;
    img.dataset.scrollMotionReady = "1";
    img.classList.add("hp-scroll-image");
    return true;
  });
}

function setupObserver() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    document.querySelectorAll(TARGET_SELECTOR).forEach((img) => {
      if (img instanceof HTMLElement) {
        img.style.opacity = "1";
        img.style.translate = "0 0";
      }
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        if (target instanceof HTMLElement) {
          target.classList.add("hp-scroll-image-in");
        }
        observer.unobserve(target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  const observeNewImages = () => {
    const fresh = markImages();
    fresh.forEach((img) => io.observe(img));
  };

  observeNewImages();

  const mo = new MutationObserver(() => {
    observeNewImages();
  });
  mo.observe(document.body, { childList: true, subtree: true });
}

injectStyles();
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupObserver, { once: true });
} else {
  setupObserver();
}
