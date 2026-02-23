import {
    TIP_FIELDS,
    getTipFieldLabel,
    listAllTips,
    createTip,
    updateTip,
    deleteTip
} from './firebase-init.js';

class DashboardTips extends HTMLElement {
    constructor() {
        super();
        this.initialized = false;
        this.tips = [];
        this.editingId = '';
    }

    connectedCallback() {
        if (this.initialized) return;
        this.initialized = true;
        this.render();
        this.bindEvents();
        this.refresh();
    }

    render() {
        const fieldOptions = TIP_FIELDS.map((field) => `<option value="${field.key}">${field.label}</option>`).join('');

        this.innerHTML = `
            <section class="dt-root min-h-screen bg-gradient-to-br from-slate-50 via-sky-100 to-slate-100 p-5 text-slate-900">
                <div class="dt-shell mx-auto grid max-w-[1260px] gap-4">
                    <header class="dt-head flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                        <div>
                            <h1 class="dt-title m-0 text-2xl font-bold">Dashboard Tips</h1>
                            <p class="dt-subtitle mt-1 text-slate-600">CRUD SPA pour gerer les tips des champs du CV Builder.</p>
                        </div>
                        <div class="dt-row flex flex-wrap items-center gap-2">
                            <button type="button" class="dt-btn inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-semibold text-slate-900 hover:bg-slate-200" data-action="close"><i class="fa-solid fa-arrow-left"></i> Retour accueil</button>
                            <button type="button" class="dt-btn dt-btn-primary inline-flex items-center gap-2 rounded-xl border border-sky-700 bg-sky-700 px-4 py-3 font-semibold text-white hover:bg-sky-800" data-action="refresh"><i class="fa-solid fa-rotate"></i> Actualiser</button>
                        </div>
                    </header>

                    <div class="dt-grid grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
                        <article class="dt-panel rounded-2xl border border-slate-200 bg-white p-4">
                            <div class="dt-row flex flex-wrap items-center gap-2">
                                <input class="dt-input w-full rounded-xl border border-slate-300 px-3 py-3 text-[.95rem] outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-200/70" data-filter-search type="text" placeholder="Rechercher par titre / contenu">
                                <select class="dt-select w-full rounded-xl border border-slate-300 px-3 py-3 text-[.95rem] outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-200/70" data-filter-field>
                                    <option value="">Tous les champs</option>
                                    ${fieldOptions}
                                </select>
                            </div>
                            <div class="dt-list mt-4 grid max-h-[48vh] gap-3 overflow-auto lg:max-h-[calc(100vh-250px)]" data-tip-list></div>
                        </article>

                        <article class="dt-panel rounded-2xl border border-slate-200 bg-white p-4">
                            <h2 class="mt-0 text-xl font-semibold">Edition Tip</h2>
                            <div class="dt-row mt-3 flex flex-wrap items-center gap-2">
                                <select class="dt-select w-full rounded-xl border border-slate-300 px-3 py-3 text-[.95rem] outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-200/70" data-form-field>${fieldOptions}</select>
                                <input class="dt-input w-full rounded-xl border border-slate-300 px-3 py-3 text-[.95rem] outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-200/70" data-form-title type="text" placeholder="Titre du tip">
                                <select class="dt-select w-full rounded-xl border border-slate-300 px-3 py-3 text-[.95rem] outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-200/70" data-form-status>
                                    <option value="active">Actif</option>
                                    <option value="archived">Archive</option>
                                </select>
                                <textarea class="dt-textarea min-h-[140px] w-full resize-y rounded-xl border border-slate-300 px-3 py-3 text-[.95rem] outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-200/70" data-form-content placeholder="Texte du tip (conseils concrets pour l'utilisateur)"></textarea>
                            </div>
                            <p class="dt-status min-h-[1.2rem] text-sm text-red-700" data-form-status-msg></p>
                            <div class="dt-row flex flex-wrap items-center justify-end gap-2">
                                <button type="button" class="dt-btn inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-semibold text-slate-900 hover:bg-slate-200" data-action="reset-form">Nouveau</button>
                                <button type="button" class="dt-btn dt-btn-primary inline-flex items-center gap-2 rounded-xl border border-sky-700 bg-sky-700 px-4 py-3 font-semibold text-white hover:bg-sky-800" data-action="save">Enregistrer</button>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        `;
    }

    bindEvents() {
        this.addEventListener('click', async (event) => {
            if (event.target.closest('[data-action="close"]')) {
                this.dispatchEvent(new CustomEvent('close-dashboard-tips', { bubbles: true }));
                return;
            }

            if (event.target.closest('[data-action="refresh"]')) {
                await this.refresh();
                return;
            }

            if (event.target.closest('[data-action="reset-form"]')) {
                this.resetForm();
                return;
            }

            if (event.target.closest('[data-action="edit-tip"]')) {
                const id = event.target.closest('[data-action="edit-tip"]')?.getAttribute('data-id') || '';
                this.fillForm(id);
                return;
            }

            if (event.target.closest('[data-action="delete-tip"]')) {
                const id = event.target.closest('[data-action="delete-tip"]')?.getAttribute('data-id') || '';
                if (!id) return;
                if (!window.confirm('Supprimer ce tip ?')) return;
                try {
                    await deleteTip(id);
                    await this.refresh();
                } catch (error) {
                    this.setFormStatus('Suppression impossible.');
                    console.error(error);
                }
                return;
            }

            if (event.target.closest('[data-action="save"]')) {
                await this.saveForm();
                return;
            }
        });

        this.addEventListener('input', (event) => {
            if (event.target.matches('[data-filter-search]')) this.renderList();
        });

        this.addEventListener('change', (event) => {
            if (event.target.matches('[data-filter-field]')) this.renderList();
        });
    }

