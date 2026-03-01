import {
  ensureClientProfile,
  db,
  collection,
  getDocs
} from './firebase-init.js';

const CV_PRICE_HTG = 500;
const CURRENCY = 'HTG';

let initialized = false;
let activeAuthApi = null;
let activeModal = null;

function getAuthApi() {
  return activeAuthApi || window.__hpAuthApi || null;
}

function isIndexPath() {
  const path = window.location.pathname || '';
  return path === '/' || path.endsWith('/index.html');
}

function openBuilderDestination() {
  if (isIndexPath()) {
    window.dispatchEvent(new CustomEvent('app:open-builder'));
    return;
  }

  window.location.href = './index.html?open=builder';
}

async function loadApprovedDepositBalance(user) {
  if (!user?.uid) {
    return 0;
  }

  const client = await ensureClientProfile(user);
  const snapshot = await getDocs(collection(db, 'clients', client.id, 'orders'));

  return snapshot.docs.reduce((sum, snapshotDoc) => {
    const order = snapshotDoc.data() || {};
    if (order.orderType !== 'deposit') return sum;
    if ((order.status || 'pending') !== 'approved') return sum;
    return sum + (Number(order.amount) || 0);
  }, 0);
}

function closeModal() {
  if (!activeModal) return;

  activeModal.remove();
  activeModal = null;
  document.body.style.overflow = '';
}

