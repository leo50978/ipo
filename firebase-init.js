import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

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
export const auth = getAuth(app);
export const db = getFirestore(app);
const tipsCollection = collection(db, 'tips');

export {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp
};

export const TIP_FIELDS = [
    { key: 'firstname', label: 'Prenom' },
    { key: 'middlename', label: 'Deuxieme prenom' },
    { key: 'lastname', label: 'Nom' },
    { key: 'designation', label: 'Metier' },
    { key: 'email', label: 'Email' },
    { key: 'phones', label: 'Numeros de telephone' },
    { key: 'address', label: 'Adresse complete' },
    { key: 'summary', label: 'Resume' },
    { key: 'image', label: 'Photo de profil' },
    { key: 'experiences', label: 'Experiences professionnelles' },
    { key: 'educations', label: 'Formations' },
    { key: 'languages', label: 'Langues et niveau' },
    { key: 'tools', label: 'Logiciels ou materiels utilises' },
    { key: 'interests', label: 'Centres d interet' }
];

function mapDoc(snapshot) {
    const data = snapshot.data() || {};
    return {
        id: snapshot.id,
        fieldKey: data.fieldKey || '',
        title: data.title || '',
        content: data.content || '',
        status: data.status || 'active',
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null
    };
}

function sortByUpdatedDesc(items) {
    return items.sort((a, b) => {
        const aSec = a.updatedAt?.seconds || a.createdAt?.seconds || 0;
        const bSec = b.updatedAt?.seconds || b.createdAt?.seconds || 0;
        return bSec - aSec;
    });
}

export function getTipFieldLabel(fieldKey) {
    return TIP_FIELDS.find((item) => item.key === fieldKey)?.label || fieldKey;
}

export async function listAllTips() {
    const snap = await getDocs(tipsCollection);
    return sortByUpdatedDesc(snap.docs.map(mapDoc));
}

export async function listTipsByField(fieldKey) {
    const q = query(tipsCollection, where('fieldKey', '==', fieldKey));
    const snap = await getDocs(q);
    return sortByUpdatedDesc(snap.docs.map(mapDoc)).filter((tip) => tip.status === 'active');
}

export async function createTip(payload) {
    const fieldKey = String(payload.fieldKey || '').trim();
    const title = String(payload.title || '').trim();
    const content = String(payload.content || '').trim();
    const status = payload.status === 'archived' ? 'archived' : 'active';

    if (!fieldKey || !title || !content) {
        throw new Error('Les champs fieldKey, title et content sont obligatoires.');
    }

    const docRef = await addDoc(tipsCollection, {
        fieldKey,
        title,
        content,
        status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });

    return docRef.id;
}

export async function updateTip(id, payload) {
    const fieldKey = String(payload.fieldKey || '').trim();
    const title = String(payload.title || '').trim();
    const content = String(payload.content || '').trim();
    const status = payload.status === 'archived' ? 'archived' : 'active';

    if (!id || !fieldKey || !title || !content) {
        throw new Error('Id, fieldKey, title et content sont obligatoires.');
    }

    await updateDoc(doc(db, 'tips', id), {
        fieldKey,
        title,
        content,
        status,
        updatedAt: serverTimestamp()
    });
}

export async function deleteTip(id) {
    if (!id) throw new Error('Id manquant.');
    await deleteDoc(doc(db, 'tips', id));
}

export async function ensureClientProfile(user, overrides = {}) {
    if (!user?.uid) {
        throw new Error('Utilisateur non authentifie.');
    }

    const clientRef = doc(db, 'clients', user.uid);
    const snapshot = await getDoc(clientRef);
    const baseProfile = {
        uid: user.uid,
        name: String(user.displayName || '').trim(),
        email: String(user.email || '').trim(),
        phone: '',
        address: '',
        city: ''
    };

    if (!snapshot.exists()) {
        const createdProfile = {
            ...baseProfile,
            ...overrides,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        await setDoc(clientRef, createdProfile);
        return {
            id: user.uid,
            ...createdProfile
        };
    }

    const existing = snapshot.data() || {};
    const updates = {};

    if (!existing.uid) updates.uid = user.uid;
    if (!existing.name && baseProfile.name) updates.name = baseProfile.name;
    if (!existing.email && baseProfile.email) updates.email = baseProfile.email;
    if (overrides && typeof overrides === 'object') {
        Object.entries(overrides).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                updates[key] = value;
            }
        });
    }

    if (Object.keys(updates).length > 0) {
        await updateDoc(clientRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    }

    return {
        id: user.uid,
        ...existing,
        ...updates
    };
}
