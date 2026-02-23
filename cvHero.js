export default class CvHeroComponent {
  constructor(rootId) {
    this.root = document.getElementById(rootId);

    if (!this.root) {
      console.error(`CV Hero root introuvable: ${rootId}`);
      return;
    }

    this.render();
  }

  render() {
    this.root.innerHTML = `
      <section class="w-full border-t border-white/60 bg-[linear-gradient(180deg,#f8f8ff_0%,#f0f8ff_100%)] py-16 sm:py-20">
        <div class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-14">
          <div class="flex justify-center lg:justify-start">
            <img
              src="./nobg.webp"
              alt="Illustration creation de CV"
              class="w-full max-w-[560px] object-contain"
              loading="lazy"
            />
          </div>

          <div class="text-center lg:text-left">
            <h2 class="text-3xl font-extrabold leading-tight text-[#111827] sm:text-4xl lg:text-5xl">
              Un CV professionnel guidé par des conseils RH concrets
            </h2>

            <p class="mt-6 text-base leading-relaxed text-[#4b5563] sm:text-lg">
              Renseignez votre CV étape par étape et profitez de conseils professionnels sur chaque champ pour formuler un contenu clair, crédible et orienté recrutement.
            </p>

            <div class="mt-8">
              <button type="button" data-auth-mode="signup" class="w-full rounded-2xl bg-[var(--hp-blue-700)] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--hp-blue-900)] sm:w-auto">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

const AUTO_ROOT_ID = "sierra-cv-hero-root";
if (document.getElementById(AUTO_ROOT_ID)) {
  new CvHeroComponent(AUTO_ROOT_ID);
}
