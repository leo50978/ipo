import { playUiSound } from './ui-sound.js';

class BuilderCV extends HTMLElement {
    constructor() {
        super();
        this.initialized = false;
        this.profileMinChars = 120;
        this.profileMaxChars = 400;
        this.experienceDescriptionMaxChars = 200;
        this.charLimits = {
            firstname: 30,
            middlename: 30,
            lastname: 40,
            designation: 20,
            email: 80,
            phone: 25,
            addressNumber: 12,
            addressStreet: 80,
            addressPostal: 12,
            addressCity: 40,
            addressCountry: 40,
            interest: 55,
            languageName: 40,
            toolName: 45,
            educationDegree: 90,
            educationSchool: 90,
            educationAddress: 110,
            experienceTitle: 70,
            experienceOrganization: 80,
            experienceLocation: 50
        };
        this.fieldSteps = [
            { name: 'firstname', label: 'Prenom', type: 'text', hint: 'Ton prenom.' },
            { name: 'middlename', label: 'Deuxieme prenom', type: 'text', hint: 'Optionnel.' },
            { name: 'lastname', label: 'Nom', type: 'text', hint: 'Ton nom de famille.' },
            { name: 'designation', label: 'Metier', type: 'text', hint: 'Ex: Frontend Developer.' },
            { name: 'email', label: 'Email', type: 'email', hint: 'Ex: toi@email.com' },
            { name: 'phones', label: 'Numeros de telephone', type: 'multi-phone', hint: 'Ajoute 1 ou 2 numeros de telephone.' },
            { name: 'address', label: 'Adresse complete', type: 'address-fields', hint: 'Renseigne chaque partie de ton adresse.' },
            { name: 'summary', label: 'Resume', type: 'textarea', hint: '3 a 5 lignes sur ton profil. Minimum 120 caracteres, maximum 400.' },
            { name: 'image', label: 'Photo de profil', type: 'file', accept: 'image/*', hint: 'Format JPG ou PNG.' },
            { name: 'experiences', label: 'Experiences professionnelles', type: 'multi-experience', hint: 'Ajoute une ou plusieurs experiences. Description limitee a 200 caracteres.' },
            { name: 'educations', label: 'Formations', type: 'multi-education', hint: 'Ajoute chaque formation avec date debut/fin, nom de formation, ecole et adresse de lecole.' },
            { name: 'languages', label: 'Langues et niveau', type: 'multi-language', hint: 'Ajoute les langues que tu maitrises avec un niveau: Bien ou Tres bien.' },
            { name: 'tools', label: 'Logiciels ou materiels utilises', type: 'multi-tool', hint: 'Ajoute plusieurs elements avec type (logiciel/materiel) et niveau (amateur/intermediaire/expert).' },
            { name: 'interests', label: 'Centres d interet', type: 'multi-interest', hint: 'Ajoute autant de centres d interet que tu veux avec le bouton +.' }
        ];
        this.steps = this.fieldSteps.map((item) => item.name);
        this.currentStep = 0;
        this.imageDataUrl = '';
        this.isCompleted = false;
        this.showTipsIntro = true;
    }

    async connectedCallback() {
        if (this.initialized) return;
        this.initialized = true;

        await this.ensureDependencies();
        this.render();
        this.bindEvents();
        this.updateStepUi();
    }

