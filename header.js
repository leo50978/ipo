export default class HeaderComponent {
  constructor(rootId, options = {}) {
    this.root = document.getElementById(rootId);
    this.authApi = options.authApi || null;
    this.user = this.authApi?.getCurrentUser() || null;
    this.isMobileMenuOpen = false;

    if (!this.root) {
      console.error(`Header root introuvable: ${rootId}`);
      return;
    }

    this.handleAuthChanged = this.handleAuthChanged.bind(this);
    this.handleClick = this.handleClick.bind(this);

    window.addEventListener("auth:changed", this.handleAuthChanged);
    this.root.addEventListener("click", this.handleClick);

    this.render();
  }

  handleAuthChanged(event) {
    this.user = event?.detail?.user || null;
    this.render();
  }

  handleClick(event) {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (!action) return;

    if (action === "toggle-mobile-menu") {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      this.render();
    }

    if (action === "close-mobile-menu") {
      this.isMobileMenuOpen = false;
      this.render();
    }

    if (action === "open-login") {
      this.authApi?.open("login");
      this.isMobileMenuOpen = false;
      this.render();
    }

    if (action === "open-signup") {
      this.authApi?.open("signup");
      this.isMobileMenuOpen = false;
      this.render();
    }
  }

  renderActions(isMobile = false) {
    const containerClass = isMobile
      ? "flex w-full flex-col items-stretch gap-2"
      : "flex items-center gap-3";

    if (this.user) {
      const initial = (this.user.displayName || this.user.email || "U")
        .trim()
        .charAt(0)
        .toUpperCase();

      return `
        <div class="${containerClass}">
          <button class="rounded-xl bg-[var(--hp-blue-700)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--hp-blue-900)] ${isMobile ? "w-full" : ""}">
            Upgrade
          </button>
          <button class="flex h-10 ${isMobile ? "w-full justify-start px-4" : "w-10 justify-center"} items-center rounded-full border border-[var(--hp-line)] bg-white text-sm font-semibold text-[var(--hp-blue-900)] shadow-sm" title="${this.user.email || "Profil"}">
            ${initial}
          </button>
        </div>
      `;
    }

    return `
      <div class="${containerClass}">
        <button data-action="open-signup" class="rounded-xl border border-[var(--hp-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--hp-blue-900)] transition hover:border-[var(--hp-blue-500)] hover:bg-[#f6f9ff] ${isMobile ? "w-full" : ""}">
          S'inscrire
        </button>
        <button data-action="open-login" class="rounded-xl bg-[var(--hp-blue-700)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--hp-blue-900)] ${isMobile ? "w-full" : ""}">
          Se connecter
        </button>
      </div>
    `;
  }

  render() {
    this.root.innerHTML = `
      <header class="w-full border-b border-[var(--hp-line)] bg-white/90 backdrop-blur">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:grid md:grid-cols-[1fr_auto_1fr] md:px-6 md:py-4">
          <a href="#" class="flex items-center gap-3 justify-self-start">
            <img src="./Logo.webp" alt="Logo hiprofile" class="h-10 w-auto max-w-[128px] object-contain md:h-11 md:max-w-[152px]" />
            <div>
              <p class="text-lg font-extrabold tracking-tight text-[var(--hp-blue-900)] md:text-xl">hiprofile</p>
            </div>
          </a>

          <nav class="hidden items-center gap-8 text-sm font-semibold text-[var(--hp-blue-900)] md:flex">
            <a href="#" class="transition hover:text-[var(--hp-blue-500)]">Accueil</a>
            <a href="#" class="transition hover:text-[var(--hp-blue-500)]">Solutions</a>
            <a href="#" class="transition hover:text-[var(--hp-blue-500)]">Tarifs</a>
            <a href="#" class="transition hover:text-[var(--hp-blue-500)]">Contact</a>
          </nav>

          <div class="hidden justify-self-end md:block">
            ${this.renderActions(false)}
          </div>

          <button
            data-action="toggle-mobile-menu"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--hp-line)] bg-white text-[var(--hp-blue-900)] md:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded="${this.isMobileMenuOpen ? "true" : "false"}"
          >
            ${this.isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        <div class="${this.isMobileMenuOpen ? "block" : "hidden"} border-t border-[var(--hp-line)] bg-white px-4 pb-4 pt-3 md:hidden">
          <nav class="mb-4 flex flex-col gap-3 text-sm font-semibold text-[var(--hp-blue-900)]">
            <a href="#" data-action="close-mobile-menu" class="rounded-lg px-2 py-1.5 transition hover:bg-[#f6f9ff]">Accueil</a>
            <a href="#" data-action="close-mobile-menu" class="rounded-lg px-2 py-1.5 transition hover:bg-[#f6f9ff]">Solutions</a>
            <a href="#" data-action="close-mobile-menu" class="rounded-lg px-2 py-1.5 transition hover:bg-[#f6f9ff]">Tarifs</a>
            <a href="#" data-action="close-mobile-menu" class="rounded-lg px-2 py-1.5 transition hover:bg-[#f6f9ff]">Contact</a>
          </nav>
          <div>
            ${this.renderActions(true)}
          </div>
        </div>
      </header>
    `;
  }
}