    setFormStatus(text) {
        const status = this.querySelector('[data-form-status-msg]');
        if (status) status.textContent = text || '';
    }

    getFilteredTips() {
        const search = (this.querySelector('[data-filter-search]')?.value || '').toLowerCase().trim();
        const field = (this.querySelector('[data-filter-field]')?.value || '').trim();

        return this.tips.filter((tip) => {
            const fieldMatch = !field || tip.fieldKey === field;
            if (!fieldMatch) return false;

            if (!search) return true;
            const haystack = `${tip.title} ${tip.content} ${getTipFieldLabel(tip.fieldKey)}`.toLowerCase();
            return haystack.includes(search);
        });
    }

    renderList() {
        const list = this.querySelector('[data-tip-list]');
        if (!list) return;

        const items = this.getFilteredTips();
        if (!items.length) {
            list.innerHTML = '<p class="m-0 text-slate-600">Aucun tip trouve.</p>';
            return;
        }

        list.innerHTML = items.map((tip) => `
            <article class="dt-card rounded-xl border border-sky-100 bg-sky-50 p-3">
                <h3 class="dt-card-title m-0 text-[.98rem] font-bold">${this.escapeHtml(tip.title)}</h3>
                <p class="dt-meta mt-1 text-xs text-slate-600">${getTipFieldLabel(tip.fieldKey)} · <span class="dt-badge inline-flex items-center rounded-full px-2 py-0.5 text-[.76rem] font-bold ${tip.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}">${tip.status}</span></p>
                <p class="dt-text m-0 whitespace-pre-wrap text-slate-800"></p>
                <div class="dt-card-actions mt-2 flex gap-2">
                    <button type="button" class="dt-btn inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 font-semibold text-slate-900 hover:bg-slate-200" data-action="edit-tip" data-id="${tip.id}"><i class="fa-solid fa-pen"></i> Modifier</button>
                    <button type="button" class="dt-btn inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 font-semibold text-slate-900 hover:bg-slate-200" data-action="delete-tip" data-id="${tip.id}"><i class="fa-solid fa-trash"></i> Supprimer</button>
                </div>
            </article>
        `).join('');

        items.forEach((tip) => {
            const textTarget = list.querySelector(`[data-id="${tip.id}"]`)?.closest('.dt-card')?.querySelector('.dt-text');
            if (textTarget) textTarget.textContent = tip.content;
        });
    }

    escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    async refresh() {
        this.setFormStatus('Chargement des tips...');
        try {
            this.tips = await listAllTips();
            this.renderList();
            this.setFormStatus('');
        } catch (error) {
            this.setFormStatus('Erreur de lecture Firebase.');
            console.error(error);
        }
    }

    fillForm(id) {
        const tip = this.tips.find((item) => item.id === id);
        if (!tip) return;

        this.editingId = tip.id;
        const field = this.querySelector('[data-form-field]');
        const title = this.querySelector('[data-form-title]');
        const status = this.querySelector('[data-form-status]');
        const content = this.querySelector('[data-form-content]');

        if (field) field.value = tip.fieldKey;
        if (title) title.value = tip.title;
        if (status) status.value = tip.status;
        if (content) content.value = tip.content;

        this.setFormStatus('Edition du tip selectionne.');
    }

    resetForm() {
        this.editingId = '';
        const field = this.querySelector('[data-form-field]');
        const title = this.querySelector('[data-form-title]');
        const status = this.querySelector('[data-form-status]');
        const content = this.querySelector('[data-form-content]');

        if (field) field.selectedIndex = 0;
        if (title) title.value = '';
        if (status) status.value = 'active';
        if (content) content.value = '';

        this.setFormStatus('Nouveau tip.');
    }

    async saveForm() {
        const fieldKey = (this.querySelector('[data-form-field]')?.value || '').trim();
        const title = (this.querySelector('[data-form-title]')?.value || '').trim();
        const status = (this.querySelector('[data-form-status]')?.value || 'active').trim();
        const content = (this.querySelector('[data-form-content]')?.value || '').trim();

        if (!fieldKey || !title || !content) {
            this.setFormStatus('Tous les champs sont obligatoires.');
            return;
        }

        try {
            if (this.editingId) {
                await updateTip(this.editingId, { fieldKey, title, status, content });
                this.setFormStatus('Tip mis a jour.');
            } else {
                await createTip({ fieldKey, title, status, content });
                this.setFormStatus('Tip cree.');
            }

            await this.refresh();
            this.resetForm();
        } catch (error) {
            this.setFormStatus('Enregistrement impossible.');
            console.error(error);
        }
    }
}

if (!customElements.get('dashboard-tips')) {
    customElements.define('dashboard-tips', DashboardTips);
}
