export default class CvMainHeroComponent {
  constructor(rootId) {
    this.root = document.getElementById(rootId);

    if (!this.root) {
      console.error(`CV Main Hero root introuvable: ${rootId}`);
      return;
    }

    this.render();
  }

  render() {
    this.root.innerHTML = `
      <section class="w-full border-t border-white/60 bg-[linear-gradient(180deg,#fffaf0_0%,#fff5ee_100%)] py-16 sm:py-20">
        <div class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-14">
          <div class="order-2 text-center lg:order-1 lg:text-left">
            <h2 class="text-3xl font-extrabold leading-tight text-[#111827] sm:text-4xl lg:text-5xl">
              Le créateur de CV idéal pour le poste
            </h2>

            <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#4b5563] sm:text-lg lg:mx-0">
              Technologie, ingénierie, gestion ou marketing — Générateur de CV avec les modèles de CV adaptés pour mettre en valeur votre parcours professionnel.
            </p>

            <div class="mt-8">
              <button class="w-full rounded-2xl bg-[var(--hp-blue-700)] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--hp-blue-900)] sm:w-auto">
                Explorez tous les modèles de CV
              </button>
            </div>
          </div>

          <div class="order-1 flex justify-center lg:order-2 lg:justify-end">
            <img
              src="./nobg3.webp"
              alt="Modeles de CV"
              class="w-full max-w-[620px] object-contain drop-shadow-[0_18px_38px_rgba(15,42,94,0.12)]"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    `;
  }
}

const AUTO_ROOT_ID = "sierra-cv-main-hero-root";
if (document.getElementById(AUTO_ROOT_ID)) {
  new CvMainHeroComponent(AUTO_ROOT_ID);
}