    async ensureDependencies() {
        await Promise.all([
            this.loadScript('https://cdn.tailwindcss.com', 'cvb-tailwind'),
            this.loadStylesheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css', 'cvb-fa')
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
        const questionSteps = this.fieldSteps.map((step, index) => this.renderQuestionStep(step, index)).join('');

        this.innerHTML = `
            <section class="cvb-app relative isolate h-screen overflow-hidden p-6 text-slate-900">
                ${this.renderAnimatedBackground()}
                <div class="cvb-layer relative z-[2] h-full">
                    ${questionSteps}
                </div>
                <section class="cvb-onboarding absolute inset-0 z-[4] flex items-center justify-center bg-slate-950/60 p-5 backdrop-blur-sm ${this.showTipsIntro ? '' : 'hidden'}" data-onboarding>
                    <article class="cvb-onboarding-card w-full max-w-[760px] rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-2xl">
                        <h3 class="cvb-onboarding-title mb-2 text-2xl font-extrabold text-slate-900">Conseils importants avant de commencer</h3>
                        <p class="cvb-onboarding-text text-slate-800">Chaque question contient une icone <strong>tips</strong>. Clique dessus pour voir des conseils ultra importants qui t'aident a remplir correctement tous les champs (photo, experiences, formations, etc.).</p>
                        <div class="mt-4 flex justify-end">
                            <button type="button" class="cvb-btn cvb-btn-primary inline-flex min-h-12 items-center gap-2 rounded-xl bg-sky-700 px-4 py-3 font-bold text-white hover:bg-sky-800" data-action="start-flow">
                                Compris, commencer <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </article>
                </section>
            </section>
        `;
    }

    renderAnimatedBackground() {
        const letters = [
            ['C', 'left-[10%] top-[12%] text-[4.3rem]'],
            ['V', 'left-[24%] top-[28%] text-[3.1rem]'],
            ['R', 'left-[72%] top-[18%] text-[2.8rem]'],
            ['E', 'left-[82%] top-[35%] text-[4.5rem]'],
            ['S', 'left-[58%] top-[72%] text-[3.7rem]'],
            ['U', 'left-[16%] top-[76%] text-[3.4rem]'],
            ['M', 'left-[36%] top-[58%] text-[5.2rem]'],
            ['E', 'left-[63%] top-[48%] text-[2.9rem]'],
            ['C', 'left-[90%] top-[72%] text-[3.8rem]'],
            ['V', 'left-[6%] top-[52%] text-[2.6rem]']
        ];

        const nodes = letters.map(([char, cls]) =>
            `<span class="absolute ${cls} font-extrabold text-sky-200/25 animate-pulse">${char}</span>`
        ).join('');

        return `<div class="cvb-animated-bg pointer-events-none absolute inset-0 z-[1] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" aria-hidden="true">${nodes}</div>`;
    }

    renderQuestionStep(step, index) {
        const inputControl = this.renderInputControl(step);
        const quickPreviewBtn = index === 0
            ? `<button type="button" class="cvb-btn cvb-btn-muted inline-flex min-h-12 items-center gap-2 rounded-xl bg-slate-200 px-4 py-3 font-bold text-slate-900 hover:bg-slate-300" data-action="quick-preview">
                    <i class="fa-solid fa-eye"></i>Previsualisation directe
               </button>`
            : '';

        return `
            <section class="cvb-step hidden h-full items-start justify-center overflow-y-auto py-4" data-step="${step.name}">
                <div class="cvb-card max-h-[calc(100vh-4rem)] w-full max-w-[900px] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl md:p-10">
                    <div class="mb-6 flex items-center justify-between gap-3">
                        <p class="text-sm font-semibold text-sky-700">Question ${index + 1}</p>
                        <button type="button" class="cvb-btn cvb-btn-muted inline-flex min-h-12 items-center gap-2 rounded-xl bg-slate-200 px-4 py-3 font-bold text-slate-900 hover:bg-slate-300" data-action="close-builder">
                            <i class="fa-solid fa-xmark"></i>Quitter
                        </button>
                    </div>

                    <div class="mb-6">
                        <div class="cvb-progress h-[10px] overflow-hidden rounded-full bg-slate-200"><div class="cvb-progress-fill h-full w-0 bg-gradient-to-r from-sky-600 to-sky-400 transition-all duration-200" data-progress-fill></div></div>
                        <p class="mt-2 text-sm font-medium text-slate-600" data-step-indicator></p>
                    </div>

                    <label class="block">
                        <span class="mb-2 flex items-center justify-between gap-3">
                            <span class="block text-3xl font-bold text-slate-900">${step.label}</span>
                            <button type="button" class="cvb-tip inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-200 bg-sky-100 text-blue-700 hover:bg-sky-200" data-action="open-tip" data-tip-field="${step.name}" data-tip-label="${step.label}" aria-label="Voir des conseils">
                                <i class="fa-solid fa-circle-question"></i>
                            </button>
                        </span>
                        <span class="mb-5 block text-base text-slate-600">${step.hint}</span>
                        ${inputControl}
                        ${step.name === 'summary' ? `<p class="mt-2 text-sm text-slate-500">Caractères: <span data-summary-count>0</span> / ${this.profileMaxChars}</p>` : ''}
                        <p class="cvb-error mt-2 min-h-[1.1rem] text-sm text-red-700" data-step-error></p>
                    </label>

                    <div class="mt-8 flex items-center justify-between gap-3">
                        <button type="button" class="cvb-btn cvb-btn-muted inline-flex min-h-12 items-center gap-2 rounded-xl bg-slate-200 px-4 py-3 font-bold text-slate-900 hover:bg-slate-300" data-action="prev">
                            <i class="fa-solid fa-arrow-left"></i>Precedent
                        </button>
                        <div class="flex items-center gap-2">
                            <button type="button" class="cvb-btn cvb-btn-preview hidden inline-flex min-h-12 items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800" data-action="go-preview">
                                <i class="fa-solid fa-file-lines"></i>Aller a la previsualisation
                            </button>
                            ${quickPreviewBtn}
                            <button type="button" class="cvb-btn cvb-btn-primary inline-flex min-h-12 items-center gap-2 rounded-xl bg-sky-700 px-4 py-3 font-bold text-white hover:bg-sky-800" data-action="next">
                                Suivant<i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    renderInputControl(step) {
        if (step.type === 'textarea') {
            const attrs = step.name === 'summary'
                ? ` minlength="${this.profileMinChars}" maxlength="${this.profileMaxChars}"`
                : '';
            return `<textarea name="${step.name}" class="cvb-textarea min-h-[140px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" placeholder="Saisis ${step.label.toLowerCase()}"${attrs}></textarea>`;
        }

        if (step.type === 'multi-phone') {
            return `
                <div class="cvb-repeat-wrap grid gap-3" data-repeat-group="phones" data-max="2">
                    ${this.repeatPhoneItem()}
                </div>
                <div class="cvb-repeat-actions mt-2 flex items-center justify-between gap-2">
                    <span class="text-sm text-slate-500">Maximum 2 numeros.</span>
                    <button type="button" class="cvb-add inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-700 text-white hover:bg-sky-800" data-action="add-repeat" data-group="phones" aria-label="Ajouter un numero"><i class="fa-solid fa-plus"></i></button>
                </div>
            `;
        }

        if (step.type === 'multi-interest') {
            return `
                <div class="cvb-repeat-wrap grid gap-3" data-repeat-group="interests" data-max="3">
                    ${this.repeatInterestItem()}
                </div>
                <div class="cvb-repeat-actions mt-2 flex items-center justify-between gap-2">
                    <span class="text-sm text-slate-500">Maximum 3 centres d interet.</span>
                    <button type="button" class="cvb-add inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-700 text-white hover:bg-sky-800" data-action="add-repeat" data-group="interests" aria-label="Ajouter un interet"><i class="fa-solid fa-plus"></i></button>
                </div>
            `;
        }

        if (step.type === 'multi-language') {
            return `
                <div class="cvb-repeat-wrap grid gap-3" data-repeat-group="languages">
                    ${this.repeatLanguageItem()}
                </div>
                <div class="cvb-repeat-actions mt-2 flex items-center justify-between gap-2">
                    <span class="text-sm text-slate-500">Niveau disponible: Bien ou Tres bien.</span>
                    <button type="button" class="cvb-add inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-700 text-white hover:bg-sky-800" data-action="add-repeat" data-group="languages" aria-label="Ajouter une langue"><i class="fa-solid fa-plus"></i></button>
                </div>
            `;
        }

        if (step.type === 'multi-tool') {
            return `
                <div class="cvb-repeat-wrap grid gap-3" data-repeat-group="tools">
                    ${this.repeatToolItem()}
                </div>
                <div class="cvb-repeat-actions mt-2 flex items-center justify-between gap-2">
                    <span class="text-sm text-slate-500">Type: Logiciel ou Materiel. Niveau: Amateur, Intermediaire, Expert.</span>
                    <button type="button" class="cvb-add inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-700 text-white hover:bg-sky-800" data-action="add-repeat" data-group="tools" aria-label="Ajouter un outil"><i class="fa-solid fa-plus"></i></button>
                </div>
            `;
        }

        if (step.type === 'multi-education') {
            return `
                <div class="cvb-repeat-wrap grid gap-3" data-repeat-group="educations">
                    ${this.repeatEducationItem()}
                </div>
                <div class="cvb-repeat-actions mt-2 flex items-center justify-between gap-2">
                    <span class="text-sm text-slate-500">Ajoute autant de formations que necessaire.</span>
                    <button type="button" class="cvb-add inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-700 text-white hover:bg-sky-800" data-action="add-repeat" data-group="educations" aria-label="Ajouter une formation"><i class="fa-solid fa-plus"></i></button>
                </div>
            `;
        }

        if (step.type === 'multi-experience') {
            return `
                <div class="cvb-repeat-wrap grid gap-3" data-repeat-group="experiences">
                    ${this.repeatExperienceItem()}
                </div>
                <div class="cvb-repeat-actions mt-2 flex items-center justify-between gap-2">
                    <span class="text-sm text-slate-500">Description max ${this.experienceDescriptionMaxChars} caracteres.</span>
                    <button type="button" class="cvb-add inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-700 text-white hover:bg-sky-800" data-action="add-repeat" data-group="experiences" aria-label="Ajouter une experience"><i class="fa-solid fa-plus"></i></button>
                </div>
            `;
        }

        if (step.type === 'address-fields') {
            return `
                <div class="cvb-repeat-item grid gap-2 rounded-xl border border-slate-300 bg-slate-50 p-3">
                    <div class="cvb-repeat-grid-2 grid grid-cols-2 gap-2">
                        <input type="text" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-address="number" placeholder="Numero d adresse">
                        <input type="text" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-address="street" placeholder="Rue / Avenue / Boulevard">
                    </div>
                    <div class="cvb-repeat-grid-2 grid grid-cols-2 gap-2">
                        <input type="text" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-address="postal" placeholder="Code postal">
                        <input type="text" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-address="city" placeholder="Ville">
                    </div>
                    <input type="text" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-address="country" placeholder="Pays">
                </div>
            `;
        }

        const inputMaxLength = this.charLimits[step.name];
        const maxLengthAttr = Number.isFinite(inputMaxLength) ? ` maxlength="${inputMaxLength}"` : '';
        return `<input name="${step.name}" type="${step.type}" ${step.accept ? `accept="${step.accept}"` : ''}${maxLengthAttr} class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" placeholder="${step.type === 'file' ? '' : `Saisis ${step.label.toLowerCase()}`}" />`;
    }

    repeatPhoneItem() {
        return `
            <div class="cvb-repeat-item grid gap-2 rounded-xl border border-slate-300 bg-slate-50 p-3">
                <input type="text" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="value" placeholder="Numero de telephone">
                <button type="button" class="cvb-btn-icon inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" data-action="remove-repeat" aria-label="Supprimer"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
    }

    repeatInterestItem() {
        return `
            <div class="cvb-repeat-item grid gap-2 rounded-xl border border-slate-300 bg-slate-50 p-3">
                <input type="text" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="value" placeholder="Centre d interet">
                <button type="button" class="cvb-btn-icon inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" data-action="remove-repeat" aria-label="Supprimer"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
    }

    repeatLanguageItem() {
        return `
            <div class="cvb-repeat-item grid gap-2 rounded-xl border border-slate-300 bg-slate-50 p-3">
                <div class="cvb-repeat-grid-2 grid grid-cols-2 gap-2">
                    <input type="text" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="name" placeholder="Langue">
                    <select class="cvb-select min-h-[52px] w-full rounded-xl border border-slate-400 bg-white px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="level">
                        <option value="Bien">Bien</option>
                        <option value="Tres bien">Tres bien</option>
                    </select>
                </div>
                <button type="button" class="cvb-btn-icon inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" data-action="remove-repeat" aria-label="Supprimer"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
    }

    repeatToolItem() {
        return `
            <div class="cvb-repeat-item grid gap-2 rounded-xl border border-slate-300 bg-slate-50 p-3">
                <div class="cvb-repeat-grid-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <select class="cvb-select min-h-[52px] w-full rounded-xl border border-slate-400 bg-white px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="type">
                        <option value="Logiciel">Logiciel</option>
                        <option value="Materiel">Materiel</option>
                    </select>
                    <input type="text" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="name" placeholder="Nom">
                </div>
                <select class="cvb-select min-h-[52px] w-full rounded-xl border border-slate-400 bg-white px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="level">
                    <option value="Amateur">Amateur</option>
                    <option value="Intermediaire">Intermediaire</option>
                    <option value="Expert">Expert</option>
                </select>
                <button type="button" class="cvb-btn-icon inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" data-action="remove-repeat" aria-label="Supprimer"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
    }

    repeatEducationItem() {
        return `
            <div class="cvb-repeat-item grid gap-2 rounded-xl border border-slate-300 bg-slate-50 p-3">
                <div class="cvb-repeat-grid-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input type="date" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="start_date" placeholder="Date debut">
                    <input type="date" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="end_date" placeholder="Date fin">
                </div>
                <input type="text" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="degree" placeholder="Nom de la formation">
                <input type="text" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="school" placeholder="Nom de l ecole">
                <input type="text" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="school_address" placeholder="Adresse de l ecole">
                <button type="button" class="cvb-btn-icon inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" data-action="remove-repeat" aria-label="Supprimer"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
    }

    repeatExperienceItem() {
        return `
            <div class="cvb-repeat-item grid gap-2 rounded-xl border border-slate-300 bg-slate-50 p-3">
                <div class="cvb-repeat-grid-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input type="text" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="title" placeholder="Poste">
                    <input type="text" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="organization" placeholder="Entreprise">
                </div>
                <input type="text" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="location" placeholder="Lieu de travail">
                <div class="cvb-repeat-grid-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input type="date" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="start_date" placeholder="Date debut">
                    <input type="date" class="cvb-input min-h-[52px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="end_date" placeholder="Date fin">
                </div>
                <textarea class="cvb-textarea min-h-[120px] w-full rounded-xl border border-slate-400 px-4 py-3 text-base outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-200/70" data-key="description" maxlength="${this.experienceDescriptionMaxChars}" placeholder="Description experience (missions, resultats, responsabilites)"></textarea>
                <button type="button" class="cvb-btn-icon inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" data-action="remove-repeat" aria-label="Supprimer"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
    }

    bindEvents() {
        this.addEventListener('change', (event) => {
            if (event.target.name === 'image') {
                this.updateImageData(event.target.files[0]);
            }
        });

        this.addEventListener('input', () => {
            const summary = this.querySelector('[name="summary"]');
            const counter = this.querySelector('[data-summary-count]');
            if (summary && counter) counter.textContent = String(summary.value.length);
        });

        this.addEventListener('click', (event) => {
            if (event.target.closest('[data-action="next"]')) {
                if (!this.validateCurrentStep()) return;
                if (this.currentStep === this.steps.length - 1) {
                    playUiSound('finish');
                    this.isCompleted = true;
                    this.dispatchEvent(new CustomEvent('builder-finished', {
                        bubbles: true,
                        detail: this.collectData()
                    }));
                } else {
                    playUiSound('next');
                    this.currentStep += 1;
                    this.updateStepUi();
                }
                return;
            }

            if (event.target.closest('[data-action="prev"]')) {
                playUiSound('prev');
                this.currentStep = Math.max(this.currentStep - 1, 0);
                this.updateStepUi();
                return;
            }

            if (event.target.closest('[data-action="close-builder"]')) {
                playUiSound('close');
                this.dispatchEvent(new CustomEvent('close-builder', { bubbles: true }));
                return;
            }

            if (event.target.closest('[data-action="quick-preview"]')) {
                if (!this.validateCurrentStep()) return;
                playUiSound('finish');
                this.dispatchEvent(new CustomEvent('builder-finished', {
                    bubbles: true,
                    detail: this.collectData()
                }));
                return;
            }

            if (event.target.closest('[data-action="go-preview"]')) {
                playUiSound('finish');
                this.dispatchEvent(new CustomEvent('builder-finished', {
                    bubbles: true,
                    detail: this.collectData()
                }));
                return;
            }

            if (event.target.closest('[data-action="start-flow"]')) {
                playUiSound('next');
                this.showTipsIntro = false;
                this.updateOnboardingUi();
                return;
            }

            const tipBtn = event.target.closest('[data-action="open-tip"]');
            if (tipBtn) {
                playUiSound('tip');
                const field = tipBtn.getAttribute('data-tip-field') || '';
                const label = tipBtn.getAttribute('data-tip-label') || '';
                this.dispatchEvent(new CustomEvent('open-tip', {
                    bubbles: true,
                    detail: { field, label }
                }));
                return;
            }

            const addBtn = event.target.closest('[data-action="add-repeat"]');
            if (addBtn) {
                playUiSound('add');
                this.addRepeatItem(addBtn.getAttribute('data-group'));
                return;
            }

            const removeBtn = event.target.closest('[data-action="remove-repeat"]');
            if (removeBtn) {
                playUiSound('remove');
                this.removeRepeatItem(removeBtn);
            }
        });
    }

    addRepeatItem(group) {
        const container = this.querySelector(`[data-repeat-group="${group}"]`);
        if (!container) return;

        const max = Number(container.getAttribute('data-max') || '0');
        if (max && container.children.length >= max) return;

        let template = '';
        if (group === 'phones') template = this.repeatPhoneItem();
        if (group === 'interests') template = this.repeatInterestItem();
        if (group === 'languages') template = this.repeatLanguageItem();
        if (group === 'tools') template = this.repeatToolItem();
        if (group === 'educations') template = this.repeatEducationItem();
        if (group === 'experiences') template = this.repeatExperienceItem();
        if (!template) return;

        container.insertAdjacentHTML('beforeend', template);
        this.refreshRepeatControls();
    }

    removeRepeatItem(button) {
        const item = button.closest('.cvb-repeat-item');
        const container = item ? item.parentElement : null;
        if (!item || !container) return;
        if (container.children.length === 1) return;
        item.remove();
        this.refreshRepeatControls();
    }

    validateCurrentStep() {
        const stepName = this.steps[this.currentStep];
        const step = this.querySelector(`.cvb-step[data-step="${stepName}"]`);
        if (!step) return true;
        const error = step.querySelector('[data-step-error]');
        if (!error) return true;
        error.textContent = '';

        if (stepName === 'summary') {
            const summary = step.querySelector('[name="summary"]');
            const length = summary ? summary.value.trim().length : 0;
            if (length < this.profileMinChars || length > this.profileMaxChars) {
                error.textContent = `Le profil doit contenir entre ${this.profileMinChars} et ${this.profileMaxChars} caracteres.`;
                return false;
            }
        }

        if (stepName === 'designation') {
            const designation = step.querySelector('[name="designation"]');
            const length = designation ? designation.value.trim().length : 0;
            if (length > this.charLimits.designation) {
                error.textContent = `Le metier doit contenir au maximum ${this.charLimits.designation} caracteres.`;
                return false;
            }
        }

        if (stepName === 'experiences') {
            const rows = Array.from(step.querySelectorAll('[data-repeat-group="experiences"] .cvb-repeat-item'));
            for (const row of rows) {
                const description = (row.querySelector('[data-key="description"]')?.value || '').trim();
                if (description.length > this.experienceDescriptionMaxChars) {
                    error.textContent = `Chaque description d experience doit contenir au maximum ${this.experienceDescriptionMaxChars} caracteres.`;
                    return false;
                }
            }
        }

        if (stepName === 'tools') {
            const types = Array.from(step.querySelectorAll('[data-repeat-group="tools"] .cvb-repeat-item [data-key="type"]'))
                .map((el) => (el.value || '').trim())
                .filter(Boolean);
            const uniqueTypes = Array.from(new Set(types));
            if (uniqueTypes.length > 1) {
                error.textContent = 'Choisis un seul type: soit Logiciel, soit Materiel.';
                return false;
            }
        }

        return true;
    }

    updateStepUi() {
        const stepName = this.steps[this.currentStep];
        const total = this.steps.length;
        const progress = ((this.currentStep + 1) / total) * 100;

        this.querySelectorAll('.cvb-step').forEach((step) => {
            const isActive = step.getAttribute('data-step') === stepName;
            step.classList.toggle('hidden', !isActive);
            step.classList.toggle('flex', isActive);

            const prevBtn = step.querySelector('[data-action="prev"]');
            const nextBtn = step.querySelector('[data-action="next"]');
            const indicator = step.querySelector('[data-step-indicator]');
            const progressFill = step.querySelector('[data-progress-fill]');
            const goPreviewBtn = step.querySelector('[data-action="go-preview"]');

            if (prevBtn) {
                prevBtn.disabled = this.currentStep === 0;
                prevBtn.classList.toggle('opacity-50', this.currentStep === 0);
            }

            if (nextBtn) {
                const isLast = this.currentStep === total - 1;
                nextBtn.innerHTML = isLast
                    ? 'Terminer <i class="fa-solid fa-check"></i>'
                    : 'Suivant<i class="fa-solid fa-arrow-right"></i>';
            }
            if (goPreviewBtn) {
                goPreviewBtn.classList.toggle('hidden', !this.isCompleted);
            }

            if (indicator) indicator.textContent = `Etape ${this.currentStep + 1} sur ${total}`;
            if (progressFill) progressFill.style.width = `${progress}%`;
        });
        this.refreshRepeatControls();
        this.updateOnboardingUi();
    }

    updateOnboardingUi() {
        const onboarding = this.querySelector('[data-onboarding]');
        if (!onboarding) return;
        onboarding.classList.toggle('hidden', !this.showTipsIntro);
    }

    refreshRepeatControls() {
        this.querySelectorAll('[data-action="add-repeat"]').forEach((button) => {
            const group = button.getAttribute('data-group');
            const container = group ? this.querySelector(`[data-repeat-group="${group}"]`) : null;
            if (!container) return;

            const max = Number(container.getAttribute('data-max') || '0');
            const shouldDisable = max > 0 && container.children.length >= max;
            button.disabled = shouldDisable;
            button.classList.toggle('opacity-50', shouldDisable);
            button.classList.toggle('cursor-not-allowed', shouldDisable);
        });
    }

    updateImageData(file) {
        if (!file) {
            this.imageDataUrl = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            this.imageDataUrl = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    collectData() {
        const data = {};
        this.fieldSteps.forEach((step) => {
            if (step.type === 'file') {
                data[step.name] = this.imageDataUrl || '';
                return;
            }

            if (step.type === 'multi-phone') {
                const values = Array.from(this.querySelectorAll('[data-repeat-group="phones"] .cvb-repeat-item [data-key="value"]'))
                    .map((el) => el.value.trim())
                    .filter(Boolean);
                data.phones = values;
                data.phoneno = values[0] || '';
                return;
            }

            if (step.type === 'multi-interest') {
                const values = Array.from(this.querySelectorAll('[data-repeat-group="interests"] .cvb-repeat-item [data-key="value"]'))
                    .map((el) => el.value.trim())
                    .filter(Boolean);
                data.interests = values;
                return;
            }

            if (step.type === 'multi-language') {
                const items = Array.from(this.querySelectorAll('[data-repeat-group="languages"] .cvb-repeat-item'))
                    .map((row) => ({
                        name: (row.querySelector('[data-key="name"]')?.value || '').trim(),
                        level: (row.querySelector('[data-key="level"]')?.value || '').trim()
                    }))
                    .filter((item) => item.name);
                data.languages = items;
                return;
            }

            if (step.type === 'multi-tool') {
                const items = Array.from(this.querySelectorAll('[data-repeat-group="tools"] .cvb-repeat-item'))
                    .map((row) => ({
                        type: (row.querySelector('[data-key="type"]')?.value || '').trim(),
                        name: (row.querySelector('[data-key="name"]')?.value || '').trim(),
                        level: (row.querySelector('[data-key="level"]')?.value || '').trim()
                    }))
                    .filter((item) => item.name);
                data.tools = items;
                data.softwares = items.filter((item) => item.type === 'Logiciel').map((item) => item.name).join(', ');
                return;
            }

            if (step.type === 'multi-education') {
                const items = Array.from(this.querySelectorAll('[data-repeat-group="educations"] .cvb-repeat-item'))
                    .map((row) => ({
                        start_date: (row.querySelector('[data-key="start_date"]')?.value || '').trim(),
                        end_date: (row.querySelector('[data-key="end_date"]')?.value || '').trim(),
                        degree: (row.querySelector('[data-key="degree"]')?.value || '').trim(),
                        school: (row.querySelector('[data-key="school"]')?.value || '').trim(),
                        school_address: (row.querySelector('[data-key="school_address"]')?.value || '').trim()
                    }))
                    .filter((item) => item.degree || item.school || item.school_address || item.start_date || item.end_date);
                data.educations = items;
                return;
            }

            if (step.type === 'multi-experience') {
                const items = Array.from(this.querySelectorAll('[data-repeat-group="experiences"] .cvb-repeat-item'))
                    .map((row) => ({
                        title: (row.querySelector('[data-key="title"]')?.value || '').trim(),
                        organization: (row.querySelector('[data-key="organization"]')?.value || '').trim(),
                        location: (row.querySelector('[data-key="location"]')?.value || '').trim(),
                        start_date: (row.querySelector('[data-key="start_date"]')?.value || '').trim(),
                        end_date: (row.querySelector('[data-key="end_date"]')?.value || '').trim(),
                        description: (row.querySelector('[data-key="description"]')?.value || '').trim()
                    }))
                    .filter((item) => item.title || item.organization || item.location || item.start_date || item.end_date || item.description);

                data.experiences = items;
                const first = items[0] || {};
                data.exp_title = first.title || '';
                data.exp_organization = first.organization || '';
                data.exp_location = first.location || '';
                data.exp_start_date = first.start_date || '';
                data.exp_end_date = first.end_date || '';
                data.exp_description = first.description || '';
                return;
            }

            if (step.type === 'address-fields') {
                const number = (this.querySelector('[data-address="number"]')?.value || '').trim();
                const street = (this.querySelector('[data-address="street"]')?.value || '').trim();
                const postal = (this.querySelector('[data-address="postal"]')?.value || '').trim();
                const city = (this.querySelector('[data-address="city"]')?.value || '').trim();
                const country = (this.querySelector('[data-address="country"]')?.value || '').trim();

                data.address_number = number;
                data.address_street = street;
                data.address_postal = postal;
                data.address_city = city;
                data.address_country = country;

                const line1 = [number, street].filter(Boolean).join(' ');
                const line2 = [postal, city].filter(Boolean).join(' ');
                data.address = [line1, line2, country].filter(Boolean).join(', ');
                return;
            }

            const el = this.querySelector(`[name="${step.name}"]`);
            if (!el) return;
            data[step.name] = el.value.trim();
        });
        return data;
    }

    resetFlow() {
        this.currentStep = 0;
        this.isCompleted = false;
        this.showTipsIntro = true;
        this.updateStepUi();
    }

    openStep(stepName) {
        const idx = this.steps.indexOf(stepName);
        if (idx === -1) return;
        this.currentStep = idx;
        this.showTipsIntro = false;
        this.updateStepUi();
        this.focusCurrentStepField(stepName);
    }

    focusCurrentStepField(stepName) {
        const step = this.querySelector(`.cvb-step[data-step="${stepName}"]`);
        if (!step) return;

        const field = step.querySelector('textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled])');
        if (!(field instanceof HTMLElement)) return;

        requestAnimationFrame(() => {
            try {
                field.focus({ preventScroll: true });
            } catch (error) {
                field.focus();
            }
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
}

if (!customElements.get('builder-cv')) {
    customElements.define('builder-cv', BuilderCV);
}
