export default class CvCtaFooterComponent {
  constructor(rootId) {
    this.root = document.getElementById(rootId);

    if (!this.root) {
      console.error(`CV CTA Footer root introuvable: ${rootId}`);
      return;
    }

    this.render();
  }

  render() {
    this.root.innerHTML = `
      <section class="w-full">
        <div class="border-t border-white/60 bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.08),transparent_40%),radial-gradient(circle_at_90%_0%,rgba(37,99,235,0.06),transparent_35%),linear-gradient(180deg,#f5f5f5_0%,#f8f8ff_100%)] py-20 sm:py-24">
          <div class="mx-auto max-w-4xl px-6 text-center">
            <h2 class="text-3xl font-extrabold leading-tight text-[#111827] sm:text-4xl">
              Créez votre CV gratuitement dès aujourd'hui !
            </h2>
            <p class="mx-auto mt-4 max-w-2xl text-base text-[#4b5563] sm:text-lg">
              Inscription gratuite. Aucune carte de crédit requise.
            </p>
            <div class="mt-8">
              <button class="w-full rounded-2xl border border-[var(--hp-blue-700)] bg-white px-8 py-3.5 text-sm font-semibold text-[var(--hp-blue-700)] transition duration-300 hover:bg-[var(--hp-blue-700)] hover:text-white sm:w-auto">
                Commencez dès maintenant
              </button>
            </div>
          </div>
        </div>

        <footer class="border-t border-[#e5e7eb] bg-[linear-gradient(180deg,#ffffff_0%,#f9fafb_100%)] py-14 sm:py-16">
          <div class="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p class="text-2xl font-extrabold tracking-tight text-[#111827]">hiprofile</p>
              <div class="mt-3 h-px w-20 bg-[#e5e7eb]"></div>
            </div>

            <div>
              <h3 class="mb-4 text-base font-bold text-[#111827]">Liens populaires</h3>
              <ul class="space-y-2.5 text-sm text-[#4b5563]">
                <li><a href="#" class="transition hover:text-[var(--hp-blue-700)]">Blog</a></li>
                <li><a href="#" class="transition hover:text-[var(--hp-blue-700)]">Créateur de CV</a></li>
                <li><a href="#" class="transition hover:text-[var(--hp-blue-700)]">Centre de connaissances</a></li>
                <li><a href="#" class="transition hover:text-[var(--hp-blue-700)]">Services</a></li>
              </ul>
            </div>

            <div>
              <h3 class="mb-4 text-base font-bold text-[#111827]">Ressources principales</h3>
              <ul class="space-y-2.5 text-sm text-[#4b5563]">
                <li><a href="#" class="transition hover:text-[var(--hp-blue-700)]">Créateur de CV par IA</a></li>
                <li><a href="#" class="transition hover:text-[var(--hp-blue-700)]">Exemples de CV</a></li>
                <li><a href="#" class="transition hover:text-[var(--hp-blue-700)]">Modèles de CV</a></li>
                <li><a href="#" class="transition hover:text-[var(--hp-blue-700)]">Compétences en matière de CV</a></li>
              </ul>
            </div>

            <div>
              <h3 class="mb-4 text-base font-bold text-[#111827]">Notre entreprise</h3>
              <ul class="space-y-2.5 text-sm text-[#4b5563]">
                <li><a href="#" class="transition hover:text-[var(--hp-blue-700)]">À propos de nous</a></li>
                <li><a href="#" class="transition hover:text-[var(--hp-blue-700)]">hiprofile pour les entreprises</a></li>
                <li><a href="#" class="transition hover:text-[var(--hp-blue-700)]">Programme d'affiliation</a></li>
                <li><a href="#" class="transition hover:text-[var(--hp-blue-700)]">Contactez-nous</a></li>
              </ul>
            </div>
          </div>
        </footer>
      </section>
    `;
  }
}

const AUTO_ROOT_ID = "sierra-cv-cta-footer-root";
if (document.getElementById(AUTO_ROOT_ID)) {
  new CvCtaFooterComponent(AUTO_ROOT_ID);
}
