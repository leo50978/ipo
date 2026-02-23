export default class CvFullFeaturesComponent {
  constructor(rootId) {
    this.root = document.getElementById(rootId);

    if (!this.root) {
      console.error(`CV Full Features root introuvable: ${rootId}`);
      return;
    }

    this.render();
  }

  render() {
    this.root.innerHTML = `
      <section class="w-full border-t border-white/60 bg-[linear-gradient(180deg,#fff5ee_0%,#fdf5e6_100%)] py-20 sm:py-24">
        <div class="mx-auto max-w-7xl px-6">
          <h2 class="text-center text-3xl font-extrabold leading-tight text-[#111827] sm:text-4xl">
            Créateur de CV professionnel
          </h2>
          <p class="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-[#4b5563] sm:text-lg">
            hiprofile vous offre tout ce dont vous avez besoin pour créer un CV en ligne et franchir une nouvelle étape dans votre carrière.
          </p>

          <div class="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <article class="text-center">
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dbeafe] text-[#2563eb]">
                <i class="fa-solid fa-pen-to-square text-lg"></i>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[#111827]">Créateur de CV</h3>
              <p class="text-base leading-relaxed text-[#4b5563]">
                Concevez rapidement des CV modernes grâce à un éditeur intuitif et structuré.
              </p>
            </article>

            <article class="text-center">
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dbeafe] text-[#2563eb]">
                <i class="fa-solid fa-share-from-square text-lg"></i>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[#111827]">Partager et télécharger</h3>
              <p class="text-base leading-relaxed text-[#4b5563]">
                Exportez en PDF ou partagez votre CV en ligne en quelques secondes.
              </p>
            </article>

            <article class="text-center">
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dbeafe] text-[#2563eb]">
                <i class="fa-solid fa-layer-group text-lg"></i>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[#111827]">Gérer plusieurs CV</h3>
              <p class="text-base leading-relaxed text-[#4b5563]">
                Créez plusieurs versions de CV adaptées à chaque poste ciblé.
              </p>
            </article>

            <article class="text-center">
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dbeafe] text-[#2563eb]">
                <i class="fa-solid fa-chart-line text-lg"></i>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[#111827]">Suivez vos résultats</h3>
              <p class="text-base leading-relaxed text-[#4b5563]">
                Analysez les performances de vos candidatures et optimisez votre profil.
              </p>
            </article>

            <article class="text-center">
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dbeafe] text-[#2563eb]">
                <i class="fa-solid fa-comments text-lg"></i>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[#111827]">Obtenir des commentaires</h3>
              <p class="text-base leading-relaxed text-[#4b5563]">
                Recevez des retours pertinents pour améliorer la qualité de votre CV.
              </p>
            </article>

            <article class="text-center">
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dbeafe] text-[#2563eb]">
                <i class="fa-solid fa-shield-halved text-lg"></i>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[#111827]">Contrôle des données et de la confidentialité</h3>
              <p class="text-base leading-relaxed text-[#4b5563]">
                Gardez la maîtrise de vos informations avec des paramètres de confidentialité clairs.
              </p>
            </article>
          </div>
        </div>
      </section>
    `;
  }
}

const AUTO_ROOT_ID = "sierra-cv-full-features-root";
if (document.getElementById(AUTO_ROOT_ID)) {
  new CvFullFeaturesComponent(AUTO_ROOT_ID);
}
