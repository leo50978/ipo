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
              <h3 class="mb-3 text-xl font-bold text-[#111827]">Choisissez un modèle compatible avec les systèmes de suivi des candidatures (ATS).</h3>
              <p class="text-base leading-relaxed text-[#4b5563]">
Commencez par utiliser des modèles de CV conçus par des professionnels et optimisés pour passer les systèmes de suivi des candidatures.              </p>
            </article>

            <article class="text-center">
              <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#dbeafe] text-[#2563eb]">
                <i class="fa-solid fa-file-lines text-lg"></i>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[#111827]">Importez votre CV ou ajoutez du contenu et améliorez-le</h3>
              <p class="text-base leading-relaxed text-[#4b5563]">
Rédigez rapidement votre CV, optimisez vos puces grâce aux suggestions               </p>
            </article>

            <article class="text-center">
              <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#dbeafe] text-[#2563eb]">
                <i class="fa-solid fa-share-nodes text-lg"></i>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[#111827]">Téléchargez et commencez à postuler</h3>
              <p class="text-base leading-relaxed text-[#4b5563]">
Exportez ou partagez votre CV immédiatement pour postuler plus rapidement.              </p>
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
