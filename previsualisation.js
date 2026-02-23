import { playUiSound } from './ui-sound.js';

class PrevisualisationCV extends HTMLElement {
    constructor() {
        super();
        this.initialized = false;
        this.isDownloading = false;
        this.pagesRenderToken = null;
        this.pagesRenderTimer = null;
        this.data = {};
        this.defaultData = {
            firstname: 'Alexandre-Jean-Baptiste',
            middlename: 'Maximilien',
            lastname: 'Martin-De-La-Rochefoucauld',
            designation: 'Responsable Transformation Digitale et Architecte Frontend Senior',
            email: 'alexandre.jean.baptiste.martin.rochefoucauld.super.long@email-exemple-professionnel.com',
            phoneno: '+33 6 12 34 56 78 / +33 7 98 76 54 32',
            address: '12 bis Rue des Tres Longs Noms de Quartier Historique, Batiment C Escalier 4 Appartement 27, 75008 Paris, France',
            address_number: '12',
            address_street: 'Rue des Tres Longs Noms de Quartier Historique, Batiment C Escalier 4 Appartement 27',
            address_postal: '75008',
            address_city: 'Paris Centre Rive Droite',
            address_country: 'France',
            summary: 'Professionnel polyvalent specialise dans la conception de produits numeriques, la coordination de projets transverses et l optimisation continue de l experience utilisateur. Habitude de collaborer avec des equipes pluridisciplinaires dans des environnements exigeants, avec un haut niveau de qualite, de rigueur et de communication. Oriente resultats mesurables, performance applicative et coherence design a grande echelle. Experience solide en accompagnement d equipes, gouvernance des priorites, redaction de contenus clairs et standardisation des pratiques de livraison.',
            exp_title: 'Lead Frontend Engineer et Coordinateur Qualite Produit',
            exp_organization: 'Digital Experience Innovation Studio International',
            exp_location: 'Paris, Ile-de-France',
            exp_start_date: '2022-01-01',
            exp_end_date: '2025-01-01',
            exp_description: 'Pilotage de la migration d une base applicative legacy vers une architecture moderne basee sur des composants reutilisables, accompagnement des equipes sur les bonnes pratiques de qualite et reduction significative des regressions en production.\nMise en place d une strategie UI systemique avec documentation detaillee, normalisation des patterns d interface et amelioration sensible de la maintenabilite globale.\nCollaboration continue avec produit, design, QA et direction technique pour accelerer les cycles de livraison sans degrader l experience utilisateur.\nStructuration d un cadre de revue de contenu RH afin de renforcer la qualite des profils et clarifier les messages cles dans chaque rubrique du CV.',
            experiences: [
                {
                    title: 'Lead Frontend Engineer et Coordinateur Qualite Produit',
                    organization: 'Digital Experience Innovation Studio International',
                    location: 'Paris, Ile-de-France',
                    start_date: '2022-01-01',
                    end_date: '2025-01-01',
                    description: 'Pilotage de la migration d une base applicative legacy vers une architecture moderne basee sur des composants reutilisables, accompagnement des equipes sur les bonnes pratiques de qualite et reduction significative des regressions en production.\nMise en place d une strategie UI systemique avec documentation detaillee, normalisation des patterns d interface et amelioration sensible de la maintenabilite globale.\nCollaboration continue avec produit, design, QA et direction technique pour accelerer les cycles de livraison sans degrader l experience utilisateur.'
                },
                {
                    title: 'Responsable Experience Produit et Parcours Utilisateur',
                    organization: 'Cabinet Conseil Transformation Metiers',
                    location: 'Lyon, Auvergne-Rhone-Alpes',
                    start_date: '2019-03-01',
                    end_date: '2021-12-31',
                    description: 'Coordination de projets d harmonisation des processus de candidature, cadrage des attentes metier et alignement des livrables avec les standards RH.\nAnimation d ateliers de relecture CV avec experts recrutement pour formuler des recommandations directement exploitables dans chaque champ.\nMise en place d indicateurs de comprehension utilisateur et ajustement iteratif des interfaces de saisie.'
                },
                {
                    title: 'Chef de Projet Contenu Professionnel',
                    organization: 'Agence Editoriale Carriere et Emploi',
                    location: 'Bordeaux, Nouvelle-Aquitaine',
                    start_date: '2016-02-01',
                    end_date: '2019-02-28',
                    description: 'Conception de guides pratiques pour rediger des experiences, des resumes et des competences avec un niveau de precision adapte au marche.\nAccompagnement de profils juniors et seniors pour structurer des candidatures lisibles, credibles et coherentes avec leurs objectifs.\nSupervision d un cycle complet de qualite contenu, de la collecte d informations a la validation finale.'
                },
                {
                    title: 'Consultant Redaction et Positionnement Profil',
                    organization: 'Centre de Services Carriere Professionnelle',
                    location: 'Marseille, Provence-Alpes-Cote d Azur',
                    start_date: '2013-01-01',
                    end_date: '2016-01-31',
                    description: 'Accompagnement individuel de candidats pour clarifier leurs experiences et renforcer l impact de leurs candidatures sur des postes cibles.\nCreation de trames de presentation pour harmoniser les rubriques et faciliter la lecture par les recruteurs.\nFormation des equipes internes sur les bonnes pratiques de redaction professionnelle et sur les erreurs frequentes a corriger.'
                }
            ],
            educations: [
                {
                    start_date: '2018-09-01',
                    end_date: '2020-06-01',
                    degree: 'Master Informatique et Ingenierie des Systemes Distribues',
                    school: 'Universite Internationale des Sciences Numeriques et de l Innovation',
                    school_address: '15 Rue des Ecoles et de la Recherche Technologique, 75005 Paris, France'
                },
                {
                    start_date: '2015-09-01',
                    end_date: '2017-06-01',
                    degree: 'Master Management de Projet et Conduite du Changement',
                    school: 'Ecole Superieure de Management Operationnel',
                    school_address: '22 Avenue des Organisations, 69000 Lyon, France'
                },
                {
                    start_date: '2012-09-01',
                    end_date: '2015-06-01',
                    degree: 'Licence Information Communication et Strategies Editoriales',
                    school: 'Faculte Lettres et Sciences Humaines',
                    school_address: '9 Boulevard Universitaire, 33000 Bordeaux, France'
                }
            ],
            phones: ['+33 6 12 34 56 78', '+33 7 12 98 44 10'],
            languages: [
                { name: 'Francais Professionnel et Redaction Avancee', level: 'Tres bien' },
                { name: 'Anglais Technique et Communication Internationale', level: 'Bien' },
                { name: 'Espagnol Professionnel', level: 'Intermediaire' },
                { name: 'Allemand Professionnel', level: 'Intermediaire' },
                { name: 'Italien Conversationnel', level: 'Notions avancees' },
                { name: 'Portugais Ecrit Professionnel', level: 'Notions' }
            ],
            tools: [
                { type: 'Logiciel', name: 'Figma Design System Enterprise', level: 'Expert' },
                { type: 'Logiciel', name: 'Jira Advanced Workflow Management', level: 'Intermediaire' },
                { type: 'Logiciel', name: 'Notion Documentation Collaborative', level: 'Expert' },
                { type: 'Logiciel', name: 'Confluence Knowledge Base', level: 'Intermediaire' }
            ],
            softwares: 'Figma Design System Enterprise, Jira Advanced Workflow Management, VS Code Workspace Automation, GitHub Enterprise, Notion Documentation Collaborative, Confluence Knowledge Base, Trello Pilotage Editorial, Miro Ateliers Co-conception',
            interests: [
                'Design d interfaces numeriques a haute accessibilite',
                'Veille technologique frontend et architecture web moderne',
                'Photographie urbaine et composition visuelle professionnelle',
                'Mentorat de profils juniors en redaction de CV',
                'Analyse des tendances recrutement et adaptation des candidatures',
                'Optimisation de la lisibilite des contenus professionnels',
                'Communication ecrite orientee resultats et impact',
                'Ateliers de co-construction de parcours carriere',
                'Documentation et normalisation des pratiques RH',
                'Accompagnement des transitions de poste et reconversion'
            ],
            image: 'assets/images/profile-image.jpg'
        };
    }

