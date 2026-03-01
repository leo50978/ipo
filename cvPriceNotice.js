export default class CvPriceNoticeComponent {
  constructor(rootId) {
    this.root = document.getElementById(rootId);
    this.visibilityObserver = null;

    if (!this.root) {
      console.error(`CV Price Notice root introuvable: ${rootId}`);
      return;
    }

    this.render();
  }

  render() {
    this.root.innerHTML = `
      <section class="w-full px-4 py-10 md:px-6 md:py-12">
        <style>
          .hp-price-notice {
            position: relative;
            overflow: hidden;
            border-radius: 2.25rem;
            border: 1px solid rgba(213, 227, 255, 0.9);
            background:
              radial-gradient(circle at 88% 12%, rgba(43, 108, 255, 0.2), transparent 24%),
              radial-gradient(circle at 8% 88%, rgba(14, 165, 233, 0.12), transparent 26%),
              linear-gradient(145deg, #ffffff 0%, #f6f9ff 52%, #eef4ff 100%);
            box-shadow:
              0 32px 80px -40px rgba(15, 31, 61, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
          }

          .hp-price-notice::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
              linear-gradient(to right, rgba(255, 255, 255, 0.52) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.52) 1px, transparent 1px);
            background-size: 54px 54px;
            opacity: 0.36;
            pointer-events: none;
          }

          .hp-price-stage {
            animation: hpPriceFloat 9s ease-in-out infinite;
          }

          .hp-price-copy {
            animation: hpPriceFadeUp 0.8s ease both;
          }

          .hp-price-media {
            position: relative;
            min-height: 320px;
            border-radius: 2rem;
            padding: 1rem;
            background:
              linear-gradient(160deg, rgba(15, 23, 42, 0.96) 0%, rgba(15, 23, 42, 0.84) 100%);
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.08),
              0 24px 64px -36px rgba(15, 23, 42, 0.6);
            animation: hpPriceFadeUp 0.95s ease 0.08s both;
            transition: transform 240ms ease, box-shadow 240ms ease;
            will-change: transform;
          }

          .hp-price-media::before,
          .hp-price-media::after {
            content: "";
            position: absolute;
            border-radius: 999px;
            filter: blur(18px);
            opacity: 0.72;
            pointer-events: none;
          }

          .hp-price-media::before {
            width: 110px;
            height: 110px;
            top: -18px;
            right: -12px;
            background: rgba(56, 189, 248, 0.28);
            animation: hpPricePulse 4.4s ease-in-out infinite;
          }

          .hp-price-media::after {
            width: 130px;
            height: 130px;
            left: -24px;
            bottom: -24px;
            background: rgba(37, 99, 235, 0.24);
            animation: hpPricePulse 5.2s ease-in-out infinite reverse;
          }

          .hp-price-frame {
            position: relative;
            height: 100%;
            min-height: 288px;
            border-radius: 1.5rem;
            overflow: hidden;
            border: 1px solid rgba(148, 163, 184, 0.18);
            background:
              radial-gradient(circle at top left, rgba(96, 165, 250, 0.22), transparent 26%),
              linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.68) 100%);
          }

          .hp-price-frame::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
              linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
            background-size: 26px 26px;
            opacity: 0.7;
            pointer-events: none;
            z-index: 2;
          }

          .hp-price-frame::after {
            content: "";
            position: absolute;
            inset: -32% 18% auto;
            height: 46%;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.28) 0%, transparent 100%);
            transform: rotate(8deg);
            opacity: 0.4;
            pointer-events: none;
            z-index: 3;
          }

          .hp-price-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transform: scale(1.06);
            filter: saturate(1.05) contrast(1.02);
            animation: hpVideoDrift 14s ease-in-out infinite alternate;
            background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
          }

          .hp-price-overlay {
            position: absolute;
            inset: 0;
            z-index: 4;
            pointer-events: none;
            background:
              linear-gradient(180deg, rgba(15, 23, 42, 0.05) 0%, rgba(15, 23, 42, 0.42) 100%);
          }

          .hp-price-overlay::before {
            content: "";
            position: absolute;
            inset: -55% 0 55%;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), transparent);
            animation: hpScan 4.8s linear infinite;
          }

          .hp-price-spark {
            position: absolute;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.82);
            box-shadow: 0 0 14px rgba(255, 255, 255, 0.42);
            z-index: 5;
            animation: hpSpark 4.2s ease-in-out infinite;
            pointer-events: none;
          }

          .hp-price-spark.a {
            top: 18%;
            left: 16%;
            width: 8px;
            height: 8px;
          }

          .hp-price-spark.b {
            top: 42%;
            right: 18%;
            width: 6px;
            height: 6px;
            animation-delay: 0.9s;
          }

          .hp-price-spark.c {
            bottom: 16%;
            left: 26%;
            width: 7px;
            height: 7px;
            animation-delay: 1.6s;
          }

          .hp-price-bars {
            position: absolute;
            inset: auto 14px 14px 14px;
            z-index: 5;
            display: grid;
            gap: 0.55rem;
          }

          .hp-price-bars span {
            display: block;
            height: 6px;
            border-radius: 999px;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.94), rgba(147, 197, 253, 0.75));
            transform-origin: left center;
            animation: hpBarPulse 3.2s ease-in-out infinite;
          }

          .hp-price-bars span:nth-child(1) { width: 42%; }
          .hp-price-bars span:nth-child(2) { width: 68%; animation-delay: 0.4s; }
          .hp-price-bars span:nth-child(3) { width: 56%; animation-delay: 0.9s; }

          @keyframes hpPriceFadeUp {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes hpPriceFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }

          @keyframes hpPricePulse {
            0%, 100% { transform: scale(1); opacity: 0.62; }
            50% { transform: scale(1.08); opacity: 0.92; }
          }

          @keyframes hpVideoDrift {
            0% { transform: scale(1.06) translate3d(0, 0, 0); }
            100% { transform: scale(1.14) translate3d(-1.5%, -1%, 0); }
          }

          @keyframes hpScan {
            0% { transform: translateY(-110%); }
            100% { transform: translateY(260%); }
          }

          @keyframes hpSpark {
            0%, 100% { transform: scale(0.88); opacity: 0.4; }
            50% { transform: scale(1.3); opacity: 1; }
          }

          @keyframes hpBarPulse {
            0%, 100% { transform: scaleX(0.92); opacity: 0.74; }
            50% { transform: scaleX(1.04); opacity: 1; }
          }
        </style>

        <div class="hp-price-notice mx-auto max-w-6xl">
          <div class="hp-price-stage grid gap-8 px-6 py-7 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:py-8 xl:px-10 xl:py-10">
            <div class="hp-price-copy">
              <div class="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur">
                <span class="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(74,222,128,0.16)]"></span>
                <span class="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--hp-blue-700)]">Tarif du service</span>
              </div>

              <h2 class="mt-5 text-3xl font-extrabold leading-[1.05] text-[var(--hp-blue-900)] md:text-4xl xl:text-[3.35rem]">
                500 HTG pour un CV professionnel, avec un parcours clair du builder au PDF.
              </h2>

              <p class="mt-5 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                Le tarif est fixe. Vous construisez votre CV librement, puis un depot unique de 500 GDES debloque le telechargement final quand vous etes pret a exporter.
              </p>

              <div class="mt-7 grid gap-3 sm:grid-cols-2">
                <div class="rounded-[1.6rem] border border-white/80 bg-white/88 px-5 py-4 shadow-sm backdrop-blur">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Prix unique</p>
                  <p class="mt-2 text-3xl font-extrabold text-[var(--hp-blue-900)]">500 HTG</p>
                  <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <span class="block h-full w-[72%] rounded-full bg-[linear-gradient(90deg,#2563eb_0%,#38bdf8_100%)]"></span>
                  </div>
                </div>
                <div class="rounded-[1.6rem] border border-white/70 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
                  <div class="grid gap-2">
                    <span class="h-2 rounded-full bg-slate-200"></span>
                    <span class="h-2 w-4/5 rounded-full bg-slate-200"></span>
                    <span class="h-2 w-3/5 rounded-full bg-slate-200"></span>
                  </div>
                  <div class="mt-5 flex items-center gap-2">
                    <span class="inline-block h-2.5 w-2.5 rounded-full bg-sky-500"></span>
                    <span class="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
                    <span class="inline-block h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
                  </div>
                </div>
              </div>

              <div class="mt-7 flex flex-wrap gap-3">
                <a href="./tarifs.html" class="inline-flex items-center justify-center rounded-2xl bg-[var(--hp-blue-700)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--hp-blue-900)]">
                  Voir les tarifs
                </a>
                <button type="button" data-cv-start="1" class="inline-flex items-center justify-center rounded-2xl border border-[var(--hp-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--hp-blue-900)] transition hover:border-[var(--hp-blue-500)] hover:bg-[#f6f9ff]">
                  Commencer mon CV
                </button>
              </div>
            </div>

            <div class="hp-price-media">
              <div class="hp-price-frame">
                <video
                  class="hp-price-video"
                  autoplay
                  muted
                  loop
                  playsinline
                  preload="metadata"
                  poster="./assets/images/curriculum-vitae.png"
                >
                  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                </video>
                <div class="hp-price-overlay"></div>
                <span class="hp-price-spark a"></span>
                <span class="hp-price-spark b"></span>
                <span class="hp-price-spark c"></span>
                <div class="hp-price-bars" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    this.setupMotion();
  }

  setupMotion() {
    const stage = this.root.querySelector(".hp-price-stage");
    const media = this.root.querySelector(".hp-price-media");
    const video = this.root.querySelector(".hp-price-video");

    if (!(stage instanceof HTMLElement) || !(media instanceof HTMLElement)) {
      return;
    }

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!prefersReducedMotion && canHover) {
      stage.addEventListener("pointermove", (event) => {
        const bounds = stage.getBoundingClientRect();
        const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
        media.style.transform = `translate3d(${pointerX * 14}px, ${pointerY * 10}px, 0) scale(1.012)`;
        media.style.boxShadow =
          "inset 0 1px 0 rgba(255,255,255,0.08), 0 28px 84px -34px rgba(15,23,42,0.72)";
      });

      stage.addEventListener("pointerleave", () => {
        media.style.transform = "";
        media.style.boxShadow = "";
      });
    }

    if (!(video instanceof HTMLVideoElement) || prefersReducedMotion) {
      return;
    }

    const safePlay = () => {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    };

    if ("IntersectionObserver" in window) {
      this.visibilityObserver?.disconnect();
      this.visibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              safePlay();
              return;
            }
            video.pause();
          });
        },
        { threshold: 0.35 }
      );
      this.visibilityObserver.observe(video);
      return;
    }

    safePlay();
  }
}

const AUTO_ROOT_ID = "sierra-cv-price-notice-root";
if (typeof document !== "undefined" && document.getElementById(AUTO_ROOT_ID)) {
  new CvPriceNoticeComponent(AUTO_ROOT_ID);
}
