import { auth } from "./firebase-init.js";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let initialized = false;
let modalRoot = null;
let currentMode = "login";

const refs = {
  title: null,
  subtitle: null,
  nameWrap: null,
  nameInput: null,
  emailInput: null,
  passwordInput: null,
  error: null,
  submit: null,
  switcher: null,
};

function clearFeedback() {
  refs.error.textContent = "";
  refs.error.classList.remove("bg-red-50", "text-red-700", "bg-emerald-50", "text-emerald-700");
  refs.error.classList.add("hidden");
}

function setError(message) {
  refs.error.textContent = message;
  refs.error.classList.remove("hidden", "bg-emerald-50", "text-emerald-700");
  refs.error.classList.add("bg-red-50", "text-red-700");
}

function normalizeAuthError(error) {
  const code = error?.code || "";
  if (code === "auth/invalid-credential") return "Identifiants invalides.";
  if (code === "auth/invalid-email") return "Adresse email invalide.";
  if (code === "auth/email-already-in-use") return "Cette adresse email est deja utilisee.";
  if (code === "auth/weak-password") return "Mot de passe trop faible (minimum 6 caracteres).";
  if (code === "auth/too-many-requests") return "Trop de tentatives. Reessayez plus tard.";
  if (code === "auth/popup-closed-by-user") return "Connexion Google annulee.";
  return error?.message || "Echec de l'authentification.";
}

function setMode(mode) {
  currentMode = mode === "signup" ? "signup" : "login";
  const signup = currentMode === "signup";

  refs.title.textContent = signup ? "Créer votre compte" : "Connexion";
  refs.subtitle.textContent = signup
    ? "Inscrivez-vous pour commencer."
    : "Connectez-vous à votre espace.";
  refs.submit.textContent = signup ? "S'inscrire" : "Se connecter";
  refs.nameWrap.classList.toggle("hidden", !signup);
  refs.switcher.innerHTML = signup
    ? `Déjà un compte ? <button type="button" data-action="switch-login" class="font-semibold text-[var(--hp-blue-900)]">Se connecter</button>`
    : `Pas encore de compte ? <button type="button" data-action="switch-signup" class="font-semibold text-[var(--hp-blue-900)]">S'inscrire</button>`;
  clearFeedback();
}

function open(mode = "login") {
  if (!modalRoot) return;
  setMode(mode);
  modalRoot.classList.remove("hidden");
}

function close() {
  if (!modalRoot) return;
  modalRoot.classList.add("hidden");
  clearFeedback();
}

async function submitAuth(event) {
  event.preventDefault();
  clearFeedback();

  const email = refs.emailInput.value.trim();
  const password = refs.passwordInput.value.trim();
  const name = refs.nameInput.value.trim();

  if (!email || !password) {
    setError("Email et mot de passe obligatoires.");
    return;
  }

  try {
    if (currentMode === "signup") {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(credential.user, { displayName: name });
      }
      if (name) refs.nameInput.value = "";
      emitAuthChanged(credential.user);
    } else {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      emitAuthChanged(credential.user);
    }

    refs.passwordInput.value = "";
    close();
  } catch (error) {
    setError(normalizeAuthError(error));
  }
}

async function signInGoogle() {
  clearFeedback();
  try {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    emitAuthChanged(credential.user);
    close();
  } catch (error) {
    setError(normalizeAuthError(error));
  }
}

function setupModal() {
  modalRoot = document.createElement("div");
  modalRoot.id = "auth-modal-root";
  modalRoot.className =
    "fixed inset-0 z-50 hidden flex items-center justify-center bg-black/50 p-4";
  modalRoot.innerHTML = `
    <div class="w-full max-w-md rounded-2xl border border-[var(--hp-line)] bg-white p-6 shadow-2xl">
      <div class="mb-6 flex items-start justify-between">
        <div>
          <h2 id="auth-title" class="text-xl font-semibold text-[var(--hp-blue-900)]"></h2>
          <p id="auth-subtitle" class="mt-1 text-sm text-slate-600"></p>
        </div>
        <button type="button" data-action="close" class="text-xl leading-none text-slate-500 hover:text-[var(--hp-blue-900)]">&times;</button>
      </div>

      <form id="auth-form" class="space-y-4">
        <div id="auth-name-wrap" class="hidden">
          <label class="mb-1 block text-sm font-medium text-slate-700">Nom</label>
          <input id="auth-name" type="text" class="w-full rounded-xl border border-[var(--hp-line)] px-3 py-2 outline-none ring-0 focus:border-[var(--hp-blue-500)]" placeholder="Votre nom" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input id="auth-email" type="email" class="w-full rounded-xl border border-[var(--hp-line)] px-3 py-2 outline-none ring-0 focus:border-[var(--hp-blue-500)]" placeholder="vous@email.com" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Mot de passe</label>
          <input id="auth-password" type="password" class="w-full rounded-xl border border-[var(--hp-line)] px-3 py-2 outline-none ring-0 focus:border-[var(--hp-blue-500)]" placeholder="********" />
        </div>
        <p id="auth-error" class="hidden rounded-lg px-3 py-2 text-sm"></p>
        <button id="auth-submit" type="submit" class="w-full rounded-xl bg-[var(--hp-blue-700)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--hp-blue-900)]"></button>
      </form>

      <div class="my-4 flex items-center gap-3">
        <div class="h-px flex-1 bg-[var(--hp-line)]"></div>
        <span class="text-xs uppercase tracking-wide text-slate-500">ou</span>
        <div class="h-px flex-1 bg-[var(--hp-line)]"></div>
      </div>

      <button type="button" data-action="google" class="w-full rounded-xl border border-[var(--hp-line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--hp-blue-900)] transition hover:border-[var(--hp-blue-500)] hover:bg-[#f6f9ff]">
        Continuer avec Google
      </button>

      <p id="auth-switcher" class="mt-4 text-center text-sm text-slate-600"></p>
    </div>
  `;

  document.body.appendChild(modalRoot);

  refs.title = modalRoot.querySelector("#auth-title");
  refs.subtitle = modalRoot.querySelector("#auth-subtitle");
  refs.nameWrap = modalRoot.querySelector("#auth-name-wrap");
  refs.nameInput = modalRoot.querySelector("#auth-name");
  refs.emailInput = modalRoot.querySelector("#auth-email");
  refs.passwordInput = modalRoot.querySelector("#auth-password");
  refs.error = modalRoot.querySelector("#auth-error");
  refs.submit = modalRoot.querySelector("#auth-submit");
  refs.switcher = modalRoot.querySelector("#auth-switcher");

  modalRoot.querySelector("#auth-form").addEventListener("submit", submitAuth);

  modalRoot.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;

    if (event.target === modalRoot) close();
    if (action === "close") close();
    if (action === "switch-login") setMode("login");
    if (action === "switch-signup") setMode("signup");
    if (action === "google") signInGoogle();
  });
}

function emitAuthChanged(user) {
  window.dispatchEvent(new CustomEvent("auth:changed", { detail: { user } }));
}

async function logout() {
  emitAuthChanged(null);
  await signOut(auth);
}

export function initAuth() {
  if (initialized) {
    return {
      open,
      close,
      logout,
      getCurrentUser: () => auth.currentUser,
    };
  }

  setupModal();
  setMode("login");

  onAuthStateChanged(auth, (user) => {
    emitAuthChanged(user);
  });

  initialized = true;
  return {
    open,
    close,
    logout,
    getCurrentUser: () => auth.currentUser,
  };
}
