export default class CvStepsFaqComponent {
  constructor(rootId) {
    this.root = document.getElementById(rootId);

    if (!this.root) {
      console.error(`CV Steps FAQ root introuvable: ${rootId}`);
      return;
    }

    this.render();
  }

  render() {
    this.root.innerHTML = `
      <section class="w-full border-t border-white/20 bg-[linear-gradient(180deg,#2a5bc7_0%,#174ea6_100%)] py-20 sm:py-24">
        <div class="mx-auto max-w-7xl px-6">
          <h2 class="text-center text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Créez votre CV en ligne en 3 étapes faciles
          </h2>

          <div class="mt-14 grid grid-cols-1 gap-12 md:grid-cols-3">
            <article class="text-center">
              <div class="mx-auto mb-5 text-4xl text-white sm:text-5xl">
                <i class="fa-regular fa-file-lines"></i>
              </div>
              <h3 class="text-xl font-bold text-white">Choisissez le modèle de votre CV</h3>
            </article>

            <article class="text-center">
              <div class="mx-auto mb-5 text-4xl text-white sm:text-5xl">
                <i class="fa-solid fa-sliders"></i>
              </div>
              <h3 class="text-xl font-bold text-white">Personnalisez votre CV</h3>
            </article>

            <article class="text-center">
              <div class="mx-auto mb-5 text-4xl text-white sm:text-5xl">
                <i class="fa-solid fa-chart-line"></i>
              </div>
              <h3 class="text-xl font-bold text-white">Suivez vos résultats</h3>
            </article>
          </div>

          <div class="mx-auto mt-20 max-w-4xl space-y-9">
            <article>
              <h4 class="text-lg font-bold text-white">1. Qu'est-ce qu'un outil de création de CV et comment fonctionne-t-il ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Un créateur de CV est une interface guidée qui vous aide à structurer, rédiger et mettre en forme votre CV rapidement avec des modèles professionnels.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">2. Puis-je utiliser cet outil aussi pour créer un CV ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Oui. L’outil est conçu pour créer un CV complet, depuis vos informations de base jusqu’à la version finale prête à envoyer.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">3. Ce créateur de CV est-il gratuit ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Une partie des fonctionnalités est généralement disponible gratuitement, avec des options avancées selon le plan choisi.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">4. Les modèles de CV sont-ils compatibles avec les systèmes ATS ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Oui, les modèles sont optimisés pour les ATS afin d’améliorer la lisibilité et le traitement automatique de votre candidature.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">5. Comment choisir le meilleur modèle de CV pour mon poste ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Choisissez un modèle clair et adapté à votre secteur, en mettant en avant les compétences et expériences les plus pertinentes.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">6. Puis-je personnaliser mon CV pour différentes candidatures ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Oui, vous pouvez dupliquer et ajuster votre CV selon chaque offre pour cibler au mieux les attentes du recruteur.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">7. L'outil aide-t-il à rédiger du contenu ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Oui, des suggestions de formulation et de structure peuvent vous aider à rédiger un contenu plus clair et convaincant.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">8. Dans quels formats puis-je télécharger mon CV ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Le format principal est le PDF, avec parfois d’autres formats disponibles selon les options de la plateforme.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">9. Puis-je créer une version en ligne de mon CV ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Oui, vous pouvez souvent générer un lien partageable vers une version web de votre CV.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">10. Quelle est la différence entre un CV et un résumé ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Le CV présente votre parcours détaillé, alors qu’un résumé est plus court et orienté vers l’essentiel.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">11. Est-il adapté aux étudiants et débutants ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Oui, les modèles et suggestions conviennent aussi aux profils juniors, stages et premiers emplois.</p>
            </article>
          </div>
        </div>
      </section>
    `;
  }
}

const AUTO_ROOT_ID = "sierra-cv-steps-faq-root";
if (document.getElementById(AUTO_ROOT_ID)) {
  new CvStepsFaqComponent(AUTO_ROOT_ID);
}
