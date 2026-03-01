import {
  ensureClientProfile,
  db,
  collection,
  getDocs
} from './firebase-init.js';

const HIDDEN_ORDERS_KEY_PREFIX = 'hiprofil_hidden_orders_';

let initialized = false;
let activeAuthApi = null;
let accountPanelInstance = null;

function getHiddenOrdersKey(uid) {
  return `${HIDDEN_ORDERS_KEY_PREFIX}${uid}`;
}

function readHiddenOrders(uid) {
  if (!uid) return [];

  try {
    const raw = localStorage.getItem(getHiddenOrdersKey(uid));
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Impossible de lire les commandes masquees:', error);
    return [];
  }
}

function writeHiddenOrders(uid, orderIds) {
  if (!uid) return;

  try {
    localStorage.setItem(getHiddenOrdersKey(uid), JSON.stringify(orderIds));
  } catch (error) {
    console.warn('Impossible d enregistrer les commandes masquees:', error);
  }
}

function resolveOrderTimestamp(order) {
  const raw = order?.createdAt;

  if (!raw) return 0;
  if (typeof raw === 'string') return Date.parse(raw) || 0;
  if (typeof raw?.toDate === 'function') return raw.toDate().getTime();
  if (typeof raw?.seconds === 'number') return raw.seconds * 1000;

  return 0;
}

function formatOrderDate(order) {
  const timestamp = resolveOrderTimestamp(order);
  if (!timestamp) return 'Date inconnue';

  try {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(timestamp));
  } catch (error) {
    return new Date(timestamp).toLocaleString('fr-FR');
  }
}

function formatMoney(amount, currency = 'EUR') {
  const value = Number(amount) || 0;
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2
    }).format(value);
  } catch (error) {
    return `${value.toFixed(2)} ${currency}`;
  }
}

function getOrderCurrency(order) {
  if (order?.currency) return order.currency;
  if (order?.orderType === 'deposit') return 'HTG';
  return 'HTG';
}

function getStatusMeta(status) {
  if (status === 'approved') {
    return {
      label: 'Approuvee',
      chipStyle: 'background:#dcfce7;color:#166534;'
    };
  }

  if (status === 'review') {
    return {
      label: 'En examen',
      chipStyle: 'background:#dbeafe;color:#1d4ed8;'
    };
  }

  if (status === 'rejected') {
    return {
      label: 'Refusee',
      chipStyle: 'background:#fee2e2;color:#b91c1c;'
    };
  }

  return {
    label: 'En attente',
    chipStyle: 'background:#fef3c7;color:#92400e;'
  };
}

class AccountPanel {
  constructor(authApi) {
    this.authApi = authApi || null;
    this.modal = null;
    this.user = null;
    this.client = null;
    this.orders = [];
    this.hiddenOrderIds = [];
    this.isOpen = false;

    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleAuthChanged = this.handleAuthChanged.bind(this);
    this.handleOrderSaved = this.handleOrderSaved.bind(this);
  }

  ensureModal() {
    if (this.modal) return;

    this.modal = document.createElement('div');
    this.modal.id = 'account-panel-root';
    this.modal.className = 'fixed inset-0 z-[90] hidden';
    this.modal.addEventListener('click', this.handleClick);
    document.addEventListener('keydown', this.handleKeydown);
    window.addEventListener('auth:changed', this.handleAuthChanged);
    document.addEventListener('orderSaved', this.handleOrderSaved);
    window.addEventListener('app:deposit-saved', this.handleOrderSaved);
    document.body.appendChild(this.modal);
  }

  async open() {
    const user = this.authApi?.getCurrentUser?.() || null;
    if (!user) {
      this.authApi?.open?.('login');
      return;
    }

    this.ensureModal();
    this.user = user;
    this.client = await ensureClientProfile(user);
    this.hiddenOrderIds = readHiddenOrders(this.client.id);
    await this.loadOrders();

    this.isOpen = true;
    this.render();
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.modal) return;

