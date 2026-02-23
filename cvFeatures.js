export default class CvFeaturesComponent {
  constructor(rootId) {
    this.root = document.getElementById(rootId);

    if (!this.root) {
      console.error(`CV Features root introuvable: ${rootId}`);
      return;
    }

    this.render();
  }

  render() {
    this.root.innerHTML = `
      <section class="w-full border-t border-white/60 bg-[linear-gradient(180deg,#f0f8ff_0%,#f5fffa_100%)] py-20 sm:py-24">
        <div class="mx-auto max-w-7xl px-6">
          <h2 class="mx-auto mb-14 max-w-4xl text-center text-3xl font-extrabold leading-tight text-[#111827] sm:text-4xl">
            Un outil de création de CV avec toutes les fonctionnalités dont vous avez besoin
          </h2>

          <div class="grid grid-cols-1 gap-10 md:grid-cols-3">
            <article class="text-center">
              <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#dbeafe] text-[#2563eb]">
                <i class="fa-solid fa-pen-ruler text-lg"></i>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[#111827]">Conseils professionnels sur chaque champ du CV</h3>
              <p class="text-base leading-relaxed text-[#4b5563]">
                Chaque section est accompagnée de recommandations pratiques issues des bonnes pratiques RH.
              </p>
            </article>

            <article class="text-center">
              <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#dbeafe] text-[#2563eb]">
                <i class="fa-solid fa-file-lines text-lg"></i>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[#111827]">Saisie guidée pour un contenu plus pertinent</h3>
              <p class="text-base leading-relaxed text-[#4b5563]">
                Remplissez vos informations rapidement avec un parcours clair qui vous aide à mieux structurer vos expériences.
              </p>
            </article>

            <article class="text-center">
              <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#dbeafe] text-[#2563eb]">
                <i class="fa-solid fa-share-nodes text-lg"></i>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[#111827]">Téléchargez et commencez à postuler</h3>
              <p class="text-base leading-relaxed text-[#4b5563]">
                Finalisez votre CV et exportez-le en PDF pour candidater immédiatement.
              </p>
            </article>
          </div>
        </div>
      </section>
    `;
  }
}

const AUTO_ROOT_ID = "sierra-cv-features-root";
if (document.getElementById(AUTO_ROOT_ID)) {
  new CvFeaturesComponent(AUTO_ROOT_ID);
}