    async connectedCallback() {
        if (this.initialized) return;
        this.initialized = true;

        await this.ensureDependencies();
        this.render();
        this.bindEvents();
        this.updatePreview();
    }

    async ensureDependencies() {
        await Promise.all([
            this.loadScript('https://cdn.tailwindcss.com', 'cvb-tailwind'),
            this.loadStylesheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css', 'cvb-fa'),
            this.loadStylesheet('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap', 'cvb-poppins'),
            this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', 'cvb-html2canvas'),
            this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'cvb-jspdf')
        ]);
    }

    loadScript(src, marker) {
        if (document.querySelector(`script[data-${marker}]`)) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.setAttribute(`data-${marker}`, 'true');
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    loadStylesheet(href, marker) {
        if (document.querySelector(`link[data-${marker}]`)) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.setAttribute(`data-${marker}`, 'true');
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    render() {
        this.innerHTML = `
            <section class="pv-root h-screen overflow-y-auto bg-slate-200 p-2 font-[Poppins] sm:p-3">
                <div class="pv-card mx-auto flex max-w-[1200px] flex-col gap-2 sm:gap-3">
                    <div class="pv-topbar flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-2 sm:p-3">
                        <div>
                            <p class="pv-title-sm text-xs font-semibold text-sky-700 sm:text-sm">Previsualisation</p>
                            <h2 class="pv-title-lg text-lg font-bold text-slate-900 sm:text-2xl">Apercu final du CV</h2>
                            <p class="mt-1 hidden text-xs font-medium text-amber-700 sm:text-sm" data-pdf-pages-hint></p>
                        </div>
                        <div class="pv-actions flex flex-wrap items-center justify-end gap-2">
                            <button type="button" class="pv-action-btn inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-300 bg-slate-200 px-3 text-xs font-semibold text-slate-800 hover:bg-slate-300 sm:min-h-10 sm:text-sm" data-action="back">
                                <i class="fa-solid fa-arrow-left"></i>Retour
                            </button>
                            <button type="button" class="pv-action-btn inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-300 bg-slate-200 px-3 text-xs font-semibold text-slate-800 hover:bg-slate-300 sm:min-h-10 sm:text-sm" data-action="close-builder">
                                <i class="fa-solid fa-xmark"></i>Fermer
                            </button>
                            <button type="button" class="pv-action-btn inline-flex min-h-9 items-center gap-2 rounded-lg border border-sky-700 bg-sky-700 px-3 text-xs font-semibold text-white hover:bg-sky-800 sm:min-h-10 sm:text-sm" data-action="download-pdf">
                                <i class="fa-solid fa-file-arrow-down"></i>Telecharger PDF
                            </button>
                        </div>
                    </div>

                    <div class="pv-cv-wrap overflow-x-auto pb-3">
                        <div class="pv-viewport mx-auto flex min-w-max flex-col items-center justify-center gap-3 px-2">
                            <div class="pv-pages flex min-w-max flex-col items-center gap-3" data-preview-pages>
                                <div class="w-[254px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-xs text-slate-500 sm:w-[349px] md:w-[476px] lg:w-[635px] xl:w-[794px]">Generation de la previsualisation paginee...</div>
                            </div>

                            <div class="hidden" aria-hidden="true">
                                <div id="pv-preview" class="pv-paper pv-print grid min-h-[1123px] w-[794px] grid-cols-[30%_70%] border border-slate-300 bg-white text-[#222222] shadow-sm">
                                    <aside class="pv-left flex min-w-0 flex-col bg-[#2f3e4e] text-white">
                                        <img data-preview="image" data-edit-step="image" data-edit-block alt="photo" class="pv-photo h-[250px] w-full cursor-pointer object-cover" style="display:block;width:100%;height:250px;object-fit:cover;object-position:center;">

                                        <section class="pv-l-section flex min-h-[291px] flex-col px-5 py-5 text-center" data-autofit-box data-edit-step="summary">
                                            <h4 class="pv-l-title text-center text-[14px] font-medium uppercase tracking-[4px]">Profile</h4>
                                            <div class="pv-l-line mx-auto my-3 h-[3px] w-10 rounded bg-white"></div>
                                            <p class="pv-l-text flex-1 cursor-pointer break-words px-5 text-center text-[14px] leading-[1.6] hover:opacity-90" data-preview="summary" data-edit-step="summary" data-edit-block data-autofit data-autofit-min="8"></p>
                                        </section>

                                        <section class="pv-l-section flex min-h-[291px] flex-col px-5 py-5 text-center" data-autofit-box data-edit-step="email">
                                            <h4 class="pv-l-title text-center text-[14px] font-medium uppercase tracking-[4px]">Contact</h4>
                                            <div class="pv-l-line mx-auto my-3 h-[3px] w-10 rounded bg-white"></div>
                                            <ul class="pv-l-list m-0 flex-1 list-none px-5">
                                                <li class="pv-l-item mb-2 flex flex-wrap cursor-pointer items-center justify-center gap-2 break-words text-[14px] leading-[1.6] opacity-90 hover:opacity-100" data-edit-step="email" data-edit-block data-autofit data-autofit-min="8"><i class="fa-solid fa-envelope text-base"></i><span class="break-all" data-preview="email"></span></li>
                                                <li class="pv-l-item mb-2 flex cursor-pointer items-center justify-center gap-2 break-words text-[14px] leading-[1.6] opacity-90 hover:opacity-100" data-edit-step="phones" data-edit-block data-autofit data-autofit-min="8"><i class="fa-solid fa-phone text-base"></i><span data-preview="phoneno"></span></li>
                                                <li class="pv-l-item mb-2 flex cursor-pointer items-center justify-center gap-2 break-words text-[14px] leading-[1.6] opacity-90 hover:opacity-100" data-edit-step="address" data-edit-block data-autofit data-autofit-min="8"><i class="fa-solid fa-location-dot text-base"></i><span data-preview="address"></span></li>
                                            </ul>
                                        </section>

                                        <section class="pv-l-section flex min-h-[291px] flex-col px-5 py-5 text-center" data-autofit-box data-edit-step="interests">
                                            <h4 class="pv-l-title text-center text-[14px] font-medium uppercase tracking-[4px]">Interets</h4>
                                            <div class="pv-l-line mx-auto my-3 h-[3px] w-10 rounded bg-white"></div>
                                            <ul class="pv-l-list m-0 flex-1 list-none px-5" data-preview-list="interests" data-edit-step="interests"></ul>
                                        </section>
                                    </aside>

                                    <main class="pv-right flex h-full min-w-0 flex-col gap-6 bg-white p-10 text-[#222222]">
                                        <header class="pv-r-header min-h-[130px] shrink-0" data-autofit-box data-edit-step="firstname">
                                            <h1 class="pv-r-name m-0 mb-[5px] cursor-pointer break-words text-[40px] font-semibold leading-[1.1] tracking-[1px] hover:opacity-90" data-preview="fullname" data-edit-step="firstname" data-edit-block data-autofit data-autofit-min="16"></h1>
                                            <p class="pv-r-role m-0 cursor-pointer break-words text-[14px] font-normal uppercase tracking-[6px] text-[#555555] hover:opacity-90" data-preview="designation" data-edit-step="designation" data-edit-block data-autofit data-autofit-min="8"></p>
                                        </header>

                                        <section class="pv-r-section flex min-h-[230px] flex-col" data-autofit-box data-edit-step="educations">
                                            <h4 class="pv-r-title m-0 mb-[15px] text-[16px] font-semibold uppercase tracking-[3px]">Formation</h4>
                                            <div class="pv-r-line mb-3.5 h-1 w-[50px] rounded bg-[#2f3e4e]"></div>
                                            <ul class="pv-edu-list flex-1 list-disc pl-[22px]" data-preview-list="educations" data-edit-step="educations"></ul>
                                        </section>

                                        <section class="pv-r-section flex min-h-[300px] flex-col" data-autofit-box data-edit-step="experiences">
                                            <h4 class="pv-r-title m-0 mb-[15px] text-[16px] font-semibold uppercase tracking-[3px]">Experience</h4>
                                            <div class="pv-r-line mb-3.5 h-1 w-[50px] rounded bg-[#2f3e4e]"></div>
                                            <div class="flex-1" data-autofit-box>
                                                <article class="pv-exp-item flex gap-[14px]" data-edit-step="experiences" data-edit-block>
                                                    <div class="pv-exp-date w-[110px] shrink-0 cursor-pointer text-[14px] font-semibold hover:opacity-90" data-preview="exp_dates" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8"></div>
                                                    <div class="pv-exp-content flex-1">
                                                        <p class="pv-exp-role m-0 cursor-pointer break-words text-[14px] font-semibold uppercase hover:opacity-90" data-preview="exp_title" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8"></p>
                                                        <p class="pv-exp-company m-0 mt-0.5 cursor-pointer break-words text-[14px] font-medium hover:opacity-90" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8"><span data-preview="exp_organization"></span> - <span data-preview="exp_location"></span></p>
                                                        <ul class="pv-exp-list mb-0 mt-2 list-disc pl-[18px] text-[14px] leading-[1.5]" data-preview-list="exp_bullets" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8"></ul>
                                                    </div>
                                                </article>
                                            </div>
                                        </section>

                                        <section class="pv-r-section flex min-h-[220px] flex-col" data-autofit-box>
                                            <h4 class="pv-r-title m-0 mb-[15px] text-[16px] font-semibold uppercase tracking-[3px]">Competences</h4>
                                            <div class="pv-r-line mb-3.5 h-1 w-[50px] rounded bg-[#2f3e4e]"></div>
                                            <div class="pv-skills-grid grid flex-1 grid-cols-2 gap-[18px]" data-autofit-box>
                                                <div data-edit-step="languages">
                                                    <p class="pv-sk-col-title m-0 mb-[7px] text-[14px] font-semibold uppercase tracking-[1px]">Langues</p>
                                                    <ul class="pv-sk-list m-0 list-disc pl-4 text-[14px] leading-[1.6]" data-preview-list="languages" data-edit-step="languages" data-autofit data-autofit-min="8"></ul>
                                                </div>
                                                <div data-edit-step="tools">
                                                    <p class="pv-sk-col-title m-0 mb-[7px] cursor-pointer text-[14px] font-semibold uppercase tracking-[1px] hover:opacity-90" data-preview="tools_title" data-edit-step="tools" data-edit-block>Logiciels</p>
                                                    <ul class="pv-sk-list m-0 list-disc pl-4 text-[14px] leading-[1.6]" data-preview-list="softwares" data-edit-step="tools" data-autofit data-autofit-min="8"></ul>
                                                </div>
                                            </div>
                                        </section>
                                    </main>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    bindEvents() {
        this.addEventListener('click', (event) => {
            if (event.target.closest('[data-action="back"]')) {
                playUiSound('prev');
                this.dispatchEvent(new CustomEvent('preview-back', { bubbles: true }));
                return;
            }

            if (event.target.closest('[data-action="close-builder"]')) {
                playUiSound('close');
                this.dispatchEvent(new CustomEvent('close-builder', { bubbles: true }));
                return;
            }

            const downloadBtn = event.target.closest('[data-action="download-pdf"]');
            if (downloadBtn) {
                if (this.isDownloading) return;
                playUiSound('download');
                this.downloadPdf(downloadBtn);
                return;
            }

            const editTarget = event.target.closest('[data-edit-step]');
            if (editTarget) {
                playUiSound('tip');
                const step = editTarget.getAttribute('data-edit-step');
                if (step) {
                    this.dispatchEvent(new CustomEvent('preview-edit-step', {
                        bubbles: true,
                        detail: { step }
                    }));
                }
            }
        });
    }

    loadData(data) {
        this.data = data || {};
        this.updatePreview();
    }

    updatePreview() {
        const data = this.resolveDataWithDefaults();
        this.setText('fullname', [data.firstname, data.middlename, data.lastname].filter(Boolean).join(' ') || 'Nom Prenom');
        this.setText('designation', data.designation || 'Poste');
        this.setText('email', data.email || 'email@exemple.com');
        this.setText('phoneno', this.formatPhoneDisplay(data) || '+00 0 00 00 00 00');
        this.setText('address', this.formatAddressDisplay(data) || 'Adresse complete');
        this.setText('summary', data.summary || 'Profil a renseigner depuis le formulaire.');

        this.setText('exp_title', data.exp_title || 'Poste');
        this.setText('exp_organization', data.exp_organization || 'Entreprise');
        this.setText('exp_location', data.exp_location || 'Lieu');
        this.setText('exp_dates', this.formatDateRange(data.exp_start_date, data.exp_end_date) || 'Periode');

        this.renderEducationList(this.buildEducationItems(data));
        this.renderExperienceList(this.buildExperienceItems(data));

        this.renderList('interests', this.buildInterestItems(data, this.data));
        this.renderList('languages', this.buildLanguageItems(data));
        const toolData = this.buildSoftwareItems(data);
        this.setText('tools_title', toolData.title);
        this.renderList('softwares', toolData.items);

        const imageEl = this.querySelector('[data-preview="image"]');
        if (imageEl) {
            if (data.image) imageEl.src = data.image;
            else imageEl.removeAttribute('src');
        }
        requestAnimationFrame(() => {
            this.updatePdfPagesHint();
            this.schedulePaginatedPreviewRender();
        });
        // Garde des tailles de texte stables et lisibles
        // au lieu de reduire automatiquement toute la mise en page.
    }

    schedulePaginatedPreviewRender() {
        if (this.pagesRenderTimer) {
            clearTimeout(this.pagesRenderTimer);
        }
        this.pagesRenderTimer = window.setTimeout(() => {
            this.renderPaginatedPreview();
        }, 120);
    }

    updatePdfPagesHint() {
        const hint = this.querySelector('[data-pdf-pages-hint]');
        const preview = this.querySelector('#pv-preview');
        if (!hint || !preview) return;

        const marginMm = 6;
        const pageWidthMm = 210;
        const pageHeightMm = 297;
        const contentWidthMm = pageWidthMm - (marginMm * 2);
        const contentHeightMm = pageHeightMm - (marginMm * 2);
        const exportWidthPx = 794;
        const pageHeightPx = Math.floor((contentHeightMm / contentWidthMm) * exportWidthPx);

        const contentHeightPx = Math.max(preview.scrollHeight, preview.offsetHeight, 1123);
        const pages = Math.max(1, Math.ceil(contentHeightPx / pageHeightPx));

        hint.classList.remove('hidden');
        if (pages > 1) {
            hint.textContent = `PDF estime: ${pages} pages. Si vous voulez une seule page, reduisez un peu le texte.`;
            hint.classList.remove('text-slate-600');
            hint.classList.add('text-amber-700');
            return;
        }

        hint.textContent = 'PDF estime: 1 page.';
        hint.classList.remove('text-amber-700');
        hint.classList.add('text-slate-600');
    }

    buildPageSlices(canvas, maxPageHeightPx, textFlow = null) {
        if (!canvas || !maxPageHeightPx) return [];
        const scaledFlow = this.scaleTextFlowForCanvas(textFlow, canvas.height);
        const slices = [];
        let renderedPx = 0;
        while (renderedPx < canvas.height) {
            const sliceHeightPx = this.findSmartSliceHeight(canvas, renderedPx, maxPageHeightPx, scaledFlow);
            if (!sliceHeightPx || sliceHeightPx < 1) break;
            slices.push(sliceHeightPx);
            renderedPx += sliceHeightPx;
        }
        if (!slices.length) {
            slices.push(Math.max(1, Math.min(maxPageHeightPx, canvas.height)));
        }
        return slices;
    }

    findSmartSliceHeight(canvas, startY, maxSliceHeightPx, textFlow = null) {
        const remaining = canvas.height - startY;
        if (remaining <= maxSliceHeightPx) return remaining;
        const blockRanges = Array.isArray(textFlow?.blockRanges) ? textFlow.blockRanges : [];

        // Evite les fins de page trop "vides" : on coupe pres du bas par defaut.
        const minSliceHeightPx = Math.max(760, Math.floor(maxSliceHeightPx * 0.78));
        const hardMinSlicePx = Math.max(120, Math.floor(maxSliceHeightPx * 0.2));
        const idealEndY = startY + maxSliceHeightPx;
        const minEndY = startY + minSliceHeightPx;
        if (minEndY >= idealEndY - 10) {
            const forcedCut = this.adjustCutForBlocks(idealEndY, startY, blockRanges, maxSliceHeightPx);
            if (forcedCut === null) return maxSliceHeightPx;
            return Math.max(hardMinSlicePx, Math.min(maxSliceHeightPx, forcedCut - startY));
        }
        const maxBottomGapPx = Math.max(48, Math.floor(maxSliceHeightPx * 0.08));

        const safeCut = this.findNearestSafeCut(textFlow, minEndY, idealEndY);
        if (safeCut !== null) {
            const adjustedSafeCut = this.adjustCutForBlocks(safeCut, startY, blockRanges, maxSliceHeightPx);
            if (adjustedSafeCut === null) return maxSliceHeightPx;
            const safeHeight = adjustedSafeCut - startY;
            const bottomGap = idealEndY - adjustedSafeCut;
            if (safeHeight >= hardMinSlicePx && bottomGap <= maxBottomGapPx) {
                return Math.min(maxSliceHeightPx, safeHeight);
            }
        }

        const scanBackPx = Math.min(160, idealEndY - minEndY);
        const searchStartY = idealEndY - scanBackPx;
        const searchEndY = idealEndY - 8;
        if (searchEndY <= searchStartY) return maxSliceHeightPx;

        const xStart = Math.floor(canvas.width * 0.34);
        const xEnd = Math.floor(canvas.width * 0.985);
        const scanWidth = Math.max(8, xEnd - xStart);
        const scanHeight = Math.max(1, searchEndY - searchStartY);

        const ctx = canvas.getContext('2d', { willReadFrequently: true }) || canvas.getContext('2d');
        if (!ctx) return maxSliceHeightPx;

        let bestLocalRow = -1;
        let nearBottomRow = -1;
        let bestScore = Number.POSITIVE_INFINITY;
        const xStep = 3;
        const nearWhiteThreshold = 0.012;

        try {
            const strip = ctx.getImageData(xStart, searchStartY, scanWidth, scanHeight).data;
            for (let row = scanHeight - 1; row >= 0; row -= 1) {
                let nonWhite = 0;
                let samples = 0;
                for (let x = 0; x < scanWidth; x += xStep) {
                    const idx = (row * scanWidth + x) * 4;
                    const r = strip[idx];
                    const g = strip[idx + 1];
                    const b = strip[idx + 2];
                    const a = strip[idx + 3];
                    if (a > 10) {
                        samples += 1;
                        if (r < 242 || g < 242 || b < 242) {
                            nonWhite += 1;
                        }
                    }
                }
                if (!samples) continue;
                const score = nonWhite / samples;
                if (nearBottomRow < 0 && score <= nearWhiteThreshold) {
                    nearBottomRow = row;
                    break;
                }
                if (score < bestScore || (Math.abs(score - bestScore) < 0.0001 && row > bestLocalRow)) {
                    bestScore = score;
                    bestLocalRow = row;
                }
            }
        } catch (error) {
            return maxSliceHeightPx;
        }

        const chosenRow = nearBottomRow >= 0 ? nearBottomRow : bestLocalRow;
        if (chosenRow < 0 || bestScore > 0.075) return maxSliceHeightPx;

        const breakY = searchStartY + chosenRow;
        const adjustedBreakY = this.adjustCutForBlocks(breakY, startY, blockRanges, maxSliceHeightPx);
        if (adjustedBreakY === null) return maxSliceHeightPx;
        const sliceHeight = adjustedBreakY - startY;
        if (sliceHeight < hardMinSlicePx) {
            const fallbackCut = this.adjustCutForBlocks(idealEndY, startY, blockRanges, maxSliceHeightPx);
            if (fallbackCut === null) return maxSliceHeightPx;
            return Math.max(hardMinSlicePx, Math.min(maxSliceHeightPx, fallbackCut - startY));
        }
        return Math.min(maxSliceHeightPx, sliceHeight);
    }

    adjustCutForBlocks(cutY, startY, blockRanges = [], maxSliceHeightPx = 0) {
        if (!Number.isFinite(cutY)) return cutY;
        if (!Array.isArray(blockRanges) || !blockRanges.length) return Math.floor(cutY);

        const originalCut = Math.floor(cutY);
        let adjustedCut = originalCut;
        let guard = 0;

        while (guard < 30) {
            const crossing = this.findCrossingBlock(blockRanges, adjustedCut);
            if (!crossing) break;

            const nextCut = crossing.top - 2;
            // Si le bloc commence en tete de page, on tente de couper APRES ce bloc.
            if (nextCut <= startY + 2) {
                const afterBlockCut = crossing.bottom + 2;
                const maxAllowedCut = startY + (Number.isFinite(maxSliceHeightPx) ? maxSliceHeightPx : 0);
                if (afterBlockCut > startY + 2 && (!maxAllowedCut || afterBlockCut <= maxAllowedCut)) {
                    adjustedCut = afterBlockCut;
                    break;
                }
                return null;
            }

            adjustedCut = nextCut;
            guard += 1;
        }

        return Math.max(startY + 2, adjustedCut);
    }

    findCrossingBlock(blockRanges, cutY) {
        if (!Array.isArray(blockRanges) || !blockRanges.length) return null;
        for (let i = 0; i < blockRanges.length; i += 1) {
            const range = blockRanges[i];
            if (cutY < range.top - 3) break;
            if (cutY <= range.bottom + 3) return range;
        }
        return null;
    }

    normalizeBlockRanges(ranges = []) {
        if (!Array.isArray(ranges) || !ranges.length) return [];
        const sorted = ranges
            .filter((item) => Number.isFinite(item?.top) && Number.isFinite(item?.bottom) && item.bottom > item.top)
            .map((item) => ({ top: Math.floor(item.top), bottom: Math.floor(item.bottom) }))
            .sort((a, b) => (a.top - b.top) || (a.bottom - b.bottom));
        if (!sorted.length) return [];

        const merged = [{ ...sorted[0] }];
        for (let i = 1; i < sorted.length; i += 1) {
            const current = sorted[i];
            const prev = merged[merged.length - 1];
            if (current.top <= prev.bottom + 2) {
                prev.bottom = Math.max(prev.bottom, current.bottom);
            } else {
                merged.push({ ...current });
            }
        }
        return merged;
    }

    findNearestSafeCut(textFlow, minEndY, idealEndY) {
        if (!textFlow) return null;
        const density = textFlow.density instanceof Uint16Array ? textFlow.density : null;
        const boundaries = textFlow.boundaries instanceof Uint8Array ? textFlow.boundaries : null;
        if (!density || !boundaries || !density.length || !boundaries.length) return null;

        const startY = Math.max(2, Math.floor(minEndY));
        const endY = Math.min(Math.min(density.length, boundaries.length) - 3, Math.floor(idealEndY));
        if (endY <= startY) return null;

        let bestRow = null;
        let bestScore = Number.POSITIVE_INFINITY;
        for (let y = endY; y >= startY; y -= 1) {
            if (!boundaries[y]) continue;
            const score = density[y - 1] + density[y] + density[y + 1];
            if (score === 0) return y;
            if (score < bestScore) {
                bestScore = score;
                bestRow = y;
            }
        }

        for (let y = endY; y >= startY; y -= 1) {
            if (density[y - 1] === 0 && density[y] === 0 && density[y + 1] === 0) return y;
        }

        if (bestRow !== null) return bestRow;
        return null;
    }

    collectTextRowOccupancy(rootNode, maxY) {
        if (!rootNode) return null;
        const rootRect = rootNode.getBoundingClientRect();
        const maxAllowed = Math.max(256, Math.floor(maxY || rootNode.scrollHeight || 0) + 2);
        const density = new Uint16Array(maxAllowed + 2);
        const boundaries = new Uint8Array(maxAllowed + 2);
        const blockRanges = [];

        const walker = document.createTreeWalker(
            rootNode,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    if (!node || !node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    const style = window.getComputedStyle(parent);
                    if (style.display === 'none' || style.visibility === 'hidden') return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        while (walker.nextNode()) {
            const textNode = walker.currentNode;
            const range = document.createRange();
            range.selectNodeContents(textNode);
            const rects = Array.from(range.getClientRects());
            rects.forEach((rect) => {
                if (!rect || rect.height < 3 || rect.width < 2) return;
                const top = Math.max(0, Math.floor(rect.top - rootRect.top));
                const bottom = Math.min(maxAllowed, Math.ceil(rect.bottom - rootRect.top) - 1);
                if (bottom < top) return;
                for (let y = top; y <= bottom; y += 1) {
                    density[y] = Math.min(65535, density[y] + 1);
                }
                const cutBefore = Math.max(1, top - 1);
                const cutAfter = Math.min(maxAllowed, bottom + 1);
                boundaries[cutBefore] = 1;
                boundaries[cutAfter] = 1;
            });
            range.detach();
        }

        rootNode.querySelectorAll('[data-edit-block]').forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (!rect || rect.width < 4 || rect.height < 6) return;

            const padPx = 4;
            const top = Math.max(0, Math.floor(rect.top - rootRect.top) - padPx);
            const bottom = Math.min(maxAllowed, Math.ceil(rect.bottom - rootRect.top) - 1 + padPx);
            if (bottom <= top) return;
            const height = bottom - top + 1;
            if (height > Math.floor(maxAllowed * 0.55)) return;

            blockRanges.push({ top, bottom });
        });

        return {
            density,
            boundaries,
            blockRanges: this.normalizeBlockRanges(blockRanges),
            sourceHeight: maxAllowed + 1
        };
    }

    scaleTextFlowForCanvas(textFlow, canvasHeight) {
        if (!textFlow || !(textFlow.density instanceof Uint16Array) || !(textFlow.boundaries instanceof Uint8Array)) {
            return null;
        }
        const sourceHeight = Math.max(1, Number(textFlow.sourceHeight || textFlow.density.length - 1));
        const targetHeight = Math.max(1, Math.floor(canvasHeight));
        if (Math.abs(sourceHeight - targetHeight) <= 1) {
            return textFlow;
        }

        const scaledDensity = new Uint16Array(targetHeight + 2);
        const scaledBoundaries = new Uint8Array(targetHeight + 2);
        const scaledBlockRanges = [];
        const ratio = targetHeight / sourceHeight;
        const maxSrc = Math.min(sourceHeight, textFlow.density.length - 1);

        for (let y = 0; y <= maxSrc; y += 1) {
            const mapped = Math.max(0, Math.min(targetHeight + 1, Math.round(y * ratio)));
            if (textFlow.density[y] > 0) {
                scaledDensity[mapped] = Math.min(65535, scaledDensity[mapped] + textFlow.density[y]);
                if (mapped + 1 <= targetHeight + 1) {
                    scaledDensity[mapped + 1] = Math.min(65535, scaledDensity[mapped + 1] + textFlow.density[y]);
                }
            }
            if (textFlow.boundaries[y]) {
                scaledBoundaries[mapped] = 1;
            }
        }

        if (Array.isArray(textFlow.blockRanges) && textFlow.blockRanges.length) {
            textFlow.blockRanges.forEach((range) => {
                if (!Number.isFinite(range?.top) || !Number.isFinite(range?.bottom)) return;
                const top = Math.max(0, Math.min(targetHeight, Math.floor(range.top * ratio) - 2));
                const bottom = Math.max(top + 1, Math.min(targetHeight + 1, Math.ceil(range.bottom * ratio) + 2));
                if (bottom <= top) return;
                scaledBlockRanges.push({ top, bottom });
            });
        }

        return {
            density: scaledDensity,
            boundaries: scaledBoundaries,
            blockRanges: this.normalizeBlockRanges(scaledBlockRanges),
            sourceHeight: targetHeight
        };
    }

    collectEditHotspots(rootNode, maxY) {
        if (!rootNode) return [];
        const rootRect = rootNode.getBoundingClientRect();
        const maxAllowedY = Math.max(0, Math.floor(maxY || rootNode.scrollHeight || 0));
        const seen = new Set();
        const hotspots = [];

        rootNode.querySelectorAll('[data-edit-step]').forEach((el) => {
            const step = (el.getAttribute('data-edit-step') || '').trim();
            if (!step) return;

            // Conserve surtout les zones finales de texte pour eviter des overlays geants.
            if (el.querySelector('[data-edit-step]')) return;

            const rect = el.getBoundingClientRect();
            if (!rect || rect.width < 4 || rect.height < 4) return;

            const x = Math.max(0, rect.left - rootRect.left);
            const y = Math.max(0, rect.top - rootRect.top);
            const width = Math.min(rootRect.width - x, rect.width);
            const height = Math.min(maxAllowedY - y, rect.height);
            if (width < 4 || height < 4) return;

            const key = `${step}:${Math.round(x)}:${Math.round(y)}:${Math.round(width)}:${Math.round(height)}`;
            if (seen.has(key)) return;
            seen.add(key);
            hotspots.push({ step, x, y, width, height });
        });

        return hotspots;
    }

    appendPageHotspots(layer, options) {
        if (!layer) return;
        const {
            hotspots = [],
            pageStartPx = 0,
            pageEndPx = 0,
            pageCanvasWidthPx = 1,
            pageCanvasHeightPx = 1,
            marginPx = 0,
            drawWidthPx = 1
        } = options || {};
        if (!Array.isArray(hotspots) || !hotspots.length) return;

        const scale = drawWidthPx / pageCanvasWidthPx;
        const maxRight = marginPx + drawWidthPx;
        const maxBottom = pageCanvasHeightPx - marginPx;

        hotspots.forEach((spot) => {
            const spotTop = spot.y;
            const spotBottom = spot.y + spot.height;
            if (spotBottom <= pageStartPx || spotTop >= pageEndPx) return;

            const visibleTop = Math.max(spotTop, pageStartPx);
            const visibleBottom = Math.min(spotBottom, pageEndPx);
            const visibleHeight = (visibleBottom - visibleTop) * scale;
            if (visibleHeight < 3) return;

            const leftPx = marginPx + (spot.x * scale);
            const topPx = marginPx + ((visibleTop - pageStartPx) * scale);
            const widthPx = spot.width * scale;

            const clampedLeft = Math.max(marginPx, Math.min(leftPx, maxRight - 4));
            const clampedTop = Math.max(marginPx, Math.min(topPx, maxBottom - 4));
            const clampedWidth = Math.max(4, Math.min(widthPx, maxRight - clampedLeft));
            const clampedHeight = Math.max(4, Math.min(visibleHeight, maxBottom - clampedTop));
            if (clampedWidth < 4 || clampedHeight < 4) return;

            const zone = document.createElement('div');
            zone.className = 'absolute z-[2] cursor-pointer bg-sky-300/0 transition-colors duration-150 hover:bg-sky-300/20';
            zone.style.left = `${(clampedLeft / pageCanvasWidthPx) * 100}%`;
            zone.style.top = `${(clampedTop / pageCanvasHeightPx) * 100}%`;
            zone.style.width = `${(clampedWidth / pageCanvasWidthPx) * 100}%`;
            zone.style.height = `${(clampedHeight / pageCanvasHeightPx) * 100}%`;
            zone.setAttribute('data-edit-step', spot.step);
            layer.appendChild(zone);
        });
    }

    async renderPaginatedPreview() {
        const source = this.querySelector('#pv-preview');
        const host = this.querySelector('[data-preview-pages]');
        if (!source || !host || typeof window.html2canvas !== 'function') return;

        const token = Symbol('pv-pages-render');
        this.pagesRenderToken = token;
        host.innerHTML = '<div class="w-[254px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-xs text-slate-500 sm:w-[349px] md:w-[476px] lg:w-[635px] xl:w-[794px]">Generation de la previsualisation paginee...</div>';

        let exportNode = null;
        try {
            const exportWidth = 794;
            const pageWidthMm = 210;
            const pageHeightMm = 297;
            const marginMm = 6;
            const contentWidthMm = pageWidthMm - (marginMm * 2);
            const contentHeightMm = pageHeightMm - (marginMm * 2);

            exportNode = source.cloneNode(true);
            exportNode.id = 'pv-preview-pages-export';
            exportNode.style.position = 'fixed';
            exportNode.style.left = '-10000px';
            exportNode.style.top = '0';
            exportNode.style.width = `${exportWidth}px`;
            exportNode.style.height = 'auto';
            exportNode.style.transform = 'none';
            exportNode.style.transformOrigin = 'top left';
            exportNode.style.maxWidth = 'none';
            exportNode.style.maxHeight = 'none';
            exportNode.style.pointerEvents = 'none';
            exportNode.style.zIndex = '-1';
            document.body.appendChild(exportNode);

            await this.waitForExportAssets(exportNode);
            const contentHeightPx = Math.max(exportNode.scrollHeight, exportNode.offsetHeight, 1123);
            exportNode.style.height = `${contentHeightPx}px`;
            const textOccupancy = this.collectTextRowOccupancy(exportNode, contentHeightPx);
            const editHotspots = this.collectEditHotspots(exportNode, contentHeightPx);

            const canvas = await window.html2canvas(exportNode, {
                scale: 1,
                useCORS: true,
                backgroundColor: '#ffffff',
                width: exportWidth,
                height: contentHeightPx,
                windowWidth: exportWidth,
                windowHeight: contentHeightPx,
                scrollX: 0,
                scrollY: 0
            });

            if (exportNode.parentElement) exportNode.parentElement.removeChild(exportNode);
            if (this.pagesRenderToken !== token) return;

            const pageHeightPx = Math.floor((contentHeightMm / contentWidthMm) * canvas.width);
            const pageCanvasHeightPx = Math.round((pageHeightMm / pageWidthMm) * canvas.width);
            const marginPx = Math.round((marginMm / pageWidthMm) * canvas.width);
            const drawWidthPx = canvas.width - (marginPx * 2);

            const slices = this.buildPageSlices(canvas, pageHeightPx, textOccupancy);
            host.innerHTML = '';
            let renderedPx = 0;
            let pageNumber = 1;
            for (const sliceHeightPx of slices) {
                const sliceCanvas = document.createElement('canvas');
                sliceCanvas.width = canvas.width;
                sliceCanvas.height = sliceHeightPx;
                const sliceCtx = sliceCanvas.getContext('2d');
                if (!sliceCtx) break;

                sliceCtx.drawImage(
                    canvas,
                    0,
                    renderedPx,
                    canvas.width,
                    sliceHeightPx,
                    0,
                    0,
                    canvas.width,
                    sliceHeightPx
                );

                const pageCanvas = document.createElement('canvas');
                pageCanvas.width = canvas.width;
                pageCanvas.height = pageCanvasHeightPx;
                const pageCtx = pageCanvas.getContext('2d');
                if (!pageCtx) break;
                pageCtx.fillStyle = '#ffffff';
                pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
                const drawHeightPx = Math.round((sliceHeightPx / canvas.width) * drawWidthPx);
                pageCtx.drawImage(sliceCanvas, marginPx, marginPx, drawWidthPx, drawHeightPx);

                const pageWrap = document.createElement('div');
                pageWrap.className = 'flex flex-col items-center gap-1';
                const pageLabel = document.createElement('p');
                pageLabel.className = 'text-[11px] font-semibold uppercase tracking-wide text-slate-500';
                pageLabel.textContent = `Page ${pageNumber}`;
                const pageFrame = document.createElement('div');
                pageFrame.className = 'relative w-[254px] sm:w-[349px] md:w-[476px] lg:w-[635px] xl:w-[794px]';
                const pageImg = document.createElement('img');
                pageImg.src = pageCanvas.toDataURL('image/png', 1.0);
                pageImg.alt = `Previsualisation page ${pageNumber}`;
                pageImg.className = 'h-auto w-full box-border border border-slate-300 bg-white shadow-sm';
                const hotspotLayer = document.createElement('div');
                hotspotLayer.className = 'absolute inset-0 z-[2]';
                this.appendPageHotspots(hotspotLayer, {
                    hotspots: editHotspots,
                    pageStartPx: renderedPx,
                    pageEndPx: renderedPx + sliceHeightPx,
                    pageCanvasWidthPx: pageCanvas.width,
                    pageCanvasHeightPx: pageCanvas.height,
                    marginPx,
                    drawWidthPx
                });
                pageFrame.appendChild(pageImg);
                pageFrame.appendChild(hotspotLayer);

                pageWrap.appendChild(pageLabel);
                pageWrap.appendChild(pageFrame);
                host.appendChild(pageWrap);

                renderedPx += sliceHeightPx;
                pageNumber += 1;
            }
        } catch (error) {
            console.error('Echec rendu pagine:', error);
            host.innerHTML = '<div class="w-[254px] rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-700 sm:w-[349px] md:w-[476px] lg:w-[635px] xl:w-[794px]">Impossible de generer la previsualisation paginee.</div>';
        } finally {
            if (exportNode && exportNode.parentElement) {
                exportNode.parentElement.removeChild(exportNode);
            }
        }
    }

    resolveDataWithDefaults() {
        const output = { ...this.defaultData };
        Object.keys(this.defaultData).forEach((key) => {
            const incoming = this.data[key];
            if (Array.isArray(incoming) && incoming.length > 0) {
                output[key] = incoming;
            } else if (typeof incoming === 'string' && incoming.trim().length > 0) {
                output[key] = incoming.trim();
            }
        });
        return output;
    }

    setText(key, value) {
        const el = this.querySelector(`[data-preview="${key}"]`);
        if (el) el.textContent = value || '';
    }

    renderList(listKey, items) {
        const list = this.querySelector(`[data-preview-list="${listKey}"]`);
        if (!list) return;
        list.innerHTML = '';
        const stepByList = {
            interests: 'interests',
            languages: 'languages',
            softwares: 'tools'
        };
        const targetStep = stepByList[listKey] || '';
        items.forEach((item) => {
            const li = document.createElement('li');
            if (listKey === 'interests') {
                li.className = 'pv-l-item mb-2 flex items-center justify-center gap-2 break-words text-[14px] leading-[1.6] opacity-90';
                li.setAttribute('data-autofit', '');
                li.setAttribute('data-autofit-min', '8');
            }
            if (targetStep) {
                li.setAttribute('data-edit-step', targetStep);
                li.setAttribute('data-edit-block', '');
                li.classList.add('cursor-pointer');
            }
            li.textContent = item;
            list.appendChild(li);
        });
    }

    splitToItems(value) {
        if (Array.isArray(value)) {
            return value
                .map((item) => (typeof item === 'string' ? item.trim() : ''))
                .filter(Boolean);
        }
        return (value || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    buildExperienceBullets(data) {
        const raw = (data.exp_description || '').trim();
        const parts = raw
            .split(/\n+/)
            .map((s) => s.trim())
            .filter(Boolean);
        if (!parts.length) return ['Description de l experience a renseigner.'];
        return parts.slice(0, 6);
    }

    buildExperienceItems(data) {
        if (Array.isArray(data.experiences) && data.experiences.length) {
            const rows = data.experiences
                .map((item) => {
                    if (!item || typeof item !== 'object') return null;
                    const title = (item.title || '').trim();
                    const organization = (item.organization || '').trim();
                    const location = (item.location || '').trim();
                    const startDate = (item.start_date || '').trim();
                    const endDate = (item.end_date || '').trim();
                    const description = (item.description || '').trim();
                    if (!title && !organization && !location && !startDate && !endDate && !description) return null;
                    return {
                        title,
                        organization,
                        location,
                        dates: this.formatDateRange(startDate, endDate),
                        bullets: this.buildBulletsFromText(description)
                    };
                })
                .filter(Boolean);
            if (rows.length) return rows;
        }

        return [{
            title: (data.exp_title || '').trim() || 'Poste',
            organization: (data.exp_organization || '').trim() || 'Entreprise',
            location: (data.exp_location || '').trim() || 'Lieu',
            dates: this.formatDateRange(data.exp_start_date, data.exp_end_date) || 'Periode',
            bullets: this.buildExperienceBullets(data)
        }];
    }

    buildBulletsFromText(rawText) {
        const parts = (rawText || '')
            .split(/\n+/)
            .map((s) => s.trim())
            .filter(Boolean);
        if (!parts.length) return ['Description de l experience a renseigner.'];
        return parts.slice(0, 6);
    }

    renderExperienceList(items) {
        const list = this.querySelector('[data-preview-list="exp_bullets"]');
        const role = this.querySelector('[data-preview="exp_title"]');
        const org = this.querySelector('[data-preview="exp_organization"]');
        const loc = this.querySelector('[data-preview="exp_location"]');
        const dates = this.querySelector('[data-preview="exp_dates"]');
        if (!list || !role || !org || !loc || !dates) return;

        const first = items[0] || {};
        role.textContent = first.title || 'Poste';
        org.textContent = first.organization || 'Entreprise';
        loc.textContent = first.location || 'Lieu';
        dates.textContent = first.dates || 'Periode';

        const target = role.closest('.pv-exp-content');
        const article = role.closest('.pv-exp-item');
        if (!target || !article) return;

        target.querySelectorAll('.pv-exp-extra').forEach((node) => node.remove());
        list.innerHTML = '';
        (first.bullets || []).forEach((item) => {
            const li = document.createElement('li');
            li.setAttribute('data-edit-step', 'experiences');
            li.setAttribute('data-edit-block', '');
            li.classList.add('cursor-pointer');
            li.textContent = item;
            list.appendChild(li);
        });

        if (items.length > 1) {
            items.slice(1).forEach((item) => {
                const extra = document.createElement('article');
                extra.className = 'pv-exp-item pv-exp-extra mt-3 flex gap-[14px]';
                extra.setAttribute('data-edit-step', 'experiences');
                extra.setAttribute('data-edit-block', '');
                extra.innerHTML = `
                    <div class="pv-exp-date w-[110px] shrink-0 cursor-pointer text-[14px] font-semibold hover:opacity-90" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8">${item.dates || 'Periode'}</div>
                    <div class="pv-exp-content flex-1">
                        <p class="pv-exp-role m-0 cursor-pointer break-words text-[14px] font-semibold uppercase hover:opacity-90" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8">${item.title || 'Poste'}</p>
                        <p class="pv-exp-company m-0 mt-0.5 cursor-pointer break-words text-[14px] font-medium hover:opacity-90" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8">${item.organization || 'Entreprise'} - ${item.location || 'Lieu'}</p>
                        <ul class="pv-exp-list mb-0 mt-2 list-disc pl-[18px] text-[14px] leading-[1.5]" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8"></ul>
                    </div>
                `;
                const bulletList = extra.querySelector('.pv-exp-list');
                (item.bullets || []).forEach((bullet) => {
                    const li = document.createElement('li');
                    li.setAttribute('data-edit-step', 'experiences');
                    li.setAttribute('data-edit-block', '');
                    li.classList.add('cursor-pointer');
                    li.textContent = bullet;
                    bulletList.appendChild(li);
                });
                article.parentElement.appendChild(extra);
            });
        }
    }

    buildInterestItems(data, rawData = {}) {
        if (Object.prototype.hasOwnProperty.call(rawData, 'interests')) {
            const explicitItems = this.splitToItems(rawData.interests);
            return explicitItems.length ? explicitItems : ['Interets a renseigner'];
        }
        const items = this.splitToItems(data.interests);
        return items.length ? items : ['Interets a renseigner'];
    }

    buildEducationItems(data) {
        if (Array.isArray(data.educations) && data.educations.length) {
            const rows = data.educations
                .map((item) => {
                    if (!item || typeof item !== 'object') return '';
                    const dates = this.formatDateRange(item.start_date, item.end_date);
                    const degree = (item.degree || '').trim();
                    const school = (item.school || '').trim();
                    const schoolAddress = (item.school_address || '').trim();
                    return { dates, degree, school, schoolAddress };
                })
                .filter((item) => item.degree || item.school || item.schoolAddress || item.dates);
            if (rows.length) return rows;
        }

        return [];
    }

    renderEducationList(items) {
        const list = this.querySelector('[data-preview-list="educations"]');
        if (!list) return;
        list.innerHTML = '';

        if (!items.length) {
            const li = document.createElement('li');
            li.className = 'pv-edu-li mb-[10px] list-item text-[14px] leading-[1.6]';
            li.setAttribute('data-edit-step', 'educations');
            li.setAttribute('data-edit-block', '');
            li.classList.add('cursor-pointer');
            li.setAttribute('data-autofit', '');
            li.setAttribute('data-autofit-min', '8');
            li.textContent = 'Formations a renseigner';
            list.appendChild(li);
            return;
        }

        items.forEach((item) => {
            const li = document.createElement('li');
            li.className = 'pv-edu-li mb-[10px] list-item break-words text-[14px] leading-[1.6]';
            li.setAttribute('data-edit-step', 'educations');
            li.setAttribute('data-edit-block', '');
            li.classList.add('cursor-pointer');
            li.setAttribute('data-autofit', '');
            li.setAttribute('data-autofit-min', '8');

            let hasContent = false;
            if (item.dates) {
                const dates = document.createElement('span');
                dates.className = 'pv-edu-year font-semibold';
                dates.textContent = item.dates;
                li.appendChild(dates);
                hasContent = true;
            }

            if (item.degree) {
                if (hasContent) li.appendChild(document.createTextNode(' - '));
                const degree = document.createElement('span');
                degree.className = 'pv-edu-degree font-semibold';
                degree.textContent = item.degree;
                li.appendChild(degree);
                hasContent = true;
            }

            if (item.school) {
                if (hasContent) li.appendChild(document.createTextNode(' - '));
                li.appendChild(document.createTextNode(item.school));
                hasContent = true;
            }

            if (item.schoolAddress) {
                if (hasContent) li.appendChild(document.createTextNode(' - '));
                li.appendChild(document.createTextNode(item.schoolAddress));
            }

            list.appendChild(li);
        });
    }

    buildLanguageItems(data) {
        if (Array.isArray(data.languages) && data.languages.length) {
            const rows = data.languages
                .map((item) => {
                    if (!item || typeof item !== 'object') return '';
                    const name = (item.name || '').trim();
                    const level = (item.level || '').trim();
                    if (!name) return '';
                    return level ? `${name} - ${level}` : name;
                })
                .filter(Boolean);
            if (rows.length) return rows;
        }

        return ['Langues a renseigner'];
    }

    buildSoftwareItems(data) {
        if (Array.isArray(data.tools) && data.tools.length) {
            const rows = data.tools
                .map((item) => {
                    if (!item || typeof item !== 'object') return '';
                    const type = (item.type || '').trim();
                    const name = (item.name || '').trim();
                    const level = (item.level || '').trim();
                    if (!name) return '';
                    return { type, text: `${name}${level ? ` (${level})` : ''}` };
                })
                .filter(Boolean);
            if (rows.length) {
                const selectedType = rows[0].type === 'Materiel' ? 'Materiel' : 'Logiciel';
                const filtered = rows.filter((row) => (row.type || 'Logiciel') === selectedType).map((row) => row.text);
                return {
                    title: selectedType === 'Materiel' ? 'Materiels' : 'Logiciels',
                    items: filtered.length ? filtered : ['A renseigner']
                };
            }
        }

        const fromSoftwares = this.splitToItems(data.softwares);
        if (fromSoftwares.length) {
            return {
                title: 'Logiciels',
                items: fromSoftwares
            };
        }

        return {
            title: 'Logiciels',
            items: ['Logiciels a renseigner']
        };
    }

    formatDateRange(start, end) {
        const startVal = start || '';
        const endVal = end || '';
        if (startVal && endVal) return `Debut: ${startVal} | Fin: ${endVal}`;
        if (startVal) return `Debut: ${startVal}`;
        if (endVal) return `Fin: ${endVal}`;
        return '';
    }

    formatPhoneDisplay(data) {
        if (Array.isArray(data.phones) && data.phones.length) {
            return data.phones.join(' / ');
        }
        return data.phoneno || '';
    }

    formatAddressDisplay(data) {
        const line1 = [data.address_number, data.address_street]
            .map((value) => (value || '').trim())
            .filter(Boolean)
            .join(' ');
        const line2 = [data.address_postal, data.address_city]
            .map((value) => (value || '').trim())
            .filter(Boolean)
            .join(' ');
        const country = (data.address_country || '').trim();

        const fromStructured = [line1, line2, country].filter(Boolean).join(', ');
        if (fromStructured) return fromStructured;
        return data.address || '';
    }

    setDownloadLoading(button, loading) {
        if (!button || !(button instanceof HTMLElement)) return;
        if (!button.dataset.defaultHtml) {
            button.dataset.defaultHtml = button.innerHTML;
        }

        button.disabled = loading;
        button.classList.toggle('opacity-70', loading);
        button.classList.toggle('cursor-not-allowed', loading);
        button.innerHTML = loading
            ? '<i class="fa-solid fa-spinner fa-spin"></i>Generation PDF...'
            : (button.dataset.defaultHtml || button.innerHTML);
    }

    async waitForExportAssets(node) {
        if (!node) return;
        const images = Array.from(node.querySelectorAll('img'));
        await Promise.all(images.map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
                const done = () => {
                    img.removeEventListener('load', done);
                    img.removeEventListener('error', done);
                    resolve();
                };
                img.addEventListener('load', done, { once: true });
                img.addEventListener('error', done, { once: true });
            });
        }));

        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }
    }

    async downloadPdf(button) {
        if (this.isDownloading) return;
        const target = this.querySelector('#pv-preview');
        if (!target || typeof window.html2canvas !== 'function' || !window.jspdf?.jsPDF) return;

        this.isDownloading = true;
        this.setDownloadLoading(button, true);

        try {
            const exportWidth = 794;
            const exportNode = target.cloneNode(true);
            exportNode.id = 'pv-preview-export';
            exportNode.style.position = 'fixed';
            exportNode.style.left = '-10000px';
            exportNode.style.top = '0';
            exportNode.style.width = `${exportWidth}px`;
            exportNode.style.height = 'auto';
            exportNode.style.transform = 'none';
            exportNode.style.transformOrigin = 'top left';
            exportNode.style.maxWidth = 'none';
            exportNode.style.maxHeight = 'none';
            exportNode.style.pointerEvents = 'none';
            exportNode.style.zIndex = '-1';
            document.body.appendChild(exportNode);

            await this.waitForExportAssets(exportNode);
            const contentHeight = Math.max(exportNode.scrollHeight, exportNode.offsetHeight, 1123);
            exportNode.style.height = `${contentHeight}px`;
            const textOccupancy = this.collectTextRowOccupancy(exportNode, contentHeight);

            const canvas = await window.html2canvas(exportNode, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                width: exportWidth,
                height: contentHeight,
                windowWidth: exportWidth,
                windowHeight: contentHeight,
                scrollX: 0,
                scrollY: 0,
                onclone: (doc) => {
                    const exportRoot = doc.querySelector('#pv-preview-export') || doc.querySelector('#pv-preview');
                    if (exportRoot && exportRoot.style) {
                        exportRoot.style.transform = 'none';
                        exportRoot.style.transformOrigin = 'top left';
                        exportRoot.style.width = `${exportWidth}px`;
                        exportRoot.style.height = `${contentHeight}px`;
                    }
                    const photo = doc.querySelector('.pv-photo');
                    if (photo && photo.style) {
                        photo.style.display = 'block';
                        photo.style.width = '100%';
                        photo.style.height = '250px';
                        photo.style.objectFit = 'cover';
                        photo.style.objectPosition = 'center center';
                    }
                }
            });

            if (exportNode.parentElement) {
                exportNode.parentElement.removeChild(exportNode);
            }

            const pdf = new window.jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            const marginMm = 6;
            const pageWidthMm = 210;
            const pageHeightMm = 297;
            const contentWidthMm = pageWidthMm - (marginMm * 2);
            const contentHeightMm = pageHeightMm - (marginMm * 2);
            const pageHeightPx = Math.floor((contentHeightMm / contentWidthMm) * canvas.width);
            const slices = this.buildPageSlices(canvas, pageHeightPx, textOccupancy);
            let renderedPx = 0;
            let pageIndex = 0;
            for (const sliceHeightPx of slices) {
                const sliceCanvas = document.createElement('canvas');
                sliceCanvas.width = canvas.width;
                sliceCanvas.height = sliceHeightPx;
                const ctx = sliceCanvas.getContext('2d');
                if (!ctx) throw new Error('Contexte canvas indisponible pour export PDF.');

                ctx.drawImage(
                    canvas,
                    0,
                    renderedPx,
                    canvas.width,
                    sliceHeightPx,
                    0,
                    0,
                    canvas.width,
                    sliceHeightPx
                );

                const pageImage = sliceCanvas.toDataURL('image/png', 1.0);
                if (pageIndex > 0) {
                    pdf.addPage();
                }
                const renderHeightMm = (sliceHeightPx / canvas.width) * contentWidthMm;
                pdf.addImage(pageImage, 'PNG', marginMm, marginMm, contentWidthMm, renderHeightMm);

                renderedPx += sliceHeightPx;
                pageIndex += 1;
            }
            pdf.save('mon-cv.pdf');
        } catch (error) {
            console.error('Echec export PDF:', error);
        } finally {
            const staleNode = document.querySelector('#pv-preview-export');
            if (staleNode && staleNode.parentElement) {
                staleNode.parentElement.removeChild(staleNode);
            }
            this.isDownloading = false;
            this.setDownloadLoading(button, false);
        }
    }

    applyTextAutoFit() {
        const preview = this.querySelector('#pv-preview');
        if (!preview) return;

        const targets = Array.from(preview.querySelectorAll('[data-autofit]'));
        targets.forEach((el) => this.resetAutoFit(el));
        const boxes = Array.from(preview.querySelectorAll('[data-autofit-box]'));
        boxes.forEach((box) => this.fitContainerText(box));
        this.fitContainerText(preview);
    }

    resetAutoFit(el) {
        if (!el) return;
        if (!el.dataset.baseFontSize) {
            const computed = window.getComputedStyle(el);
            el.dataset.baseFontSize = computed.fontSize;
            el.dataset.baseLineHeight = computed.lineHeight;
        }
        el.style.fontSize = el.dataset.baseFontSize;
        el.style.lineHeight = el.dataset.baseLineHeight;
    }

    shrinkTextStep(el) {
        if (!el) return false;
        const computed = window.getComputedStyle(el);
        const currentSize = parseFloat(computed.fontSize || '0');
        const minSize = parseFloat(el.getAttribute('data-autofit-min') || '8');
        if (!currentSize || currentSize <= minSize) return false;

        const nextSize = Math.max(minSize, currentSize - 0.35);
        if (nextSize >= currentSize) return false;
        el.style.fontSize = `${nextSize}px`;

        const currentLineHeight = parseFloat(computed.lineHeight || '0');
        if (currentLineHeight && Number.isFinite(currentLineHeight)) {
            const ratio = currentLineHeight / currentSize;
            const nextLineHeight = Math.max(nextSize * 1.1, nextSize * ratio);
            el.style.lineHeight = `${nextLineHeight}px`;
        }
        return true;
    }

    fitContainerText(container) {
        if (!container) return;
        const targets = Array.from(container.querySelectorAll('[data-autofit]'));
        if (!targets.length) return;

        let guard = 0;
        while (this.isOverflowing(container) && guard < 60) {
            let changed = false;
            targets.forEach((el) => {
                if (this.shrinkTextStep(el)) changed = true;
            });
            if (!changed) break;
            guard += 1;
        }
    }

    isOverflowing(el) {
        if (!el) return false;
        return el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
    }
}

if (!customElements.get('previsualisation-cv')) {
    customElements.define('previsualisation-cv', PrevisualisationCV);
}