    this.isOpen = false;
    this.modal.classList.add('hidden');
    this.modal.innerHTML = '';
    document.body.style.overflow = '';
  }

  async loadOrders() {
    if (!this.client?.id) {
      this.orders = [];
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, 'clients', this.client.id, 'orders'));
      this.orders = snapshot.docs
        .map((snapshotDoc) => ({
          id: snapshotDoc.id,
          ...snapshotDoc.data()
        }))
        .sort((left, right) => resolveOrderTimestamp(right) - resolveOrderTimestamp(left));
    } catch (error) {
      console.error('Impossible de charger les commandes du compte:', error);
      this.orders = [];
    }
  }

  getVisibleOrders() {
    return this.orders.filter((order) => !this.hiddenOrderIds.includes(order.id));
  }

  getPendingOrders() {
    return this.getVisibleOrders().filter((order) => ['pending', 'review'].includes(order.status || 'pending'));
  }

  getArchivedOrders() {
    return this.getVisibleOrders().filter((order) => !['pending', 'review'].includes(order.status || 'pending'));
  }

  getApprovedBalance() {
    return this.orders.reduce((sum, order) => {
      if (order.orderType !== 'deposit') return sum;
      if ((order.status || 'pending') !== 'approved') return sum;
      return sum + (Number(order.amount) || 0);
    }, 0);
  }

  maskOrder(orderId) {
    if (!orderId || !this.client?.id) return;
    if (this.hiddenOrderIds.includes(orderId)) return;

    this.hiddenOrderIds = [...this.hiddenOrderIds, orderId];
    writeHiddenOrders(this.client.id, this.hiddenOrderIds);
    this.render();
  }

  restoreHiddenOrders() {
    if (!this.client?.id) return;

    this.hiddenOrderIds = [];
    writeHiddenOrders(this.client.id, this.hiddenOrderIds);
    this.render();
  }

  renderOrderCard(order) {
    const status = getStatusMeta(order.status || 'pending');
    const isDeposit = order.orderType === 'deposit';
    const amount = formatMoney(order.amount, getOrderCurrency(order));
    const typeLabel = isDeposit ? 'Depot' : 'Commande';

    return `
      <article class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">${typeLabel}</p>
            <h3 class="mt-1 text-base font-bold text-slate-900">${order.uniqueCode || order.id}</h3>
            <p class="mt-1 text-xs text-slate-500">${formatOrderDate(order)}</p>
          </div>
          <span class="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style="${status.chipStyle}">
            ${status.label}
          </span>
        </div>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-2xl bg-slate-50 px-3 py-3">
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Montant</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">${amount}</p>
          </div>
          <div class="rounded-2xl bg-slate-50 px-3 py-3">
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Type</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">${isDeposit ? 'Credit compte' : 'Achat'}</p>
          </div>
        </div>
        ${order.methodName ? `
          <p class="mt-3 text-sm text-slate-600">Moyen de paiement: <span class="font-semibold text-slate-900">${order.methodName}</span></p>
        ` : ''}
        <div class="mt-4 flex items-center justify-between gap-3">
          <p class="text-xs text-slate-500">Supprimer ici masque seulement cette commande dans votre espace.</p>
          <button
            type="button"
            data-action="hide-order"
            data-order-id="${order.id}"
            class="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            Supprimer
          </button>
        </div>
      </article>
    `;
  }

  renderOrderSection(title, orders, emptyText) {
    return `
      <section class="mt-8">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-lg font-bold text-slate-900">${title}</h2>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">${orders.length}</span>
        </div>
        ${orders.length
          ? `<div class="mt-4 grid gap-4">${orders.map((order) => this.renderOrderCard(order)).join('')}</div>`
          : `<div class="mt-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">${emptyText}</div>`}
      </section>
    `;
  }

  render() {
    if (!this.modal || !this.user) return;

    const visibleOrders = this.getVisibleOrders();
    const pendingOrders = this.getPendingOrders();
    const archivedOrders = this.getArchivedOrders();
    const hiddenCount = this.hiddenOrderIds.length;
    const approvedBalance = this.getApprovedBalance();
    const displayName = this.user.displayName || this.client?.name || 'Utilisateur';

    this.modal.innerHTML = `
      <div class="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" data-action="close-panel"></div>
      <aside class="relative ml-auto h-full w-full overflow-y-auto bg-white shadow-2xl sm:max-w-[460px]">
        <div class="flex min-h-full flex-col">
          <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Mon espace</p>
                <h1 class="mt-2 text-xl font-extrabold text-slate-950">${displayName}</h1>
                <p class="mt-1 text-sm text-slate-500">${this.user.email || this.client?.email || ''}</p>
              </div>
              <button
                type="button"
                data-action="close-panel"
                class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                aria-label="Fermer le panneau"
              >
                ✕
              </button>
            </div>
          </header>

          <div class="flex-1 px-5 py-5">
            <div class="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_36%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5">
              <div class="grid gap-3 sm:grid-cols-3">
                <div class="rounded-3xl bg-white px-4 py-4 shadow-sm">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Solde</p>
                  <p class="mt-2 text-lg font-extrabold text-slate-950">${formatMoney(approvedBalance, 'HTG')}</p>
                  <p class="mt-1 text-xs text-slate-500">Depots approuves</p>
                </div>
                <div class="rounded-3xl bg-white px-4 py-4 shadow-sm">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">En attente</p>
                  <p class="mt-2 text-lg font-extrabold text-slate-950">${pendingOrders.length}</p>
                  <p class="mt-1 text-xs text-slate-500">Commandes a traiter</p>
                </div>
                <div class="rounded-3xl bg-white px-4 py-4 shadow-sm">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Visibles</p>
                  <p class="mt-2 text-lg font-extrabold text-slate-950">${visibleOrders.length}</p>
                  <p class="mt-1 text-xs text-slate-500">Dans votre espace</p>
                </div>
              </div>
              <div class="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  data-action="make-deposit"
                  class="rounded-2xl bg-[var(--hp-blue-700)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--hp-blue-900)]"
                >
                  Faire un depot
                </button>
                <button
                  type="button"
                  data-action="logout"
                  class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Deconnexion
                </button>
                ${hiddenCount > 0 ? `
                  <button
                    type="button"
                    data-action="restore-hidden"
                    class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Reafficher ${hiddenCount} masquee${hiddenCount > 1 ? 's' : ''}
                  </button>
                ` : ''}
              </div>
            </div>

            ${this.renderOrderSection(
              'Commandes en attente',
              pendingOrders,
              'Aucune commande en attente pour le moment.'
            )}

            ${this.renderOrderSection(
              'Historique',
              archivedOrders,
              hiddenCount > 0 && visibleOrders.length === 0
                ? 'Toutes les commandes visibles ont ete masquees. Utilisez "Reafficher" pour les revoir.'
                : 'Aucune commande terminee ou archivee.'
            )}
          </div>
        </div>
      </aside>
    `;
  }

  async handleClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const actionNode = target.closest('[data-action]');
    const action = actionNode?.getAttribute('data-action');

    if (!action) return;

    if (action === 'close-panel') {
      this.close();
      return;
    }

    if (action === 'make-deposit') {
      this.close();
      window.dispatchEvent(new CustomEvent('app:open-deposit'));
      return;
    }

    if (action === 'logout') {
      this.close();
      await this.authApi?.logout?.();
      return;
    }

    if (action === 'hide-order') {
      const orderId = actionNode?.getAttribute('data-order-id') || '';
      this.maskOrder(orderId);
      return;
    }

    if (action === 'restore-hidden') {
      this.restoreHiddenOrders();
    }
  }

  handleKeydown(event) {
    if (event.key !== 'Escape' || !this.isOpen) return;
    this.close();
  }

  handleAuthChanged(event) {
    this.user = event?.detail?.user || null;

    if (!this.user) {
      this.close();
    }
  }

  async handleOrderSaved() {
    if (!this.isOpen) return;
    await this.loadOrders();
    this.render();
  }
}

async function openAccountPanel() {
  if (!activeAuthApi) {
    console.error('Panneau compte indisponible: authApi manquant.');
    return;
  }

  if (!accountPanelInstance) {
    accountPanelInstance = new AccountPanel(activeAuthApi);
  } else {
    accountPanelInstance.authApi = activeAuthApi;
  }

  try {
    await accountPanelInstance.open();
  } catch (error) {
    console.error('Impossible d ouvrir le panneau compte:', error);
  }
}

export function initAccountPanel(authApi) {
  activeAuthApi = authApi || null;

  if (!initialized) {
    window.addEventListener('app:open-account-panel', () => {
      void openAccountPanel();
    });
    initialized = true;
  }

  return {
    open: openAccountPanel,
    close: () => accountPanelInstance?.close?.()
  };
}
