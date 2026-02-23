import { listTipsByField } from './firebase-init.js';

class TipsModal extends HTMLElement {
    constructor() {
        super();
        this.initialized = false;
        this.activeField = '';
        this.activeLabel = '';
    }

    connectedCallback() {
        if (this.initialized) return;
        this.initialized = true;
        this.render();
        this.bindEvents();
    }

    render() {
        this.innerHTML = `
            <div class="tip-root fixed inset-0 z-[1200] hidden" aria-hidden="true">
                <div class="tip-backdrop absolute inset-0 bg-slate-950/60 backdrop-blur-sm" data-action="close"></div>
                <section class="tip-dialog relative mx-auto my-4 flex max-h-[calc(100vh-2rem)] w-[min(680px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white" role="dialog" aria-modal="true" aria-label="Conseils">
                    <header class="tip-head flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                        <div>
                            <h3 class="tip-title m-0 text-lg font-bold text-slate-900">Conseils</h3>
                            <p class="tip-subtitle mt-1 text-sm text-slate-600" data-tip-field-label></p>
                        </div>
                        <button class="tip-close inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-200" type="button" data-action="close" aria-label="Fermer">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </header>
                    <div class="tip-body grid gap-3 overflow-auto px-5 py-4" data-tip-content></div>
                </section>
            </div>
        `;
    }

    bindEvents() {
        this.addEventListener('click', (event) => {
            if (event.target.closest('[data-action="close"]')) {
                this.close();
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') this.close();
        });
    }

    async open(fieldKey, label) {
        this.activeField = fieldKey || '';
        this.activeLabel = label || fieldKey || '';

        const root = this.querySelector('.tip-root');
        const fieldLabel = this.querySelector('[data-tip-field-label]');
        const content = this.querySelector('[data-tip-content]');
        if (!root || !fieldLabel || !content) return;

        fieldLabel.textContent = this.activeLabel;
        content.innerHTML = '<p class="text-sm text-slate-600">Chargement des conseils...</p>';
        root.classList.remove('hidden');
        root.setAttribute('aria-hidden', 'false');

        try {
            const tips = await listTipsByField(this.activeField);
            content.innerHTML = '';

            if (!tips.length) {
                content.innerHTML = '<div class="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">Aucun tip actif pour ce champ. Ajoute-en depuis Dashboard Tips.</div>';
                return;
            }

            tips.forEach((tip) => {
                const article = document.createElement('article');
                article.className = 'rounded-xl border border-slate-200 bg-slate-50 p-4';
                const title = document.createElement('h4');
                title.className = 'text-base font-semibold text-slate-900';
                title.textContent = tip.title;
                const body = document.createElement('p');
                body.className = 'mt-2 text-sm leading-relaxed text-slate-700';
                body.textContent = tip.content;
                article.appendChild(title);
                article.appendChild(body);
                content.appendChild(article);
            });
        } catch (error) {
            content.innerHTML = '<div class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">Impossible de charger les tips depuis Firebase.</div>';
            console.error(error);
        }
    }

    close() {
        const root = this.querySelector('.tip-root');
        if (!root) return;
        root.classList.add('hidden');
        root.setAttribute('aria-hidden', 'true');
    }
}

if (!customElements.get('tips-modal')) {
    customElements.define('tips-modal', TipsModal);
}