function createBaseModal(content) {
  closeModal();

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
      ${content}
    </div>
  `;

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function onKeydown(event) {
    if (event.key !== 'Escape' || !activeModal) return;
    document.removeEventListener('keydown', onKeydown);
    closeModal();
  }, { once: true });

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  activeModal = modal;
  return modal;
}

function showSignupRequiredModal({ allowContinueBuilder = true } = {}) {
  const authApi = getAuthApi();
  const modal = createBaseModal(`
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Creer un CV</p>
        <h2 class="mt-2 text-2xl font-extrabold text-slate-950">Inscrivez-vous pour creer et telecharger votre CV.</h2>
      </div>
      <button type="button" data-action="close" class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-lg text-slate-600 transition hover:border-slate-300 hover:text-slate-900">✕</button>
    </div>
    <p class="mt-4 text-sm leading-7 text-slate-600">
      Vous pouvez commencer a construire votre CV maintenant, mais l inscription est necessaire pour enregistrer votre espace et telecharger le document.
    </p>
    <div class="mt-6 flex flex-wrap gap-3">
      <button type="button" data-action="signup" class="rounded-2xl bg-[var(--hp-blue-700)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--hp-blue-900)]">
        S'inscrire
      </button>
      <button type="button" data-action="later" class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
        Plus tard
      </button>
    </div>
  `);

  modal.addEventListener('click', (event) => {
    const action = event.target instanceof Element
      ? event.target.closest('[data-action]')?.getAttribute('data-action')
      : null;

    if (!action) return;

    if (action === 'close') {
      closeModal();
      return;
    }

    if (action === 'signup') {
      closeModal();
      authApi?.open?.('signup');
      return;
    }

    if (action === 'later') {
      closeModal();
      if (allowContinueBuilder) {
        openBuilderDestination();
      }
    }
  });
}

function showDepositRequiredModal(balance) {
  const modal = createBaseModal(`
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Acces payant</p>
        <h2 class="mt-2 text-2xl font-extrabold text-slate-950">Un depot de ${CV_PRICE_HTG} GDES est requis pour telecharger votre CV.</h2>
      </div>
      <button type="button" data-action="close" class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-lg text-slate-600 transition hover:border-slate-300 hover:text-slate-900">✕</button>
    </div>
    <p class="mt-4 text-sm leading-7 text-slate-600">
      Vous pouvez continuer a construire votre CV maintenant. Le telechargement sera debloque des que votre depot de ${CV_PRICE_HTG} ${CURRENCY} sera approuve.
    </p>
    <div class="mt-5 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Solde actuel</p>
      <p class="mt-2 text-2xl font-extrabold text-slate-950">${balance.toLocaleString('fr-FR')} ${CURRENCY}</p>
    </div>
    <div class="mt-6 flex flex-wrap gap-3">
      <button type="button" data-action="deposit" class="rounded-2xl bg-[var(--hp-blue-700)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--hp-blue-900)]">
        Faire un depot
      </button>
      <button type="button" data-action="continue" class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
        Continuer a build
      </button>
    </div>
  `);

  modal.addEventListener('click', (event) => {
    const action = event.target instanceof Element
      ? event.target.closest('[data-action]')?.getAttribute('data-action')
      : null;

    if (!action) return;

    if (action === 'close') {
      closeModal();
      return;
    }

    if (action === 'deposit') {
      closeModal();
      window.dispatchEvent(new CustomEvent('app:open-deposit'));
      return;
    }

    if (action === 'continue') {
      closeModal();
      openBuilderDestination();
    }
  });
}

function showDownloadBlockedModal(balance) {
  const modal = createBaseModal(`
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Telechargement bloque</p>
        <h2 class="mt-2 text-2xl font-extrabold text-slate-950">Le telechargement du CV demande ${CV_PRICE_HTG} GDES de solde approuve.</h2>
      </div>
      <button type="button" data-action="close" class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-lg text-slate-600 transition hover:border-slate-300 hover:text-slate-900">✕</button>
    </div>
    <p class="mt-4 text-sm leading-7 text-slate-600">
      Continuez votre construction librement, puis faites un depot pour debloquer l export PDF.
    </p>
    <div class="mt-5 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Solde actuel</p>
      <p class="mt-2 text-2xl font-extrabold text-slate-950">${balance.toLocaleString('fr-FR')} ${CURRENCY}</p>
    </div>
    <div class="mt-6 flex flex-wrap gap-3">
      <button type="button" data-action="deposit" class="rounded-2xl bg-[var(--hp-blue-700)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--hp-blue-900)]">
        Faire un depot
      </button>
      <button type="button" data-action="close" class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
        Continuer a build
      </button>
    </div>
  `);

  modal.addEventListener('click', (event) => {
    const action = event.target instanceof Element
      ? event.target.closest('[data-action]')?.getAttribute('data-action')
      : null;

    if (!action) return;

    if (action === 'deposit') {
      closeModal();
      window.dispatchEvent(new CustomEvent('app:open-deposit'));
      return;
    }

    if (action === 'close') {
      closeModal();
    }
  });
}

function showLoginRequiredForDownloadModal() {
  const authApi = getAuthApi();
  const modal = createBaseModal(`
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Connexion requise</p>
        <h2 class="mt-2 text-2xl font-extrabold text-slate-950">Connectez-vous pour verifier votre solde avant le telechargement.</h2>
      </div>
      <button type="button" data-action="close" class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-lg text-slate-600 transition hover:border-slate-300 hover:text-slate-900">✕</button>
    </div>
    <p class="mt-4 text-sm leading-7 text-slate-600">
      Le telechargement PDF est reserve aux comptes connectes avec un solde approuve d au moins ${CV_PRICE_HTG} ${CURRENCY}.
    </p>
    <div class="mt-6 flex flex-wrap gap-3">
      <button type="button" data-action="login" class="rounded-2xl bg-[var(--hp-blue-700)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--hp-blue-900)]">
        Se connecter
      </button>
      <button type="button" data-action="close" class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
        Fermer
      </button>
    </div>
  `);

  modal.addEventListener('click', (event) => {
    const action = event.target instanceof Element
      ? event.target.closest('[data-action]')?.getAttribute('data-action')
      : null;

    if (!action) return;

    if (action === 'login') {
      closeModal();
      authApi?.open?.('login');
      return;
    }

    if (action === 'close') {
      closeModal();
    }
  });
}

function showVerificationErrorModal() {
  const modal = createBaseModal(`
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Verification indisponible</p>
        <h2 class="mt-2 text-2xl font-extrabold text-slate-950">Impossible de verifier votre solde pour le moment.</h2>
      </div>
      <button type="button" data-action="close" class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-lg text-slate-600 transition hover:border-slate-300 hover:text-slate-900">✕</button>
    </div>
    <p class="mt-4 text-sm leading-7 text-slate-600">
      Reessayez dans un instant. Tant que la verification n est pas possible, le telechargement reste bloque.
    </p>
    <div class="mt-6">
      <button type="button" data-action="close" class="rounded-2xl bg-[var(--hp-blue-700)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--hp-blue-900)]">
        Fermer
      </button>
    </div>
  `);

  modal.addEventListener('click', (event) => {
    const action = event.target instanceof Element
      ? event.target.closest('[data-action]')?.getAttribute('data-action')
      : null;

    if (action === 'close') {
      closeModal();
    }
  });
}

export async function requestCvStart() {
  const authApi = getAuthApi();
  const user = authApi?.getCurrentUser?.() || null;

  if (!user) {
    showSignupRequiredModal({ allowContinueBuilder: true });
    return;
  }

  try {
    const balance = await loadApprovedDepositBalance(user);
    if (balance >= CV_PRICE_HTG) {
      openBuilderDestination();
      return;
    }

    showDepositRequiredModal(balance);
  } catch (error) {
    console.error('Impossible de verifier le solde utilisateur:', error);
    openBuilderDestination();
  }
}

export async function ensureCvDownloadAccess() {
  const authApi = getAuthApi();
  const user = authApi?.getCurrentUser?.() || null;

  if (!user) {
    showLoginRequiredForDownloadModal();
    return false;
  }

  try {
    const balance = await loadApprovedDepositBalance(user);
    if (balance >= CV_PRICE_HTG) {
      return true;
    }

    showDownloadBlockedModal(balance);
    return false;
  } catch (error) {
    console.error('Impossible de verifier le solde avant telechargement:', error);
    showVerificationErrorModal();
    return false;
  }
}

export function initCvAccessFlow(authApi) {
  activeAuthApi = authApi || null;
  window.__hpAuthApi = activeAuthApi;

  if (!initialized) {
    window.addEventListener('app:request-cv-start', () => {
      void requestCvStart();
    });
    initialized = true;
  }

  return {
    requestStart: requestCvStart
  };
}

export { CV_PRICE_HTG, CURRENCY as CV_CURRENCY };
