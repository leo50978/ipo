import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBsryzRzoAEWwd676VM2xwzinNaLLVFe20',
  authDomain: 'hiprofile-32b27.firebaseapp.com',
  projectId: 'hiprofile-32b27',
  storageBucket: 'hiprofile-32b27.firebasestorage.app',
  messagingSenderId: '741509949693',
  appId: '1:741509949693:web:27b8dd34eb65798859f694',
  measurementId: 'G-FTRX3S8Y34'
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const FALLBACK_QUEUE_KEY = 'hiprofil_notification_queue';

function pushFallbackNotification(payload) {
  try {
    const existing = JSON.parse(localStorage.getItem(FALLBACK_QUEUE_KEY) || '[]');
    const queue = Array.isArray(existing) ? existing : [];
    queue.unshift(payload);
    localStorage.setItem(FALLBACK_QUEUE_KEY, JSON.stringify(queue.slice(0, 50)));
  } catch (error) {
    console.warn('Notification fallback indisponible:', error);
  }
}

export async function sendBroadcastNotification(payload = {}) {
  const normalized = {
    type: String(payload.type || 'custom'),
    title: String(payload.title || 'Notification'),
    body: String(payload.body || ''),
    target: payload.target || 'all',
    targetUid: payload.targetUid || '',
    url: payload.url || './index.html',
    createdBy: payload.createdBy || 'dashboard',
    createdAtIso: new Date().toISOString()
  };

  try {
    const ref = await addDoc(collection(db, 'notifications'), {
      ...normalized,
      read: false,
      createdAt: serverTimestamp()
    });
    return { id: ref.id, ...normalized };
  } catch (error) {
    console.warn('Echec enregistrement notification, fallback local utilise:', error);
    const fallback = {
      id: `local-${Date.now()}`,
      ...normalized,
      storedLocally: true
    };
    pushFallbackNotification(fallback);
    return fallback;
  }
}

export class NotificationComponent {
  constructor(options = {}) {
    this.options = {
      mode: 'dashboard',
      defaultUrl: './index.html',
      enabledStorageKey: 'hiprofil_notifications_enabled',
      ...options
    };
  }

  init() {
    return this;
  }

  isEnabled() {
    return localStorage.getItem(this.options.enabledStorageKey) === '1';
  }

  setEnabled(enabled) {
    localStorage.setItem(this.options.enabledStorageKey, enabled ? '1' : '0');
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      return 'unsupported';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    return Notification.requestPermission();
  }

  notify(title, body, options = {}) {
    if (!this.isEnabled()) {
      return false;
    }

    const url = options.url || this.options.defaultUrl || './index.html';

    if (!('Notification' in window) || Notification.permission !== 'granted') {
      pushFallbackNotification({
        id: `local-ui-${Date.now()}`,
        title,
        body,
        url,
        tag: options.tag || '',
        createdAtIso: new Date().toISOString()
      });
      return false;
    }

    const notification = new Notification(title, {
      body,
      tag: options.tag || undefined,
      data: { url }
    });

    notification.onclick = () => {
      window.focus();
      if (notification.data?.url) {
        window.location.href = notification.data.url;
      }
      notification.close();
    };

    return true;
  }
}
