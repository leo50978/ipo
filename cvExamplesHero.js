export default class CvExamplesHeroComponent {
  constructor(rootId) {
    this.root = document.getElementById(rootId);

    if (!this.root) {
      console.error(`CV Examples Hero root introuvable: ${rootId}`);
      return;
    }

    this.render();
  }

  render() {
    this.root.innerHTML = `
      <section class="w-full border-t border-white/60 bg-[linear-gradient(180deg,#f5fffa_0%,#fffaf0_100%)] py-16 sm:py-20">
        <div class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-14">
          <div class="order-2 text-center lg:order-1 lg:text-left">
            <h2 class="text-3xl font-extrabold leading-tight text-[#111827] sm:text-4xl lg:text-5xl">
              Au fur et à mesure que vous remplissez votre CV, accédez à des conseils d'experts en ressources humaines
            </h2>

            <p class="mt-6 text-base leading-relaxed text-[#4b5563] sm:text-lg">
              Notre outil vous accompagne en direct pendant la saisie avec des conseils professionnels pour chaque champ: profil, expériences, formations, compétences et centres d'intérêt.
            </p>

            <div class="mt-8">
              <button type="button" data-auth-mode="signup" class="w-full rounded-2xl bg-[var(--hp-blue-700)] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--hp-blue-900)] sm:w-auto">
                S'inscrire
              </button>
            </div>
          </div>

          <div class="order-1 flex justify-center lg:order-2 lg:justify-end">
            <img
              src="./nobg2.webp"
              alt="Exemples de CV"
              class="w-full max-w-[560px] object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    `;
  }
}

const AUTO_ROOT_ID = "sierra-cv-examples-hero-root";
if (document.getElementById(AUTO_ROOT_ID)) {
  new CvExamplesHeroComponent(AUTO_ROOT_ID);
}
