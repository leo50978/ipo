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
              <h3 class="text-xl font-bold text-white">Renseignez vos informations essentielles</h3>
            </article>

            <article class="text-center">
              <div class="mx-auto mb-5 text-4xl text-white sm:text-5xl">
                <i class="fa-solid fa-sliders"></i>
              </div>
              <h3 class="text-xl font-bold text-white">Appliquez les conseils champ par champ</h3>
            </article>

            <article class="text-center">
              <div class="mx-auto mb-5 text-4xl text-white sm:text-5xl">
                <i class="fa-solid fa-chart-line"></i>
              </div>
              <h3 class="text-xl font-bold text-white">Exportez et postulez</h3>
            </article>
          </div>

          <div class="mx-auto mt-20 max-w-4xl space-y-9">
            <article>
              <h4 class="text-lg font-bold text-white">1. Comment fonctionne votre outil de creation de CV ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">C'est une interface guidee qui vous accompagne et fournit des conseils professionnels pour chaque champ a renseigner.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">2. Puis-je utiliser cet outil aussi pour créer un CV ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Oui. L’outil est conçu pour créer un CV complet, depuis vos informations de base jusqu’à la version finale prête à envoyer.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">3. Ce createur de CV est-il simple a utiliser ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Oui, chaque etape est guidee avec des conseils clairs pour avancer rapidement sans complexite.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">4. Proposez-vous plusieurs modeles de CV ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Non, nous privilegions une structure claire unique et des conseils RH de qualite pour chaque champ.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">5. Comment adapter mon CV a mon poste cible ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Suivez les recommandations sur chaque section pour mettre en avant les experiences et competences les plus pertinentes.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">6. Puis-je personnaliser mon CV pour différentes candidatures ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Oui, vous pouvez dupliquer et ajuster votre CV selon chaque offre pour cibler au mieux les attentes du recruteur.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">7. L'outil aide-t-il a rediger du contenu ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Oui, vous recevez des conseils professionnels pratiques pour rediger chaque champ avec clarte et impact.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">8. Dans quels formats puis-je télécharger mon CV ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Le format principal est le PDF, avec parfois d’autres formats disponibles selon les options de la plateforme.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">9. Puis-je creer une version en ligne de mon CV ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">L'objectif principal est de generer une version PDF propre et prete a l'envoi.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">10. Quelle est la différence entre un CV et un résumé ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Le CV présente votre parcours détaillé, alors qu’un résumé est plus court et orienté vers l’essentiel.</p>
            </article>

            <article>
              <h4 class="text-lg font-bold text-white">11. Est-il adapte aux etudiants et debutants ?</h4>
              <p class="mt-2 text-base leading-relaxed text-white/80">Oui, les conseils sont utiles pour tous les profils, y compris les stages, alternances et premiers emplois.</p>
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
