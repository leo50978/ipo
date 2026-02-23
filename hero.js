// Chemins des templates (3 templates seulement)
const HERO_IMAGES = [
  "./template1.jpg",
  "./template2.webp",
  "./template3.jpg"
];

export default class HeroComponent {
  constructor(rootId) {
    this.root = document.getElementById(rootId);
    if (!this.root) {
      console.error(`Hero root introuvable: ${rootId}`);
      return;
    }

    this.injectStyles();
    this.render();
    this.bindTilt();
  }

  injectStyles() {
    const styleId = 'hero-component-styles';
    if (document.getElementById(styleId)) return;

    const styles = `
      <style id="${styleId}">
        /* RESET & BASE */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* CONTAINER PRINCIPAL - MOBILE FIRST */
        .hero-section {
          width: 100%;
          min-height: 100vh;
          border-top: 1px solid #e3e4e7;
          background-color: #efeff1;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .hero-grid {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 2rem 1rem;
        }

        /* CONTENU TEXTE - MOBILE FIRST */
        .hero-content {
          width: 100%;
          text-align: center;
        }

        .hero-badge {
          font-size: 0.875rem;
          font-weight: 600;
          color: #48607a;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .hero-title {
          font-size: 1.875rem;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: #121821;
          margin-bottom: 0.75rem;
        }

        .hero-description {
          font-size: 1rem;
          line-height: 1.5;
          color: #4e6680;
          max-width: 90%;
          margin: 0 auto;
        }

        /* WRAPPER DES TEMPLATES - MOBILE FIRST */
        .templates-wrapper {
          width: 100%;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 220px;
          margin: 0.5rem 0;
        }

        .templates-container {
          position: relative;
          width: 100%;
          height: 260px;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1400px;
          transform-style: preserve-3d;
        }

        /* TEMPLATES - MOBILE FIRST */
        .template {
          position: absolute;
          border-radius: 0.75rem;
          overflow: hidden;
          border: 1px solid #d6e3ff;
          background: white;
          box-shadow: 0 10px 20px rgba(15, 42, 94, 0.15);
          transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 420ms ease, filter 320ms ease, opacity 320ms ease;
          left: 50%;
          top: 50%;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          will-change: transform;
          --tilt-x: 0deg;
          --tilt-y: 0deg;
          --lift-y: 0px;
          --glare-x: 50%;
          --glare-y: 50%;
          --glare-o: 0;
          --depth-z: 10px;
        }

        .template-media {
          width: 100%;
          height: 100%;
          background: #f7faff;
          padding: 0.5rem;
          object-fit: contain;
          transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), filter 320ms ease;
          transform: translateZ(var(--depth-z)) scale(1);
        }

        /* POSITIONS MOBILE - 3 templates BIEN VISIBLES */
        /* Template du milieu - plus grande */
        .template-center {
          width: 220px;
          height: 280px;
          transform: translate(-50%, -50%) perspective(1400px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) translateY(var(--lift-y)) scale(1);
          z-index: 3;
          box-shadow: 0 15px 30px rgba(15, 42, 94, 0.25);
        }

        .template-glare {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          background:
            radial-gradient(circle at var(--glare-x) var(--glare-y), rgba(255,255,255,0.44), transparent 40%),
            linear-gradient(120deg, rgba(255,255,255,0.12), transparent 55%);
          opacity: var(--glare-o);
          mix-blend-mode: screen;
          transition: opacity 220ms ease;
          transform: translateZ(26px);
        }

        /* Template de gauche - plus petite pour laisser de la place */
        .template-left {
          width: 136px;
          height: 172px;
          transform: translate(calc(-50% - 108px), -50%) scale(0.9);
          z-index: 2;
          opacity: 0.8;
        }

        /* Template de droite - plus petite pour laisser de la place */
        .template-right {
          width: 136px;
          height: 172px;
          transform: translate(calc(-50% + 108px), -50%) scale(0.9);
          z-index: 2;
          opacity: 0.8;
        }

        /* PETITS MOBILES (très petits écrans) */
        @media (max-width: 380px) {
          .template-center {
            width: 190px;
            height: 242px;
          }

          .template-left {
            width: 112px;
            height: 140px;
            transform: translate(calc(-50% - 88px), -50%) scale(0.9);
          }

          .template-right {
            width: 112px;
            height: 140px;
            transform: translate(calc(-50% + 88px), -50%) scale(0.9);
          }
        }

        /* TABLETTE (à partir de 480px) */
        @media (min-width: 480px) {
          .hero-grid {
            padding: 2.5rem 1.5rem;
            gap: 2.5rem;
          }

          .hero-title {
            font-size: 2.25rem;
          }

          .hero-description {
            font-size: 1.125rem;
            max-width: 80%;
          }

          .templates-wrapper {
            min-height: 320px;
          }

          .templates-container {
            height: 320px;
          }

          .template-center {
            width: 238px;
            height: 300px;
          }

          .template-left {
            width: 154px;
            height: 192px;
            transform: translate(calc(-50% - 126px), -50%) scale(0.9);
          }

          .template-right {
            width: 154px;
            height: 192px;
            transform: translate(calc(-50% + 126px), -50%) scale(0.9);
          }
        }

        /* TABLETTE LANDSCAPE / PETITS DESKTOPS (à partir de 768px) */
        @media (min-width: 768px) {
          .hero-grid {
            flex-direction: row;
            align-items: center;
            gap: 3rem;
            padding: 3rem 2rem;
          }

          .hero-content {
            text-align: left;
            flex: 1;
          }

          .hero-badge {
            font-size: 1rem;
            margin-bottom: 1rem;
          }

          .hero-title {
            font-size: 2.5rem;
            line-height: 1.1;
          }

          .hero-description {
            font-size: 1.25rem;
            max-width: 90%;
            margin: 0;
          }

          .templates-wrapper {
            flex: 1;
            min-height: 350px;
          }

          .templates-container {
            height: 350px;
          }

          .template-center {
            width: 232px;
            height: 288px;
          }

          .template-left {
            width: 176px;
            height: 220px;
            transform: translate(calc(-50% - 138px), -50%) scale(0.85);
            opacity: 0.9;
          }

          .template-right {
            width: 176px;
            height: 220px;
            transform: translate(calc(-50% + 138px), -50%) scale(0.85);
            opacity: 0.9;
          }
        }

        /* DESKTOP (à partir de 1024px) */
        @media (min-width: 1024px) {
          .hero-grid {
            gap: 4rem;
            padding: 4rem 2rem;
          }

          .hero-title {
            font-size: 3.5rem;
          }

          .hero-description {
            font-size: 1.5rem;
          }

          .templates-wrapper {
            min-height: 400px;
          }

          .templates-container {
            height: 400px;
          }

          .template-center {
            width: 270px;
            height: 338px;
          }

          .template-left {
            width: 196px;
            height: 246px;
            transform: translate(calc(-50% - 160px), -50%) scale(0.8);
          }

          .template-right {
            width: 196px;
            height: 246px;
            transform: translate(calc(-50% + 160px), -50%) scale(0.8);
          }
        }

        /* GRAND DESKTOP (à partir de 1280px) */
        @media (min-width: 1280px) {
          .hero-title {
            font-size: 3.75rem;
          }

          .template-center {
            width: 310px;
            height: 390px;
          }

          .template-left {
            width: 220px;
            height: 276px;
            transform: translate(calc(-50% - 190px), -50%) scale(0.75);
          }

          .template-right {
            width: 220px;
            height: 276px;
            transform: translate(calc(-50% + 190px), -50%) scale(0.75);
          }
        }

        /* ANIMATION D'ENTRÉE DOUCE */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -30%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        .template {
          animation: fadeIn 0.6s ease-out forwards;
        }

        /* HOVER EFFECT - template principal */
        .template:hover {
          z-index: 10;
          box-shadow: 0 30px 60px rgba(15, 42, 94, 0.28), 0 0 28px rgba(71, 135, 255, 0.18);
          opacity: 1;
          filter: saturate(1.05);
        }

        .template:hover .template-media {
          transform: translateZ(var(--depth-z)) scale(1.035);
          filter: contrast(1.03) saturate(1.04);
        }

        .template-center:hover {
          --lift-y: -6px;
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }

  render() {
    this.root.innerHTML = `
      <section class="hero-section">
        <div class="hero-grid">
          <div class="hero-content">
            <p class="hero-badge">
              Créateur de CV en ligne pour CV professionnels
            </p>
            <h1 class="hero-title">
              Créez un CV prêt à décrocher un emploi en quelques minutes
            </h1>
            <p class="hero-description">
              Le créateur de CV numéro 1 pour les CV professionnels, utilisé par des millions de personnes
            </p>
          </div>

          <div class="templates-wrapper">
            <div class="templates-container">
              <div class="template template-center">
                <img
                  src="${HERO_IMAGES[0]}"
                  alt="Template 1"
                  class="template-media"
                  loading="eager"
                />
                <div class="template-glare"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  bindTilt() {
    const card = this.root.querySelector(".template-center");
    const glare = this.root.querySelector(".template-glare");
    if (!card) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (event) => {
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const dx = x - 0.5;
      const dy = y - 0.5;
      const edge = Math.max(Math.abs(dx), Math.abs(dy)); // 0 centre -> 0.5 extremite
      const ry = dx * 32;
      const rx = -dy * 26;
      const depth = 12 + edge * 42; // plus proche des bords => plus de profondeur
      card.style.setProperty("--tilt-x", `${rx.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${ry.toFixed(2)}deg`);
      card.style.setProperty("--glare-x", `${(x * 100).toFixed(2)}%`);
      card.style.setProperty("--glare-y", `${(y * 100).toFixed(2)}%`);
      card.style.setProperty("--depth-z", `${depth.toFixed(2)}px`);
    };

    const onLeave = () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--lift-y", "0px");
      card.style.setProperty("--glare-o", "0");
      card.style.setProperty("--depth-z", "10px");
    };

    const onEnter = () => {
      card.style.setProperty("--lift-y", "-6px");
      card.style.setProperty("--glare-o", "1");
      card.style.setProperty("--depth-z", "16px");
    };

    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    card.addEventListener("pointerenter", onEnter);
  }
}
