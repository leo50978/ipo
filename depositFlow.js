import { ensureClientProfile } from './firebase-init.js';
import { CV_PRICE_HTG, CV_CURRENCY } from './cvAccessFlow.js';

let initialized = false;
let activeAuthApi = null;
let isOpening = false;
let activeModal = null;

async function openDepositFlow() {
  if (isOpening || activeModal) {
    return;
  }

  const authApi = activeAuthApi;
  if (!authApi) {
    console.error('Flux de depot indisponible: authApi manquant.');
    return;
  }

  const user = authApi.getCurrentUser?.() || null;
  if (!user) {
    authApi.open?.('login');
    return;
  }

  isOpening = true;

  try {
    const client = await ensureClientProfile(user);
    const module = await import('./checkout.js');
    const CheckoutModal = module.default;

    activeModal = new CheckoutModal({
      client,
      cart: [],
      currency: CV_CURRENCY,
      depositMode: true,
      lockDepositAmount: true,
      depositLabel: 'Paiement du CV professionnel',
      depositDescription: `Le prix du service est fixe: ${CV_PRICE_HTG} ${CV_CURRENCY} pour debloquer le telechargement du CV.`,
      minDepositAmount: CV_PRICE_HTG,
      defaultDepositAmount: CV_PRICE_HTG,
      presetAmounts: [CV_PRICE_HTG],
      onClose: () => {
        activeModal = null;
      },
      onSuccess: (orderData) => {
        activeModal = null;
        window.dispatchEvent(new CustomEvent('app:deposit-saved', {
          detail: orderData
        }));
      }
    });
  } catch (error) {
    console.error('Impossible d ouvrir le flux de depot:', error);
    window.alert("Impossible d'ouvrir le depot pour le moment.");
  } finally {
    isOpening = false;
  }
}

export function initDepositFlow(authApi) {
  activeAuthApi = authApi || null;

  if (!initialized) {
    window.addEventListener('app:open-deposit', () => {
      void openDepositFlow();
    });
    initialized = true;
  }

  return {
    open: openDepositFlow
  };
}
