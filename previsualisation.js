import { playUiSound } from './ui-sound.js';
import { ensureCvDownloadAccess } from './cvAccessFlow.js';

class PrevisualisationCV extends HTMLElement {
    constructor() {
        super();
        this.initialized = false;
        this.isDownloading = false;
        this.pagesRenderToken = null;
        this.pagesRenderTimer = null;
        this.pagesRenderIdleId = null;
        this.scheduledBusyToken = null;
        this.fastRenderDelayMs = 260;
        this.softRenderDelayMs = 420;
        this.moveRenderDelayMs = 120;
        this.forceLoadingOnNextPageRender = true;
        this.uiDependenciesPromise = null;
        this.renderDependenciesPromise = null;
        this.pdfDependenciesPromise = null;
        this.toolsGuideStorageKey = 'cvb-preview-tools-guide-v2';
        this.pendingToolsGuideOpen = false;
        this.toolsGuideDismissedInMemory = false;
        this.previewVersion = 0;
        this.lastPaginatedPreviewVersion = -1;
        this.data = {};
        this.typographyOptions = {
            poppins: {
                label: 'Poppins',
                fontFamily: '"Poppins", sans-serif',
                stylesheetHref: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap'
            },
            inter: {
                label: 'Inter',
                fontFamily: '"Inter", sans-serif',
                stylesheetHref: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
            },
            montserrat: {
                label: 'Montserrat',
                fontFamily: '"Montserrat", sans-serif',
                stylesheetHref: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap'
            },
            nunito: {
                label: 'Nunito Sans',
                fontFamily: '"Nunito Sans", sans-serif',
                stylesheetHref: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;500;600;700;800&display=swap'
            },
            dmSans: {
                label: 'DM Sans',
                fontFamily: '"DM Sans", sans-serif',
                stylesheetHref: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap'
            },
            sourceSans: {
                label: 'Source Sans 3',
                fontFamily: '"Source Sans 3", sans-serif',
                stylesheetHref: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700;800&display=swap'
            },
            plusJakarta: {
                label: 'Plus Jakarta Sans',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                stylesheetHref: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'
            },
            raleway: {
                label: 'Raleway',
                fontFamily: '"Raleway", sans-serif',
                stylesheetHref: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&display=swap'
            },
            lora: {
                label: 'Lora',
                fontFamily: '"Lora", serif',
                stylesheetHref: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap'
            },
            merriweather: {
                label: 'Merriweather',
                fontFamily: '"Merriweather", serif',
                stylesheetHref: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap'
            },
            playfair: {
                label: 'Playfair Display',
                fontFamily: '"Playfair Display", serif',
                stylesheetHref: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
            },
            robotoSlab: {
                label: 'Roboto Slab',
                fontFamily: '"Roboto Slab", serif',
                stylesheetHref: 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;500;600;700&display=swap'
            }
        };
        this.typographyKey = 'poppins';
        this.leftColumnColor = '#2f3e4e';
        this.leftColumnWidth = 30;
        this.minLeftColumnWidth = 22;
        this.maxLeftColumnWidth = 45;
        this.photoShape = 'rect';
        this.titleColor = '#1f2937';
        this.subtitleColor = '#555555';
        this.fontScale = 1;
        this.fontScaleStep = 0.05;
        this.minFontScale = 0.8;
        this.maxFontScale = 1.35;
        this.lineHeightScale = 1;
        this.minLineHeightScale = 0.8;
        this.maxLineHeightScale = 1.4;
        this.elementStyleMap = {};
        this.activeStyleTargetKey = '';
        this.selectedStyleTargetKeys = [];
        this.styleEditorVisible = false;
        this.additionalSelectionMode = false;
        this.moveModeEnabled = false;
        this.moveStepPx = 6;
        this.maxMoveOffsetPx = 600;
        this.topbarScrollContainer = null;
        this.topbarScrollHandler = null;
        this.topbarLastScrollTop = 0;
        this.topbarHidden = false;
        this.userTopbarCollapsed = false;
        this.textOverrideMap = {};
        this.inlineEditorState = null;
        this.pendingStyleResetKey = '';
        this.styleControlDirtyKey = '';
        this.busyOverlayRef = null;
        this.busyIndicatorTimer = null;
        this.busyTokens = new Set();
        this.previewProtectionTimer = null;
        this.visibilityGuardHandler = null;
        this.windowBlurGuardHandler = null;
        this.windowFocusGuardHandler = null;
        this.beforePrintGuardHandler = null;
        this.afterPrintGuardHandler = null;
        this.globalKeyProtectionHandler = null;
        this.contextMenuProtectionHandler = null;
        this.autoFitPending = true;
        this.uiRefs = null;
        this.styleEditorNeedsSync = true;
        this.hotspotDomVersion = 0;
        this.hotspotSelectionState = { selectionSignature: '', domVersion: -1 };
        this.activeHotspotNodes = [];
        this.defaultData = this.createEmptyDataTemplate();
    }

    createEmptyDataTemplate() {
        return {
            firstname: '',
            middlename: '',
            lastname: '',
            designation: '',
            email: '',
            phoneno: '',
            address: '',
            address_number: '',
            address_street: '',
            address_postal: '',
            address_city: '',
            address_country: '',
            summary: '',
            exp_title: '',
            exp_organization: '',
            exp_location: '',
            exp_start_date: '',
            exp_end_date: '',
            exp_description: '',
            experiences: [],
            educations: [],
            phones: [],
            languages: [],
            tools: [],
            softwares: '',
            interests: [],
            image: ''
        };
    }

    async connectedCallback() {
        if (this.initialized) return;
        this.initialized = true;

        await this.ensureDependencies();
        this.render();
        this.bindEvents();
        this.setupPreviewProtection();
        this.setupTopbarAutoHide();
        this.queueToolsGuideIfNeeded();
        await this.ensureTypographyStylesheet(this.typographyKey);
        if (this.isPreviewVisible()) {
            this.updatePreview();
        }
    }

    disconnectedCallback() {
        this.closeInlineTextEditor({ applyChanges: false });
        this.teardownTopbarAutoHide();
        this.stopBusyIndicator();
        if (this.pagesRenderTimer) {
            clearTimeout(this.pagesRenderTimer);
            this.pagesRenderTimer = null;
        }
        if (this.pagesRenderIdleId && typeof window.cancelIdleCallback === 'function') {
            window.cancelIdleCallback(this.pagesRenderIdleId);
            this.pagesRenderIdleId = null;
        }
        if (this.scheduledBusyToken) {
            this.stopBusyIndicator(this.scheduledBusyToken);
            this.scheduledBusyToken = null;
        }
        this.teardownPreviewProtection();
        this.pagesRenderToken = null;
    }

    setupTopbarAutoHide() {
        this.teardownTopbarAutoHide();
        const root = this.querySelector('.pv-root');
        const topbar = this.querySelector('.pv-topbar');
        if (!root || !topbar) return;

        this.topbarScrollContainer = root;
        this.topbarLastScrollTop = Number(root.scrollTop || 0);
        this.topbarHidden = false;
        topbar.classList.remove('pv-topbar-hidden');

        const hideThreshold = 8;
        const revealAtTop = 18;
        this.topbarScrollHandler = () => {
            if (this.userTopbarCollapsed) return;
            const currentTop = Number(root.scrollTop || 0);
            const delta = currentTop - this.topbarLastScrollTop;
            this.topbarLastScrollTop = currentTop;

            if (currentTop <= revealAtTop) {
                if (this.topbarHidden) {
                    this.topbarHidden = false;
                    topbar.classList.remove('pv-topbar-hidden');
                }
                return;
            }

            if (delta > hideThreshold && !this.topbarHidden) {
                this.topbarHidden = true;
                topbar.classList.add('pv-topbar-hidden');
                return;
            }

            if (delta < -hideThreshold && this.topbarHidden) {
                this.topbarHidden = false;
                topbar.classList.remove('pv-topbar-hidden');
            }
        };
        root.addEventListener('scroll', this.topbarScrollHandler, { passive: true });
    }

    teardownTopbarAutoHide() {
        if (this.topbarScrollContainer && this.topbarScrollHandler) {
            this.topbarScrollContainer.removeEventListener('scroll', this.topbarScrollHandler);
        }
        this.topbarScrollContainer = null;
        this.topbarScrollHandler = null;
        this.topbarLastScrollTop = 0;
        this.topbarHidden = false;
        const topbar = this.querySelector('.pv-topbar');
        if (topbar) {
            topbar.classList.remove('pv-topbar-hidden');
        }
    }

    setTopbarCollapsed(collapsed) {
        this.userTopbarCollapsed = Boolean(collapsed);
        const topbar = this.querySelector('.pv-topbar');
        const floatingActions = this.querySelector('[data-floating-actions]');
        if (topbar) {
            topbar.classList.toggle('hidden', this.userTopbarCollapsed);
            if (!this.userTopbarCollapsed) {
                topbar.classList.remove('pv-topbar-hidden');
            }
        }
        if (floatingActions) {
            floatingActions.classList.toggle('hidden', !this.userTopbarCollapsed);
            floatingActions.classList.toggle('flex', this.userTopbarCollapsed);
        }
        if (this.userTopbarCollapsed) {
            this.topbarHidden = false;
        }
    }

    hasSeenToolsGuide() {
        if (this.toolsGuideDismissedInMemory) return true;
        try {
            return window.localStorage?.getItem(this.toolsGuideStorageKey) === '1';
        } catch (error) {
            return false;
        }
    }

    markToolsGuideSeen() {
        this.toolsGuideDismissedInMemory = true;
        try {
            window.localStorage?.setItem(this.toolsGuideStorageKey, '1');
        } catch (error) {
            // Ignore storage failures and keep in-memory state.
        }
    }

    queueToolsGuideIfNeeded() {
        if (this.hasSeenToolsGuide()) return;
        this.pendingToolsGuideOpen = true;
    }

    maybeOpenDeferredToolsGuide() {
        if (!this.pendingToolsGuideOpen || this.hasSeenToolsGuide()) return;
        this.pendingToolsGuideOpen = false;
        this.openToolsGuideModal();
    }

    openToolsGuideModal() {
        const modal = this.querySelector('[data-tools-guide-modal]');
        if (!(modal instanceof HTMLElement)) return false;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.setAttribute('aria-hidden', 'false');
        return true;
    }

    closeToolsGuideModal({ persist = false } = {}) {
        const modal = this.querySelector('[data-tools-guide-modal]');
        if (!(modal instanceof HTMLElement)) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        modal.setAttribute('aria-hidden', 'true');
        if (persist) {
            this.markToolsGuideSeen();
        }
    }

    ensureBusyOverlay() {
        if (this.busyOverlayRef && this.busyOverlayRef.isConnected) {
            return this.busyOverlayRef;
        }
        const overlay = document.createElement('div');
        overlay.className = 'pointer-events-none fixed inset-0 z-[5600] hidden items-center justify-center bg-slate-900/45 backdrop-blur-sm';
        overlay.setAttribute('data-pv-busy-overlay', '1');
        overlay.innerHTML = `
            <div class="w-[min(92vw,420px)] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
                <div class="flex items-center gap-3">
                    <span class="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-slate-300 border-t-sky-600"></span>
                    <div class="min-w-0">
                        <p class="text-sm font-semibold text-slate-900">Traitement en cours</p>
                        <p class="mt-1 text-xs font-medium text-slate-600" data-pv-busy-message>Mise a jour...</p>
                    </div>
                </div>
                <div class="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <span class="block h-full w-[56%] animate-pulse rounded-full bg-sky-600"></span>
                </div>
            </div>
        `;
        this.appendChild(overlay);
        this.busyOverlayRef = overlay;
        return overlay;
    }

    startBusyIndicator(message = 'Mise a jour...', delayMs = 220) {
        const token = Symbol('pv-busy');
        this.busyTokens.add(token);
        const overlay = this.ensureBusyOverlay();
        const messageEl = overlay.querySelector('[data-pv-busy-message]');
        if (messageEl && message) {
            messageEl.textContent = String(message);
        }
        const revealOverlay = () => {
            if (!this.busyTokens.size) return;
            overlay.classList.remove('hidden');
            overlay.classList.add('flex', 'pointer-events-auto');
            overlay.classList.remove('pointer-events-none');
        };
        const safeDelay = Math.max(0, Math.floor(Number(delayMs) || 0));
        if (safeDelay === 0) {
            if (this.busyIndicatorTimer) {
                clearTimeout(this.busyIndicatorTimer);
                this.busyIndicatorTimer = null;
            }
            revealOverlay();
            return token;
        }
        if (!this.busyIndicatorTimer && overlay.classList.contains('hidden')) {
            this.busyIndicatorTimer = window.setTimeout(() => {
                this.busyIndicatorTimer = null;
                revealOverlay();
            }, safeDelay);
        }
        return token;
    }

    stopBusyIndicator(token = null) {
        if (token) {
            this.busyTokens.delete(token);
        } else {
            this.busyTokens.clear();
        }
        if (this.busyTokens.size) return;

        if (this.busyIndicatorTimer) {
            clearTimeout(this.busyIndicatorTimer);
            this.busyIndicatorTimer = null;
        }
        const overlay = this.busyOverlayRef;
        if (!overlay) return;
        overlay.classList.add('hidden', 'pointer-events-none');
        overlay.classList.remove('flex', 'pointer-events-auto');
    }

    async ensureDependencies() {
        if (!this.uiDependenciesPromise) {
            this.uiDependenciesPromise = (async () => {
                const jobs = [
                    this.loadScript('https://cdn.tailwindcss.com', 'cvb-tailwind'),
                    this.loadStylesheet('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap', 'cvb-poppins')
                ];
                if (!this.hasStylesheetContaining('font-awesome')) {
                    jobs.push(this.loadStylesheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css', 'cvb-fa'));
                }
                await Promise.all(jobs);
            })().catch((error) => {
                this.uiDependenciesPromise = null;
                throw error;
            });
        }
        return this.uiDependenciesPromise;
    }

    async ensureRenderDependencies() {
        if (typeof window.html2canvas === 'function') return;
        if (!this.renderDependenciesPromise) {
            this.renderDependenciesPromise = this.loadScript(
                'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
                'cvb-html2canvas'
            ).catch((error) => {
                this.renderDependenciesPromise = null;
                throw error;
            });
        }
        await this.renderDependenciesPromise;
    }

    async ensurePdfDependencies() {
        if (typeof window.html2canvas === 'function' && window.jspdf?.jsPDF) return;
        if (!this.pdfDependenciesPromise) {
            this.pdfDependenciesPromise = Promise.all([
                this.ensureRenderDependencies(),
                window.jspdf?.jsPDF
                    ? Promise.resolve()
                    : this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'cvb-jspdf')
            ]).catch((error) => {
                this.pdfDependenciesPromise = null;
                throw error;
            });
        }
        await this.pdfDependenciesPromise;
    }

    normalizeUrl(value) {
        const raw = String(value || '').trim();
        if (!raw) return '';
        try {
            return new URL(raw, window.location.href).href;
        } catch (error) {
            return raw;
        }
    }

    hasScriptWithSrc(src) {
        const expected = this.normalizeUrl(src);
        if (!expected) return false;
        return Array.from(document.querySelectorAll('script[src]')).some((node) => this.normalizeUrl(node.getAttribute('src')) === expected);
    }

    hasStylesheetWithHref(href) {
        const expected = this.normalizeUrl(href);
        if (!expected) return false;
        return Array.from(document.querySelectorAll('link[rel="stylesheet"][href]')).some((node) => this.normalizeUrl(node.getAttribute('href')) === expected);
    }

    hasStylesheetContaining(fragment) {
        const needle = String(fragment || '').trim().toLowerCase();
        if (!needle) return false;
        return Array.from(document.querySelectorAll('link[rel="stylesheet"][href]')).some((node) => {
            const href = String(node.getAttribute('href') || '').toLowerCase();
            return href.includes(needle);
        });
    }

    loadScript(src, marker) {
        if (document.querySelector(`script[data-${marker}]`) || this.hasScriptWithSrc(src)) return Promise.resolve();
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
        if (document.querySelector(`link[data-${marker}]`) || this.hasStylesheetWithHref(href)) return Promise.resolve();
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

    getTypographyConfig(key) {
        const fallback = this.typographyOptions.poppins;
        if (!key || !Object.prototype.hasOwnProperty.call(this.typographyOptions, key)) {
            return fallback;
        }
        return this.typographyOptions[key] || fallback;
    }

    async ensureTypographyStylesheet(key) {
        const config = this.getTypographyConfig(key);
        if (!config || !config.stylesheetHref) return;
        try {
            const marker = key === 'poppins' ? 'cvb-poppins' : `cvb-font-${key}`;
            await this.loadStylesheet(config.stylesheetHref, marker);
        } catch (error) {
            console.warn('Impossible de charger la police:', key, error);
        }
    }

    getTypographyOptionsMarkup() {
        return Object.entries(this.typographyOptions)
            .map(([key, option]) => {
                const selected = key === this.typographyKey ? ' selected' : '';
                return `<option value="${key}"${selected}>${option.label}</option>`;
            })
            .join('');
    }

    render() {
        this.uiRefs = null;
        this.activeHotspotNodes = [];
        this.hotspotSelectionState = { selectionSignature: '', domVersion: -1 };
        this.hotspotDomVersion = 0;
        this.userTopbarCollapsed = false;
        this.innerHTML = `
            <style>
                .pv-root {
                    background:
                        radial-gradient(circle at 12% 10%, rgba(56, 189, 248, 0.16), transparent 36%),
                        radial-gradient(circle at 86% 8%, rgba(148, 163, 184, 0.2), transparent 40%),
                        linear-gradient(165deg, #0f172a 0%, #111827 45%, #0b1220 100%);
                    min-height: 100dvh;
                    height: auto;
                    max-height: 100dvh;
                    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem);
                    scroll-padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 7rem);
                    -webkit-overflow-scrolling: touch;
                    overscroll-behavior-y: contain;
                }
                .pv-card {
                    position: relative;
                    padding-top: 156px;
                    padding-bottom: calc(18px + env(safe-area-inset-bottom, 0px) + 4.5rem);
                }
                .pv-topbar {
                    position: fixed;
                    top: 0.75rem;
                    left: 50%;
                    width: min(1240px, calc(100vw - 1.5rem));
                    transform: translateX(-50%);
                    border-radius: 20px;
                    border: 1px solid rgba(226, 232, 240, 0.22);
                    background: linear-gradient(135deg, rgba(15, 23, 42, 0.82), rgba(30, 41, 59, 0.66));
                    box-shadow: 16px 16px 38px rgba(2, 6, 23, 0.62), -12px -12px 34px rgba(30, 41, 59, 0.34);
                    backdrop-filter: blur(16px);
                    z-index: 90;
                    transition: transform 0.24s ease, opacity 0.2s ease;
                    will-change: transform, opacity;
                }
                .pv-topbar.pv-topbar-hidden {
                    transform: translate(-50%, -130%);
                    opacity: 0;
                    pointer-events: none;
                }
                .pv-floating-actions {
                    position: fixed;
                    top: calc(env(safe-area-inset-top, 0px) + 0.75rem);
                    right: 0.75rem;
                    z-index: 95;
                    align-items: center;
                    gap: 0.5rem;
                }
                .pv-soft-panel {
                    border: 1px solid rgba(148, 163, 184, 0.36);
                    background: linear-gradient(145deg, rgba(30, 41, 59, 0.58), rgba(15, 23, 42, 0.7));
                    border-radius: 14px;
                    box-shadow: inset 4px 4px 10px rgba(15, 23, 42, 0.62), inset -4px -4px 10px rgba(71, 85, 105, 0.3);
                }
                .pv-topbar label,
                .pv-topbar .pv-title-sm,
                .pv-topbar .pv-title-lg {
                    color: #e2e8f0;
                }
                .pv-topbar select,
                .pv-topbar input[type="text"],
                .pv-topbar input[type="number"],
                .pv-topbar input[type="color"] {
                    border: 1px solid rgba(148, 163, 184, 0.45);
                    background: linear-gradient(145deg, rgba(15, 23, 42, 0.84), rgba(30, 41, 59, 0.72));
                    color: #e2e8f0;
                    box-shadow: inset 2px 2px 6px rgba(15, 23, 42, 0.58), inset -2px -2px 6px rgba(71, 85, 105, 0.25);
                }
                .pv-topbar select option {
                    background: #0f172a;
                    color: #e2e8f0;
                }
                .pv-topbar [data-style-target-label] {
                    color: #bae6fd;
                }
                .pv-topbar button:not(.pv-action-btn) {
                    border: 1px solid rgba(148, 163, 184, 0.45);
                    background: linear-gradient(145deg, rgba(15, 23, 42, 0.84), rgba(30, 41, 59, 0.72));
                    color: #e2e8f0;
                    box-shadow: inset 2px 2px 6px rgba(15, 23, 42, 0.58), inset -2px -2px 6px rgba(71, 85, 105, 0.25);
                }
                .pv-topbar button:not(.pv-action-btn):hover {
                    filter: brightness(1.08);
                }
                .pv-topbar button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .pv-topbar input[type="range"] {
                    accent-color: #38bdf8;
                }
                .pv-action-btn {
                    border: 1px solid rgba(148, 163, 184, 0.42) !important;
                    background: linear-gradient(145deg, rgba(15, 23, 42, 0.7), rgba(30, 41, 59, 0.7)) !important;
                    color: #e2e8f0 !important;
                    border-radius: 14px !important;
                    box-shadow: 7px 7px 18px rgba(2, 6, 23, 0.5), -6px -6px 14px rgba(71, 85, 105, 0.24) !important;
                }
                .pv-action-btn:hover {
                    filter: brightness(1.08);
                }
                .pv-action-btn[data-action="download-pdf"] {
                    border-color: rgba(14, 165, 233, 0.62) !important;
                    background: linear-gradient(135deg, #0284c7, #0ea5e9) !important;
                    color: #e0f2fe !important;
                }
                .pv-cv-wrap {
                    position: relative;
                    border-radius: 22px;
                    isolation: isolate;
                }
                .pv-pages {
                    position: relative;
                    z-index: 1;
                    transition: filter 0.18s ease, opacity 0.18s ease, transform 0.18s ease;
                }
                .pv-capture-layer {
                    position: absolute;
                    inset: 0;
                    z-index: 9;
                    pointer-events: none;
                    border-radius: 22px;
                    overflow: hidden;
                }
                .pv-capture-layer::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        repeating-linear-gradient(-26deg, rgba(14, 165, 233, 0.08) 0 20px, rgba(255, 255, 255, 0) 20px 48px),
                        linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(15, 23, 42, 0.04));
                }
                .pv-capture-chip {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    max-width: calc(100% - 2rem);
                    border-radius: 999px;
                    border: 1px solid rgba(125, 211, 252, 0.48);
                    background: rgba(15, 23, 42, 0.72);
                    padding: 0.45rem 0.8rem;
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #e0f2fe;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.22);
                }
                .pv-capture-watermark {
                    position: absolute;
                    inset: 12% 6%;
                    display: grid;
                    place-items: center;
                    font-size: clamp(2rem, 5vw, 4.6rem);
                    font-weight: 800;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: rgba(15, 23, 42, 0.07);
                    transform: rotate(-18deg);
                    text-align: center;
                    line-height: 1.1;
                }
                .pv-capture-warning {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                    background: rgba(15, 23, 42, 0.76);
                    color: #f8fafc;
                    font-size: clamp(1rem, 2vw, 1.35rem);
                    font-weight: 700;
                    letter-spacing: 0.04em;
                    text-align: center;
                    opacity: 0;
                    transform: scale(0.98);
                    transition: opacity 0.16s ease, transform 0.16s ease;
                    backdrop-filter: blur(14px);
                }
                .pv-cv-wrap.is-screen-guarded .pv-pages {
                    filter: blur(18px) saturate(0.7);
                    opacity: 0.4;
                    transform: scale(0.985);
                    pointer-events: none;
                }
                .pv-cv-wrap.is-screen-guarded .pv-capture-warning {
                    opacity: 1;
                    transform: scale(1);
                }
                [data-tools-guide-panel] details[data-tools-guide-section] {
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    background: #f8fafc;
                    overflow: hidden;
                }
                [data-tools-guide-panel] details[data-tools-guide-section][open] {
                    background: #ffffff;
                    box-shadow: inset 0 0 0 1px rgba(14, 165, 233, 0.08);
                }
                [data-tools-guide-panel] details[data-tools-guide-section] summary {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.75rem;
                    cursor: pointer;
                    list-style: none;
                    padding: 0.95rem 1rem;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: #0f172a;
                }
                [data-tools-guide-panel] details[data-tools-guide-section] summary::-webkit-details-marker {
                    display: none;
                }
                [data-tools-guide-panel] details[data-tools-guide-section] summary::after {
                    content: '+';
                    flex: 0 0 auto;
                    font-size: 1rem;
                    font-weight: 800;
                    color: #0284c7;
                }
                [data-tools-guide-panel] details[data-tools-guide-section][open] summary::after {
                    content: '-';
                }
                [data-tools-guide-panel] details[data-tools-guide-section] > div {
                    border-top: 1px solid #e2e8f0;
                    padding: 0 1rem 1rem;
                }
                [data-tools-guide-modal] {
                    overflow-y: auto;
                    overscroll-behavior: contain;
                    -webkit-overflow-scrolling: touch;
                    touch-action: pan-y;
                }
                [data-tools-guide-panel] {
                    max-height: calc(100dvh - 1rem - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
                }
                [data-tools-guide-scroll] {
                    flex: 1 1 auto;
                    min-height: 0;
                    overflow-y: auto;
                    overscroll-behavior: contain;
                    -webkit-overflow-scrolling: touch;
                    touch-action: pan-y;
                    padding-bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px));
                }
                .pv-page-shell {
                    border-radius: 16px;
                    border: 1px solid rgba(203, 213, 225, 0.52);
                    background: rgba(255, 255, 255, 0.66);
                    box-shadow: 12px 12px 26px rgba(15, 23, 42, 0.2), -8px -8px 20px rgba(255, 255, 255, 0.72);
                    backdrop-filter: blur(8px);
                    padding: 7px;
                }
                .pv-page-label {
                    color: #cbd5e1;
                }
                .pv-page-frame {
                    position: relative;
                    overflow: hidden;
                    border-radius: 12px;
                    background: #ffffff;
                    border: 1px solid rgba(148, 163, 184, 0.55);
                    box-shadow: inset 2px 2px 8px rgba(241, 245, 249, 0.92), inset -2px -2px 8px rgba(203, 213, 225, 0.72);
                }
                .pv-hotspot {
                    transition: background-color 120ms ease, box-shadow 120ms ease, transform 70ms linear;
                    border-radius: 3px;
                }
                .pv-hotspot:hover {
                    background: rgba(125, 211, 252, 0.22);
                }
                .pv-hotspot.is-active {
                    background: rgba(56, 189, 248, 0.22);
                    box-shadow: inset 0 0 0 2px rgba(14, 165, 233, 0.85);
                }
                .pv-hotspot.is-draggable {
                    cursor: grab;
                    touch-action: none;
                }
                .pv-hotspot.is-dragging {
                    cursor: grabbing;
                }
                .pv-last-resize-handle {
                    position: absolute;
                    left: 50%;
                    bottom: 8px;
                    transform: translateX(-50%);
                    width: min(58%, 260px);
                    height: 16px;
                    border: 1px solid rgba(14, 165, 233, 0.42);
                    border-radius: 999px;
                    background: linear-gradient(135deg, rgba(186, 230, 253, 0.96), rgba(125, 211, 252, 0.96));
                    box-shadow: 0 8px 18px rgba(14, 116, 144, 0.28);
                    cursor: ns-resize;
                    z-index: 5;
                }
                .pv-last-resize-handle::before {
                    content: '';
                    position: absolute;
                    inset: 4px 36%;
                    border-radius: 999px;
                    background: rgba(2, 132, 199, 0.78);
                }
                .pv-last-resize-handle:hover {
                    filter: brightness(1.03);
                }
                .pv-drag-cursor {
                    cursor: grabbing !important;
                    user-select: none !important;
                }
                @media (max-width: 1024px) {
                    .pv-topbar {
                        top: 0.5rem;
                        width: min(1240px, calc(100vw - 1rem));
                    }
                    .pv-card {
                        padding-top: 198px;
                    }
                }
                @media (max-width: 640px) {
                    .pv-root {
                        padding-bottom: calc(92px + env(safe-area-inset-bottom, 0px));
                    }
                    .pv-topbar {
                        position: sticky;
                        top: calc(env(safe-area-inset-top, 0px) + 0.35rem);
                        left: auto;
                        width: 100%;
                        transform: none;
                        margin-bottom: 0.65rem;
                    }
                    .pv-topbar.pv-topbar-hidden {
                        transform: translateY(-130%);
                    }
                    .pv-card {
                        padding-top: 0;
                        padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
                    }
                    .pv-cv-wrap {
                        padding-bottom: calc(92px + env(safe-area-inset-bottom, 0px));
                    }
                    .pv-floating-actions {
                        top: calc(env(safe-area-inset-top, 0px) + 0.5rem);
                        right: 0.5rem;
                        left: 0.5rem;
                        justify-content: flex-end;
                    }
                }
            </style>
            <section class="pv-root relative h-screen overflow-y-auto p-2 font-[Poppins] sm:p-3">
                <div class="pv-card mx-auto flex max-w-[1240px] flex-col gap-3">
                    <div class="pv-topbar flex flex-wrap items-center justify-end gap-2 p-2 sm:p-3">
                        <div class="pv-actions flex flex-wrap items-center justify-end gap-2">
                            <div class="pv-soft-panel flex flex-wrap items-center gap-2 px-2 py-1.5">
                                <label class="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    Typo
                                    <select data-action="typography-select" class="h-8 rounded-md border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 sm:text-xs">
                                        ${this.getTypographyOptionsMarkup()}
                                    </select>
                                </label>
                                <label class="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    Colonne
                                    <input type="range" min="${this.minLeftColumnWidth}" max="${this.maxLeftColumnWidth}" step="1" value="${this.leftColumnWidth}" data-action="left-width-input" class="h-2 w-24 cursor-pointer accent-sky-700" aria-label="Largeur colonne gauche">
                                    <span class="min-w-[38px] text-right text-[11px] text-slate-700 sm:text-xs" data-left-col-width-label>${this.leftColumnWidth}%</span>
                                </label>
                                <label class="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    Photo
                                    <select data-action="photo-shape-select" class="h-8 rounded-md border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 sm:text-xs">
                                        <option value="rect"${this.photoShape === 'rect' ? ' selected' : ''}>Rectangle</option>
                                        <option value="circle"${this.photoShape === 'circle' ? ' selected' : ''}>Ronde</option>
                                    </select>
                                </label>
                                <label class="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    Gauche
                                    <input type="color" value="${this.leftColumnColor}" data-action="left-color-input" class="h-8 w-9 cursor-pointer rounded border border-slate-300 bg-white p-0.5" aria-label="Couleur de la colonne gauche">
                                </label>
                                <button type="button" data-action="save-global-edits" class="inline-flex h-8 items-center justify-center rounded border border-sky-700 bg-sky-700 px-3 text-[11px] font-semibold text-white hover:bg-sky-800 sm:text-xs">
                                    Save
                                </button>
                                <button type="button" data-action="open-tools-guide" class="inline-flex h-8 items-center justify-center rounded border border-slate-300 bg-white px-3 text-[11px] font-semibold text-slate-800 hover:bg-slate-100 sm:text-xs">
                                    Aide outils
                                </button>
                            </div>
                            <div class="pv-soft-panel hidden max-w-full flex-wrap items-center gap-2 px-2 py-1.5" data-style-editor>
                                <p class="mr-2 whitespace-nowrap text-[11px] font-semibold text-sky-800 sm:text-xs">
                                    Bloc: <span data-style-target-label>Aucun</span>
                                </p>
                                <label class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    Texte
                                    <input type="color" data-style-control="textColor" class="h-8 w-9 cursor-pointer rounded border border-slate-300 bg-white p-0.5" value="#222222">
                                </label>
                                <label class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    Fond
                                    <input type="color" data-style-control="bgColor" class="h-8 w-9 cursor-pointer rounded border border-slate-300 bg-white p-0.5" value="#ffffff">
                                </label>
                                <label class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    Taille
                                    <input type="text" inputmode="decimal" data-style-control="fontSizePx" class="h-8 w-16 rounded border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 sm:text-xs" placeholder="14">
                                </label>
                                <label class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    Interligne
                                    <input type="number" min="0.8" max="3" step="0.05" data-style-control="lineHeight" class="h-8 w-16 rounded border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 sm:text-xs" placeholder="auto">
                                </label>
                                <label class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    Align
                                    <select data-style-control="textAlign" class="h-8 rounded border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 sm:text-xs">
                                        <option value="">Auto</option>
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                        <option value="justify">Justify</option>
                                    </select>
                                </label>
                                <label class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    Puces
                                    <select data-style-control="bulletStyle" class="h-8 rounded border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 sm:text-xs">
                                        <option value="none">Aucune</option>
                                        <option value="disc">Disc</option>
                                        <option value="circle">Circle</option>
                                        <option value="square">Square</option>
                                        <option value="decimal">Decimal</option>
                                        <option value="lower-alpha">a,b,c</option>
                                        <option value="upper-alpha">A,B,C</option>
                                    </select>
                                </label>
                                <label class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    L
                                    <input type="number" min="20" max="900" step="1" data-style-control="widthPx" class="h-8 w-16 rounded border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 sm:text-xs" placeholder="auto">
                                </label>
                                <label class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    H
                                    <input type="number" min="20" max="900" step="1" data-style-control="heightPx" class="h-8 w-16 rounded border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 sm:text-xs" placeholder="auto">
                                </label>
                                <label class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    Haut
                                    <input type="number" min="0" max="${this.maxMoveOffsetPx}" step="1" data-style-control="offsetTopPx" class="h-8 w-16 rounded border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 sm:text-xs" placeholder="0">
                                </label>
                                <label class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    Bas
                                    <input type="number" min="0" max="${this.maxMoveOffsetPx}" step="1" data-style-control="offsetBottomPx" class="h-8 w-16 rounded border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 sm:text-xs" placeholder="0">
                                </label>
                                <label class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    Left
                                    <input type="number" min="0" max="${this.maxMoveOffsetPx}" step="1" data-style-control="offsetLeftPx" class="h-8 w-16 rounded border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 sm:text-xs" placeholder="0">
                                </label>
                                <label class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 sm:text-xs">
                                    Right
                                    <input type="number" min="0" max="${this.maxMoveOffsetPx}" step="1" data-style-control="offsetRightPx" class="h-8 w-16 rounded border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 sm:text-xs" placeholder="0">
                                </label>
                                <div class="inline-flex items-center gap-1">
                                    <button type="button" data-action="style-bold" class="inline-flex h-8 min-w-8 items-center justify-center rounded border border-slate-300 bg-white px-2 text-xs font-bold text-slate-900 hover:bg-slate-100">B</button>
                                    <button type="button" data-action="style-italic" class="inline-flex h-8 min-w-8 items-center justify-center rounded border border-slate-300 bg-white px-2 text-xs italic text-slate-900 hover:bg-slate-100">I</button>
                                    <button type="button" data-action="style-underline" class="inline-flex h-8 min-w-8 items-center justify-center rounded border border-slate-300 bg-white px-2 text-xs underline text-slate-900 hover:bg-slate-100">U</button>
                                </div>
                                <button type="button" data-action="style-split-two" class="inline-flex h-8 items-center justify-center rounded border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 hover:bg-slate-100 sm:text-xs">
                                    Diviser x2
                                </button>
                                <button type="button" data-action="style-reset" class="inline-flex h-8 items-center justify-center rounded border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 hover:bg-slate-100 sm:text-xs">
                                    Reset bloc
                                </button>
                                <button type="button" data-action="save-style-edits" class="inline-flex h-8 items-center justify-center rounded border border-sky-700 bg-sky-700 px-2 text-[11px] font-semibold text-white hover:bg-sky-800 sm:text-xs">
                                    Save
                                </button>
                                <button type="button" data-action="style-select-another" class="inline-flex h-8 items-center justify-center rounded border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 hover:bg-slate-100 sm:text-xs">
                                    Selectionner un autre
                                </button>
                                <button type="button" data-action="style-open-inline-editor" class="inline-flex h-8 items-center justify-center rounded border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 hover:bg-slate-100 sm:text-xs">
                                    Editer
                                </button>
                                <button type="button" data-action="style-close-editor" class="inline-flex h-8 items-center justify-center rounded border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800 hover:bg-slate-100 sm:text-xs">
                                    Fermer
                                </button>
                            </div>
                            <button type="button" class="pv-action-btn inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-300 bg-slate-200 px-3 text-xs font-semibold text-slate-800 hover:bg-slate-300 sm:min-h-10 sm:text-sm" data-action="back">
                                <i class="fa-solid fa-arrow-left"></i>Retour
                            </button>
                            <button type="button" class="pv-action-btn inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-300 bg-slate-200 px-3 text-xs font-semibold text-slate-800 hover:bg-slate-300 sm:min-h-10 sm:text-sm" data-action="close-builder">
                                <i class="fa-solid fa-eye-slash"></i>Masquer outils
                            </button>
                            <button type="button" class="pv-action-btn inline-flex min-h-9 items-center gap-2 rounded-lg border border-sky-700 bg-sky-700 px-3 text-xs font-semibold text-white hover:bg-sky-800 sm:min-h-10 sm:text-sm" data-action="download-pdf">
                                <i class="fa-solid fa-file-arrow-down"></i>Telecharger PDF
                            </button>
                        </div>
                        <p data-pdf-pages-hint class="hidden w-full text-right text-[11px] font-semibold text-slate-600 sm:text-xs"></p>
                    </div>
                    <div data-floating-actions class="pv-floating-actions hidden">
                        <button type="button" data-action="reopen-topbar" class="inline-flex h-10 items-center gap-2 rounded-full border border-slate-300 bg-white/95 px-4 text-xs font-semibold text-slate-800 shadow-lg backdrop-blur-sm hover:bg-white">
                            <i class="fa-solid fa-sliders"></i>Ouvrir outils
                        </button>
                        <button type="button" data-action="open-tools-guide" class="inline-flex h-10 items-center gap-2 rounded-full border border-slate-300 bg-white/95 px-4 text-xs font-semibold text-slate-800 shadow-lg backdrop-blur-sm hover:bg-white">
                            <i class="fa-solid fa-circle-question"></i>Guide
                        </button>
                        <button type="button" data-action="download-pdf" class="pv-action-btn inline-flex h-10 items-center gap-2 rounded-full border border-sky-700 bg-sky-700 px-4 text-xs font-semibold text-white shadow-lg">
                            <i class="fa-solid fa-file-arrow-down"></i>PDF
                        </button>
                    </div>

                    <div class="pv-cv-wrap overflow-x-auto overflow-y-hidden snap-x snap-proximity pb-3">
                        <div class="pv-capture-layer" aria-hidden="true">
                            <div class="pv-capture-chip">Apercu protege</div>
                            <div class="pv-capture-watermark">Hiprofil<br>Preview</div>
                            <div class="pv-capture-warning" data-capture-warning>Contenu protege pendant la verification.</div>
                        </div>
                        <div class="pv-viewport mx-auto w-full max-w-full px-2">
                            <div class="pv-pages flex min-w-max snap-x snap-proximity flex-row items-start gap-6 pb-2 md:gap-8" data-preview-pages></div>

                            <div class="hidden" aria-hidden="true">
                                <div id="pv-preview" class="pv-paper pv-print grid items-start w-[794px] grid-cols-[30%_70%] border border-slate-300 bg-white text-[#222222] shadow-sm">
                                    <aside class="pv-left flex min-w-0 flex-col bg-[#2f3e4e] text-white">
                                        <div class="pv-photo-wrap flex h-[250px] w-full items-center justify-center overflow-hidden">
                                            <img data-preview="image" data-edit-step="image" data-edit-block alt="photo" class="pv-photo h-[250px] w-full cursor-pointer object-cover" style="display:block;width:100%;height:250px;object-fit:cover;object-position:center;">
                                        </div>

                                        <section class="pv-l-section flex flex-col px-5 py-5 text-center" data-autofit-box data-edit-step="summary">
                                            <h4 class="pv-l-title text-center text-[14px] font-medium uppercase tracking-[4px]">Profile</h4>
                                            <div class="pv-l-line mx-auto my-3 h-[3px] w-10 rounded bg-white"></div>
                                            <p class="pv-l-text cursor-pointer break-words px-5 text-center text-[14px] leading-[1.6] hover:opacity-90" data-preview="summary" data-edit-step="summary" data-edit-block data-autofit data-autofit-min="8"></p>
                                        </section>

                                        <section class="pv-l-section flex flex-col px-5 py-5 text-center" data-autofit-box data-edit-step="email">
                                            <h4 class="pv-l-title text-center text-[14px] font-medium uppercase tracking-[4px]">Contact</h4>
                                            <div class="pv-l-line mx-auto my-3 h-[3px] w-10 rounded bg-white"></div>
                                            <ul class="pv-l-list m-0 list-none px-5">
                                                <li class="pv-l-item mb-2 flex flex-wrap cursor-pointer items-center justify-center gap-2 break-words text-[14px] leading-[1.6] opacity-90 hover:opacity-100" data-edit-step="email" data-edit-block data-autofit data-autofit-min="8"><i class="fa-solid fa-envelope text-base"></i><span class="break-all" data-preview="email"></span></li>
                                                <li class="pv-l-item mb-2 flex cursor-pointer items-center justify-center gap-2 break-words text-[14px] leading-[1.6] opacity-90 hover:opacity-100" data-edit-step="phones" data-edit-block data-autofit data-autofit-min="8"><i class="fa-solid fa-phone text-base"></i><span data-preview="phoneno"></span></li>
                                                <li class="pv-l-item mb-2 flex cursor-pointer items-center justify-center gap-2 break-words text-[14px] leading-[1.6] opacity-90 hover:opacity-100" data-edit-step="address" data-edit-block data-autofit data-autofit-min="8"><i class="fa-solid fa-location-dot text-base"></i><span data-preview="address"></span></li>
                                            </ul>
                                        </section>

                                        <section class="pv-l-section flex flex-col px-5 py-5 text-center" data-autofit-box data-edit-step="interests">
                                            <h4 class="pv-l-title text-center text-[14px] font-medium uppercase tracking-[4px]">Interets</h4>
                                            <div class="pv-l-line mx-auto my-3 h-[3px] w-10 rounded bg-white"></div>
                                            <ul class="pv-l-list m-0 list-none px-5" data-preview-list="interests" data-edit-step="interests"></ul>
                                        </section>
                                    </aside>

                                    <main class="pv-right flex min-w-0 flex-col gap-6 bg-white p-10 text-[#222222]">
                                        <header class="pv-r-header" data-autofit-box data-edit-step="firstname">
                                            <h1 class="pv-r-name m-0 mb-[5px] cursor-pointer break-words text-[40px] font-semibold leading-[1.1] tracking-[1px] hover:opacity-90" data-preview="fullname" data-edit-step="firstname" data-edit-block data-autofit data-autofit-min="16"></h1>
                                            <p class="pv-r-role m-0 cursor-pointer break-words text-[14px] font-normal uppercase tracking-[6px] text-[#555555] hover:opacity-90" data-preview="designation" data-edit-step="designation" data-edit-block data-autofit data-autofit-min="8"></p>
                                        </header>

                                        <section class="pv-r-section flex flex-col" data-autofit-box data-edit-step="educations">
                                            <h4 class="pv-r-title m-0 mb-[15px] text-[16px] font-semibold uppercase tracking-[3px]">Formation</h4>
                                            <div class="pv-r-line mb-3.5 h-1 w-[50px] rounded bg-[#2f3e4e]"></div>
                                            <ul class="pv-edu-list list-disc pl-[22px]" data-preview-list="educations" data-edit-step="educations"></ul>
                                        </section>

                                        <section class="pv-r-section flex flex-col" data-autofit-box data-edit-step="experiences">
                                            <h4 class="pv-r-title m-0 mb-[15px] text-[16px] font-semibold uppercase tracking-[3px]">Experience</h4>
                                            <div class="pv-r-line mb-3.5 h-1 w-[50px] rounded bg-[#2f3e4e]"></div>
                                            <div data-autofit-box>
                                                <article class="pv-exp-item flex gap-[14px]" data-edit-step="experiences" data-edit-block>
                                                    <div class="pv-exp-date w-[110px] shrink-0 cursor-pointer text-[14px] font-semibold hover:opacity-90" data-preview="exp_dates" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8"></div>
                                                    <div class="pv-exp-content flex-1">
                                                        <p class="pv-exp-role m-0 cursor-pointer break-words text-[14px] font-semibold uppercase hover:opacity-90" data-preview="exp_title" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8"></p>
                                                        <p class="pv-exp-company m-0 mt-0.5 cursor-pointer break-words text-[14px] font-medium hover:opacity-90" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8"><span data-preview="exp_organization"></span> - <span data-preview="exp_location"></span></p>
                                                        <ul class="pv-exp-list mb-0 mt-2 list-disc pl-[18px] text-[14px] leading-[1.5]" data-preview-list="exp_bullets" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8"></ul>
                                                    </div>
                                                </article>
                                            </div>
                                        </section>

                                        <section class="pv-r-section flex flex-col" data-autofit-box>
                                            <h4 class="pv-r-title m-0 mb-[15px] text-[16px] font-semibold uppercase tracking-[3px]">Competences</h4>
                                            <div class="pv-r-line mb-3.5 h-1 w-[50px] rounded bg-[#2f3e4e]"></div>
                                            <div class="pv-skills-grid grid grid-cols-2 gap-[18px]" data-autofit-box>
                                                <div data-edit-step="languages">
                                                    <p class="pv-sk-col-title m-0 mb-[7px] text-[14px] font-semibold uppercase tracking-[1px]">Langues</p>
                                                    <ul class="pv-sk-list m-0 list-disc pl-4 text-[14px] leading-[1.6]" data-preview-list="languages" data-edit-step="languages" data-autofit data-autofit-min="8"></ul>
                                                </div>
                                                <div data-edit-step="tools">
                                                    <p class="pv-sk-col-title m-0 mb-[7px] cursor-pointer text-[14px] font-semibold uppercase tracking-[1px] hover:opacity-90" data-preview="tools_title" data-edit-step="tools" data-edit-block>Logiciels</p>
                                                    <ul class="pv-sk-list m-0 list-disc pl-4 text-[14px] leading-[1.6]" data-preview-list="softwares" data-edit-step="tools" data-autofit data-autofit-min="8"></ul>
                                                </div>
                                            </div>
                                        </section>
                                    </main>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="fixed inset-0 z-[70] hidden items-center justify-center bg-slate-900/45 px-4" data-inline-modal aria-hidden="true">
                        <div class="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-5" data-inline-modal-panel data-inline-text-editor="1">
                            <p class="text-sm font-semibold text-slate-900">Modifier la valeur</p>
                            <p class="mt-1 text-xs text-slate-500">Bloc: <span data-inline-modal-label>Champ</span></p>
                            <textarea data-inline-input class="mt-3 h-32 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500"></textarea>
                            <div class="mt-3 flex items-center justify-end gap-2">
                                <button type="button" data-action="inline-text-cancel" class="inline-flex h-9 items-center justify-center rounded border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
                                <button type="button" data-action="inline-text-save" class="inline-flex h-9 items-center justify-center rounded border border-sky-700 bg-sky-700 px-3 text-xs font-semibold text-white hover:bg-sky-800">Save</button>
                            </div>
                        </div>
                    </div>

                    <div class="fixed inset-0 z-[5400] hidden items-end justify-center overflow-y-auto bg-slate-950/70 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6" data-tools-guide-modal aria-hidden="true">
                        <div class="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl" data-tools-guide-panel>
                            <div class="border-b border-slate-200 bg-slate-900 px-4 py-4 text-white sm:px-6">
                                <div class="flex items-start justify-between gap-3">
                                    <div class="min-w-0">
                                        <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300 sm:text-xs">Guide Important</p>
                                        <h3 class="mt-1 text-base font-semibold sm:text-xl">Utilisation des outils de previsualisation</h3>
                                        <p class="mt-2 text-xs font-medium leading-5 text-slate-300 sm:text-sm">Cette fenetre s affiche a chaque ouverture de la previsualisation tant que vous n avez pas choisi de la masquer definitivement.</p>
                                    </div>
                                    <button type="button" data-action="tools-guide-close" class="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm text-white hover:bg-white/20" aria-label="Fermer le guide">
                                        <i class="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="px-4 py-4 text-slate-700 sm:px-6 sm:py-5" data-tools-guide-scroll>
                                <div class="rounded-2xl border border-red-200 bg-red-50 px-4 py-4">
                                    <p class="text-xs font-bold uppercase tracking-[0.12em] text-red-700 sm:text-sm">Avertissement obligatoire</p>
                                    <p class="mt-2 text-sm font-semibold leading-6 text-red-900">La barre des outils doit etre utilisee uniquement pour des corrections mineures.</p>
                                    <p class="mt-2 text-sm leading-6 text-red-800">Elle n a pas ete construite comme un editeur de texte avance. Elle sert a corriger un decalage, une couleur, une largeur, un espacement ou une petite erreur locale. Si vous l utilisez pour reecrire beaucoup de contenu, vous risquez d etre frustre par la complexite du comportement. Pour des modifications lourdes, revenez au formulaire principal.</p>
                                </div>

                                <div class="mt-4 space-y-3">
                                    <details data-tools-guide-section open>
                                        <summary>Barre principale</summary>
                                        <div>
                                            <ul class="mt-3 space-y-2 text-sm leading-6">
                                                <li><span class="font-semibold text-slate-900">Typo:</span> change la famille de police globale.</li>
                                                <li><span class="font-semibold text-slate-900">Colonne:</span> ajuste la largeur de la colonne gauche pour un petit reequilibrage.</li>
                                                <li><span class="font-semibold text-slate-900">Photo:</span> passe de rectangle a ronde sans changer l image source.</li>
                                                <li><span class="font-semibold text-slate-900">Gauche:</span> change la couleur de la colonne gauche et des accents relies.</li>
                                                <li><span class="font-semibold text-slate-900">Save:</span> applique uniquement les changements en attente dans cette barre.</li>
                                                <li><span class="font-semibold text-slate-900">Masquer outils:</span> ferme la barre principale. Rouvrez-la avec <span class="font-semibold">Ouvrir outils</span>.</li>
                                                <li><span class="font-semibold text-slate-900">PDF:</span> telecharge le PDF courant sans quitter la previsualisation.</li>
                                                <li><span class="font-semibold text-slate-900">Retour:</span> renvoie vers l etape precedente du builder.</li>
                                            </ul>
                                        </div>
                                    </details>

                                    <details data-tools-guide-section>
                                        <summary>Barre de bloc</summary>
                                        <div>
                                            <ul class="mt-3 space-y-2 text-sm leading-6">
                                                <li><span class="font-semibold text-slate-900">Ouverture:</span> double-cliquez sur un bloc pour ouvrir la seconde barre.</li>
                                                <li><span class="font-semibold text-slate-900">Bloc:</span> montre la cible active. <span class="font-semibold">(+1)</span> ou plus signifie multi-selection.</li>
                                                <li><span class="font-semibold text-slate-900">Texte / Fond:</span> changent localement la couleur du bloc vise.</li>
                                                <li><span class="font-semibold text-slate-900">Taille / Interligne / Align / Puces:</span> modifient uniquement le style local du bloc.</li>
                                                <li><span class="font-semibold text-slate-900">L / H:</span> imposent une largeur ou hauteur locale pour un micro-ajustement.</li>
                                                <li><span class="font-semibold text-slate-900">B / I / U:</span> activent gras, italique et soulignement sur la cible.</li>
                                                <li><span class="font-semibold text-slate-900">Editer:</span> ouvre la modale de valeur pour modifier le texte du bloc actif. Desactive en multi-selection.</li>
                                                <li><span class="font-semibold text-slate-900">Reset bloc:</span> supprime les corrections locales du bloc.</li>
                                                <li><span class="font-semibold text-slate-900">Fermer:</span> ferme seulement la seconde barre.</li>
                                                <li><span class="font-semibold text-slate-900">Save:</span> applique uniquement les changements en attente dans cette barre.</li>
                                            </ul>
                                        </div>
                                    </details>

                                    <details data-tools-guide-section>
                                        <summary>Multi-selection, deplacement et division</summary>
                                        <div>
                                            <ul class="mt-3 space-y-2 text-sm leading-6">
                                                <li><span class="font-semibold text-slate-900">Selectionner un autre:</span> active la multi-selection pour appliquer la meme correction a plusieurs blocs.</li>
                                                <li><span class="font-semibold text-slate-900">Haut / Bas / Left / Right:</span> deplacent finement le bloc avec des valeurs numeriques. Utilisez de petites valeurs.</li>
                                                <li><span class="font-semibold text-slate-900">Diviser x2:</span> coupe le contenu cible en deux blocs horizontaux egaux quand la structure du bloc le permet.</li>
                                                <li><span class="font-semibold text-slate-900">Ordre conseille:</span> selectionnez, entrez une valeur, puis validez avec <span class="font-semibold">Save</span> avant de continuer.</li>
                                            </ul>
                                        </div>
                                    </details>

                                    <details data-tools-guide-section>
                                        <summary>Bonnes pratiques et limites</summary>
                                        <div>
                                            <ul class="mt-3 space-y-2 text-sm leading-6">
                                                <li>Faites une petite modification a la fois, puis validez avec <span class="font-semibold">Save</span>.</li>
                                                <li>N empilez pas trop de corrections locales sur trop de blocs en meme temps.</li>
                                                <li>Si la mise en page change fortement, revenez au formulaire principal au lieu de forcer la barre d outils.</li>
                                                <li>Utilisez la multi-selection pour harmoniser plusieurs petits elements, pas pour reformater tout le CV.</li>
                                                <li>Pour du texte long ou structurel, modifiez la source du contenu en amont.</li>
                                            </ul>
                                        </div>
                                    </details>
                                </div>
                            </div>
                            <div class="border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
                                <div class="flex flex-col gap-3">
                                    <p class="text-xs font-semibold leading-5 text-slate-500">Confirmez que vous avez compris: ces outils servent a des ajustements visuels mineurs, pas a une edition de texte avancee.</p>
                                    <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                        <button type="button" data-action="tools-guide-hide-forever" class="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                                            Ne plus afficher ce message
                                        </button>
                                        <button type="button" data-action="tools-guide-ack" class="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-sky-700 bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800">
                                            Continuer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    ensureUiRefs() {
        if (this.uiRefs?.topbar?.isConnected) {
            return this.uiRefs;
        }

        const actionNames = [
            'left-color-input',
            'typography-select',
            'left-width-input',
            'photo-shape-select',
            'save-global-edits',
            'save-style-edits',
            'style-select-another',
            'style-reset',
            'style-open-inline-editor',
            'style-close-editor',
            'style-bold',
            'style-italic',
            'style-underline',
            'style-split-two'
        ];
        const actionButtons = {};
        actionNames.forEach((action) => {
            actionButtons[action] = this.querySelector(`[data-action="${action}"]`);
        });

        const styleControlNodes = Array.from(this.querySelectorAll('[data-style-control]'));
        const styleControls = {};
        styleControlNodes.forEach((node) => {
            const key = String(node.getAttribute('data-style-control') || '').trim();
            if (key) styleControls[key] = node;
        });

        this.uiRefs = {
            topbar: this.querySelector('.pv-topbar'),
            colorInput: actionButtons['left-color-input'] || null,
            typographySelect: actionButtons['typography-select'] || null,
            leftWidthInput: actionButtons['left-width-input'] || null,
            leftWidthLabel: this.querySelector('[data-left-col-width-label]'),
            shapeSelect: actionButtons['photo-shape-select'] || null,
            globalSaveBtn: actionButtons['save-global-edits'] || null,
            editor: this.querySelector('[data-style-editor]'),
            styleTargetLabel: this.querySelector('[data-style-target-label]'),
            styleControlNodes,
            styleControls,
            actionButtons
        };
        return this.uiRefs;
    }

    getActionButton(action) {
        return this.ensureUiRefs().actionButtons?.[action] || null;
    }

    getStyleToggleActions() {
        return ['style-bold', 'style-italic', 'style-underline', 'style-split-two'];
    }

    getStyleControlNodes() {
        return this.ensureUiRefs().styleControlNodes || [];
    }

    resetStyleControlDirtyFlags() {
        this.getStyleControlNodes().forEach((node) => {
            node.dataset.styleDirty = '0';
        });
    }

    resetStyleToggleDirtyFlags() {
        this.getStyleToggleActions().forEach((action) => {
            const btn = this.getActionButton(action);
            if (btn) btn.dataset.styleDirty = '0';
        });
    }

    toAttrSelectorValue(value) {
        return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    normalizeStyleTargetKeys(keys = []) {
        const seen = new Set();
        return (Array.isArray(keys) ? keys : [])
            .map((key) => String(key || '').trim())
            .filter((key) => {
                if (!key || seen.has(key)) return false;
                seen.add(key);
                return true;
            });
    }

    getSelectedStyleTargetKeys() {
        const keys = this.normalizeStyleTargetKeys(this.selectedStyleTargetKeys);
        const activeKey = String(this.activeStyleTargetKey || '').trim();
        if (activeKey && !keys.includes(activeKey)) {
            keys.unshift(activeKey);
        }
        return keys;
    }

    shouldAddToSelection() {
        return Boolean(this.additionalSelectionMode && this.activeStyleTargetKey);
    }

    addStyleTargetToSelection(key, openEditor = false) {
        const cleanKey = String(key || '').trim();
        if (!cleanKey) return;
        const currentKeys = this.getSelectedStyleTargetKeys();
        if (!currentKeys.length) {
            this.selectStyleTargetByKey(cleanKey, openEditor);
            return;
        }
        if (!currentKeys.includes(cleanKey)) {
            this.selectedStyleTargetKeys = [...currentKeys, cleanKey];
            this.styleEditorNeedsSync = true;
        }
        if (openEditor) {
            this.styleEditorVisible = true;
        }
        this.updateCustomControlsUi();
    }

    handleStyleTargetSelection(key, openEditor = false) {
        const cleanKey = String(key || '').trim();
        if (!cleanKey) return;
        if (this.shouldAddToSelection()) {
            this.addStyleTargetToSelection(cleanKey, openEditor);
            return;
        }
        this.selectStyleTargetByKey(cleanKey, openEditor);
    }

    bindEvents() {
        this.addEventListener('click', (event) => {
            const insideSelectionScope = Boolean(event.target.closest('.pv-topbar, [data-floating-actions], [data-action="reopen-topbar"], [data-style-hotspot="1"], [data-style-editor], [data-inline-text-editor="1"], [data-inline-modal], [data-tools-guide-modal]'));
            if (!insideSelectionScope && (this.activeStyleTargetKey || this.styleEditorVisible || this.inlineEditorState)) {
                this.clearStyleSelectionUi();
            }

            if (event.target.closest('[data-action="tools-guide-ack"]')) {
                event.preventDefault();
                event.stopPropagation();
                this.closeToolsGuideModal({ persist: false });
                return;
            }

            if (event.target.closest('[data-action="tools-guide-close"]')) {
                event.preventDefault();
                event.stopPropagation();
                this.closeToolsGuideModal({ persist: false });
                return;
            }

            if (event.target.closest('[data-action="tools-guide-hide-forever"]')) {
                event.preventDefault();
                event.stopPropagation();
                this.closeToolsGuideModal({ persist: true });
                return;
            }

            if (event.target.closest('[data-inline-modal]') && !event.target.closest('[data-inline-modal-panel]')) {
                event.preventDefault();
                this.closeInlineTextEditor({ applyChanges: false });
                return;
            }

            if (event.target.closest('[data-action="inline-text-save"]')) {
                event.preventDefault();
                event.stopPropagation();
                this.commitInlineTextEditor();
                return;
            }

            if (event.target.closest('[data-action="inline-text-cancel"]')) {
                event.preventDefault();
                event.stopPropagation();
                this.closeInlineTextEditor({ applyChanges: false });
                return;
            }

            if (event.target.closest('[data-action="save-global-edits"]')) {
                event.preventDefault();
                this.applyPendingGlobalEdits();
                return;
            }

            if (event.target.closest('[data-action="save-style-edits"]')) {
                event.preventDefault();
                this.applyPendingStyleEdits();
                return;
            }

            if (event.target.closest('[data-action="style-select-another"]')) {
                event.preventDefault();
                if (!this.activeStyleTargetKey) return;
                this.additionalSelectionMode = !this.additionalSelectionMode;
                this.updateCustomControlsUi();
                return;
            }

            if (event.target.closest('[data-inline-text-editor="1"]')) {
                return;
            }

            if (event.target.closest('[data-action="style-open-inline-editor"]')) {
                if (!this.activeStyleTargetKey) return;
                this.openInlineTextEditor(this.activeStyleTargetKey);
                return;
            }

            if (event.target.closest('[data-action="style-close-editor"]')) {
                event.preventDefault();
                event.stopPropagation();
                this.closeInlineTextEditor({ applyChanges: false });
                this.styleEditorVisible = false;
                this.additionalSelectionMode = false;
                this.moveModeEnabled = false;
                this.updateCustomControlsUi();
                return;
            }

            const hotspot = event.target.closest('[data-style-hotspot="1"]');
            if (hotspot) {
                this.closeInlineTextEditor({ applyChanges: false });
                const styleKey = String(hotspot.getAttribute('data-style-key') || '').trim();
                if (!styleKey) return;
                this.handleStyleTargetSelection(styleKey, false);
                return;
            }

            if (event.target.closest('[data-action="back"]')) {
                playUiSound('prev');
                this.dispatchEvent(new CustomEvent('preview-back', { bubbles: true }));
                return;
            }

            if (event.target.closest('[data-action="close-builder"]')) {
                playUiSound('close');
                this.setTopbarCollapsed(true);
                return;
            }

            if (event.target.closest('[data-action="reopen-topbar"]')) {
                this.setTopbarCollapsed(false);
                return;
            }

            if (event.target.closest('[data-action="open-tools-guide"]')) {
                this.openToolsGuideModal();
                return;
            }

            const downloadBtn = event.target.closest('[data-action="download-pdf"]');
            if (downloadBtn) {
                if (this.isDownloading) return;
                playUiSound('download');
                this.downloadPdf(downloadBtn);
                return;
            }

            if (event.target.closest('[data-action="style-bold"]')) {
                this.queueStyleToggleChange('style-bold');
                return;
            }

            if (event.target.closest('[data-action="style-italic"]')) {
                this.queueStyleToggleChange('style-italic');
                return;
            }

            if (event.target.closest('[data-action="style-underline"]')) {
                this.queueStyleToggleChange('style-underline');
                return;
            }

            if (event.target.closest('[data-action="style-split-two"]')) {
                this.queueStyleToggleChange('style-split-two');
                return;
            }

            if (event.target.closest('[data-action="style-reset"]')) {
                this.queueStyleReset();
                return;
            }

            const styleTarget = event.target.closest('[data-style-target="1"]');
            if (styleTarget) {
                const styleKey = String(styleTarget.getAttribute('data-style-key') || '').trim();
                if (!styleKey) return;
                this.handleStyleTargetSelection(styleKey, false);
                return;
            }
        });

        this.addEventListener('dblclick', (event) => {
            const hotspot = event.target.closest('[data-style-hotspot="1"]');
            if (hotspot) {
                const styleKey = hotspot.getAttribute('data-style-key') || '';
                this.handleStyleTargetSelection(styleKey, true);
                return;
            }
            const directTarget = event.target.closest('[data-style-target="1"]');
            if (directTarget) {
                const styleKey = directTarget.getAttribute('data-style-key') || '';
                this.handleStyleTargetSelection(styleKey, true);
            }
        });

        this.addEventListener('input', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            if (target.matches('[data-action="left-color-input"]')) {
                target.dataset.globalDirty = '1';
                this.updateCustomControlsUi();
                return;
            }
            if (target.matches('[data-action="left-width-input"]')) {
                target.dataset.globalDirty = '1';
                const leftWidthLabel = this.ensureUiRefs().leftWidthLabel;
                if (leftWidthLabel) {
                    const liveValue = this.clampLeftColumnWidth(target.value);
                    leftWidthLabel.textContent = `${liveValue}%`;
                }
                this.updateCustomControlsUi();
                return;
            }
            if (target.matches('[data-style-control]')) {
                target.dataset.styleDirty = '1';
                if (this.pendingStyleResetKey === this.activeStyleTargetKey) {
                    this.pendingStyleResetKey = '';
                }
                this.updateCustomControlsUi();
            }
        });

        this.addEventListener('change', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            if (target.matches('[data-action="typography-select"]')) {
                target.dataset.globalDirty = '1';
                this.updateCustomControlsUi();
                return;
            }
            if (target.matches('[data-action="photo-shape-select"]')) {
                target.dataset.globalDirty = '1';
                this.updateCustomControlsUi();
                return;
            }
            if (target.matches('[data-style-control]')) {
                target.dataset.styleDirty = '1';
                if (this.pendingStyleResetKey === this.activeStyleTargetKey) {
                    this.pendingStyleResetKey = '';
                }
                this.updateCustomControlsUi();
            }
        });

        this.addEventListener('keydown', (event) => {
            const target = event.target;
            if (event.key === 'Escape') {
                if (!this.inlineEditorState) return;
                event.preventDefault();
                this.closeInlineTextEditor({ applyChanges: false });
                return;
            }
            if (!(target instanceof HTMLElement) || !target.matches('[data-inline-input]')) return;
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.commitInlineTextEditor();
            }
        });
    }

    setScreenGuardState(guarded, message = 'Contenu protege pendant la verification.') {
        const wrap = this.querySelector('.pv-cv-wrap');
        const warning = this.querySelector('[data-capture-warning]');
        if (!wrap) return;

        wrap.classList.toggle('is-screen-guarded', Boolean(guarded));
        if (warning) {
            warning.textContent = message;
        }
    }

    showTemporaryScreenGuard(message, duration = 1600) {
        this.setScreenGuardState(true, message);
        if (this.previewProtectionTimer) {
            clearTimeout(this.previewProtectionTimer);
        }
        this.previewProtectionTimer = window.setTimeout(() => {
            this.previewProtectionTimer = null;
            if (document.visibilityState === 'visible' && document.hasFocus()) {
                this.setScreenGuardState(false);
            }
        }, duration);
    }

    setupPreviewProtection() {
        this.teardownPreviewProtection();

        this.contextMenuProtectionHandler = (event) => {
            if (!(event.target instanceof Element) || !event.target.closest('.pv-cv-wrap')) return;
            event.preventDefault();
            this.showTemporaryScreenGuard('Le menu de capture est desactive sur cet apercu.', 1400);
        };
        this.addEventListener('contextmenu', this.contextMenuProtectionHandler);

        this.visibilityGuardHandler = () => {
            if (document.visibilityState === 'hidden') {
                this.setScreenGuardState(true, 'Apercu masque hors ecran actif.');
                return;
            }
            if (document.hasFocus()) {
                this.setScreenGuardState(false);
            }
        };
        document.addEventListener('visibilitychange', this.visibilityGuardHandler);

        this.windowBlurGuardHandler = () => {
            this.setScreenGuardState(true, 'Apercu masque hors ecran actif.');
        };
        this.windowFocusGuardHandler = () => {
            if (document.visibilityState === 'visible') {
                this.setScreenGuardState(false);
            }
        };
        window.addEventListener('blur', this.windowBlurGuardHandler);
        window.addEventListener('focus', this.windowFocusGuardHandler);

        this.beforePrintGuardHandler = () => {
            this.setScreenGuardState(true, 'Impression et export ecran direct desactives sur l apercu.');
        };
        this.afterPrintGuardHandler = () => {
            if (document.visibilityState === 'visible' && document.hasFocus()) {
                this.setScreenGuardState(false);
            }
        };
        window.addEventListener('beforeprint', this.beforePrintGuardHandler);
        window.addEventListener('afterprint', this.afterPrintGuardHandler);

        this.globalKeyProtectionHandler = (event) => {
            const key = String(event.key || '').toLowerCase();
            const platform = String(navigator.userAgentData?.platform || navigator.platform || '').toUpperCase();
            const usesMeta = platform.includes('MAC');
            const modifierPressed = usesMeta ? event.metaKey : event.ctrlKey;
            const isPrintShortcut = modifierPressed && key === 'p';
            const isSaveShortcut = modifierPressed && key === 's';
            const isScreenshotShortcut =
                key === 'printscreen' ||
                (event.metaKey && event.shiftKey && (key === '3' || key === '4' || key === '5'));

            if (!isPrintShortcut && !isSaveShortcut && !isScreenshotShortcut) return;

            if (isPrintShortcut || isSaveShortcut) {
                event.preventDefault();
            }
            event.stopPropagation();

            const notice = isScreenshotShortcut
                ? 'Capture systeme detectee: cet apercu reste filigrane.'
                : 'Raccourci bloque. Utilisez le bouton de telechargement protege.';
            this.showTemporaryScreenGuard(notice, 1800);
        };
        window.addEventListener('keydown', this.globalKeyProtectionHandler, true);
    }

    teardownPreviewProtection() {
        if (this.previewProtectionTimer) {
            clearTimeout(this.previewProtectionTimer);
            this.previewProtectionTimer = null;
        }

        if (this.contextMenuProtectionHandler) {
            this.removeEventListener('contextmenu', this.contextMenuProtectionHandler);
            this.contextMenuProtectionHandler = null;
        }
        if (this.visibilityGuardHandler) {
            document.removeEventListener('visibilitychange', this.visibilityGuardHandler);
            this.visibilityGuardHandler = null;
        }
        if (this.windowBlurGuardHandler) {
            window.removeEventListener('blur', this.windowBlurGuardHandler);
            this.windowBlurGuardHandler = null;
        }
        if (this.windowFocusGuardHandler) {
            window.removeEventListener('focus', this.windowFocusGuardHandler);
            this.windowFocusGuardHandler = null;
        }
        if (this.beforePrintGuardHandler) {
            window.removeEventListener('beforeprint', this.beforePrintGuardHandler);
            this.beforePrintGuardHandler = null;
        }
        if (this.afterPrintGuardHandler) {
            window.removeEventListener('afterprint', this.afterPrintGuardHandler);
            this.afterPrintGuardHandler = null;
        }
        if (this.globalKeyProtectionHandler) {
            window.removeEventListener('keydown', this.globalKeyProtectionHandler, true);
            this.globalKeyProtectionHandler = null;
        }

        this.setScreenGuardState(false);
    }

    loadData(data) {
        this.data = data || {};
        this.forceLoadingOnNextPageRender = true;
        this.updatePreview();
    }

    updatePreview() {
        const data = this.resolveDataWithDefaults();
        this.setText('fullname', [data.firstname, data.middlename, data.lastname].filter(Boolean).join(' '));
        this.setText('designation', data.designation || '');
        this.setText('email', data.email || '');
        this.setText('phoneno', this.formatPhoneDisplay(data) || '');
        this.setText('address', this.formatAddressDisplay(data) || '');
        this.setText('summary', data.summary || '');

        this.setText('exp_title', data.exp_title || '');
        this.setText('exp_organization', data.exp_organization || '');
        this.setText('exp_location', data.exp_location || '');
        this.setText('exp_dates', this.formatDateRange(data.exp_start_date, data.exp_end_date) || '');

        this.renderEducationList(this.buildEducationItems(data));
        this.renderExperienceList(this.buildExperienceItems(data));

        this.renderList('interests', this.buildInterestItems(data, this.data));
        this.renderList('languages', this.buildLanguageItems(data));
        const toolData = this.buildSoftwareItems(data);
        this.setText('tools_title', toolData.title);
        this.renderList('softwares', toolData.items);

        const imageEl = this.querySelector('[data-preview="image"]');
        if (imageEl) {
            if (data.image) {
                imageEl.src = data.image;
                imageEl.style.visibility = 'visible';
            } else {
                imageEl.removeAttribute('src');
                imageEl.style.visibility = 'hidden';
            }
        }
        this.syncPreviewSectionVisibility();
        this.autoFitPending = true;
        this.styleEditorNeedsSync = true;
        this.applyPreviewCustomStyles();
        this.bumpPreviewVersion();
        const shouldShowLoading = Boolean(this.forceLoadingOnNextPageRender && this.isPreviewVisible());
        this.forceLoadingOnNextPageRender = false;
        requestAnimationFrame(() => {
            this.updatePdfPagesHint();
            this.schedulePaginatedPreviewRender({
                delayMs: shouldShowLoading ? 0 : this.fastRenderDelayMs,
                showLoading: shouldShowLoading,
                busyMessage: shouldShowLoading ? 'Generation de la previsualisation paginee...' : ''
            });
        });
        // Garde des tailles de texte stables et lisibles
        // au lieu de reduire automatiquement toute la mise en page.
    }

    hasNodeText(node) {
        if (!(node instanceof HTMLElement)) return false;
        return Boolean(String(node.textContent || '').replace(/\s+/g, ' ').trim());
    }

    togglePreviewSection(node, shouldShow) {
        if (!(node instanceof HTMLElement)) return;
        node.classList.toggle('hidden', !shouldShow);
    }

    syncPreviewSectionVisibility() {
        const summarySection = this.querySelector('.pv-l-section[data-edit-step="summary"]');
        const summaryText = this.querySelector('[data-preview="summary"]');
        this.togglePreviewSection(summarySection, this.hasNodeText(summaryText));

        const contactSection = this.querySelector('.pv-l-section[data-edit-step="email"]');
        if (contactSection) {
            const contactRows = Array.from(contactSection.querySelectorAll('.pv-l-item'));
            let visibleContacts = 0;
            contactRows.forEach((row) => {
                const valueNode = row.querySelector('span[data-preview]');
                const isVisible = this.hasNodeText(valueNode);
                row.classList.toggle('hidden', !isVisible);
                if (isVisible) visibleContacts += 1;
            });
            this.togglePreviewSection(contactSection, visibleContacts > 0);
        }

        const interestsSection = this.querySelector('.pv-l-section[data-edit-step="interests"]');
        const interestsList = this.querySelector('[data-preview-list="interests"]');
        this.togglePreviewSection(interestsSection, Boolean(interestsList?.children.length));

        const headerSection = this.querySelector('.pv-r-header');
        const nameNode = this.querySelector('[data-preview="fullname"]');
        const roleNode = this.querySelector('[data-preview="designation"]');
        this.togglePreviewSection(headerSection, this.hasNodeText(nameNode) || this.hasNodeText(roleNode));

        const educationSection = this.querySelector('.pv-r-section[data-edit-step="educations"]');
        const educationList = this.querySelector('[data-preview-list="educations"]');
        this.togglePreviewSection(educationSection, Boolean(educationList?.children.length));

        const experienceSection = this.querySelector('.pv-r-section[data-edit-step="experiences"]');
        const primaryExperience = experienceSection?.querySelector('.pv-exp-item:not(.pv-exp-extra)');
        const hasPrimaryExperience = Boolean(primaryExperience && !primaryExperience.classList.contains('hidden'));
        const hasExtraExperiences = Boolean(experienceSection?.querySelector('.pv-exp-extra'));
        this.togglePreviewSection(experienceSection, hasPrimaryExperience || hasExtraExperiences);

        const languageList = this.querySelector('[data-preview-list="languages"]');
        const languageColumn = languageList?.closest('[data-edit-step="languages"]') || null;
        const softwareList = this.querySelector('[data-preview-list="softwares"]');
        const toolsColumn = softwareList?.closest('[data-edit-step="tools"]') || null;
        const hasLanguages = Boolean(languageList?.children.length);
        const hasTools = Boolean(softwareList?.children.length);
        this.togglePreviewSection(languageColumn, hasLanguages);
        this.togglePreviewSection(toolsColumn, hasTools);
        const skillsSection = this.querySelector('.pv-skills-grid')?.closest('.pv-r-section') || null;
        this.togglePreviewSection(skillsSection, hasLanguages || hasTools);
    }

    schedulePaginatedPreviewRender(options = {}) {
        const delayMsRaw = Number(options?.delayMs);
        const delayMs = Number.isFinite(delayMsRaw) ? Math.max(0, Math.floor(delayMsRaw)) : this.fastRenderDelayMs;
        const showLoading = Boolean(options?.showLoading);
        const busyMessage = String(options?.busyMessage || '').trim();
        if (this.pagesRenderTimer) {
            clearTimeout(this.pagesRenderTimer);
        }
        if (this.pagesRenderIdleId && typeof window.cancelIdleCallback === 'function') {
            window.cancelIdleCallback(this.pagesRenderIdleId);
            this.pagesRenderIdleId = null;
        }
        if (this.scheduledBusyToken) {
            this.stopBusyIndicator(this.scheduledBusyToken);
            this.scheduledBusyToken = null;
        }
        if (showLoading) {
            this.scheduledBusyToken = this.startBusyIndicator(busyMessage || 'Application des modifications...', 0);
        }
        if (!showLoading && !this.isPreviewVisible()) return;
        this.pagesRenderTimer = window.setTimeout(() => {
            this.pagesRenderTimer = null;
            if (!showLoading && !this.isPreviewVisible()) return;
            const pendingBusyToken = this.scheduledBusyToken;
            this.scheduledBusyToken = null;
            const runRender = () => this.renderPaginatedPreview({ showLoading, busyMessage, busyToken: pendingBusyToken });
            if (!showLoading && typeof window.requestIdleCallback === 'function') {
                this.pagesRenderIdleId = window.requestIdleCallback(() => {
                    this.pagesRenderIdleId = null;
                    runRender();
                }, { timeout: 900 });
                return;
            }
            runRender();
        }, delayMs);
    }

    bumpPreviewVersion() {
        this.previewVersion += 1;
        if (this.previewVersion > 1000000) {
            this.previewVersion = 1;
            this.lastPaginatedPreviewVersion = 0;
        }
    }

    yieldToBrowser() {
        return new Promise((resolve) => {
            window.requestAnimationFrame(() => resolve());
        });
    }

    isPreviewVisible() {
        if (!this.isConnected || this.hidden) return false;
        return !Boolean(this.closest('[hidden]'));
    }

    updatePdfPagesHint() {
        const hint = this.querySelector('[data-pdf-pages-hint]');
        const preview = this.querySelector('#pv-preview');
        if (!hint || !preview) return;

        const marginXmm = 6;
        const marginYmm = 0;
        const pageWidthMm = 210;
        const pageHeightMm = 297;
        const contentWidthMm = pageWidthMm - (marginXmm * 2);
        const contentHeightMm = pageHeightMm - (marginYmm * 2);
        const exportWidthPx = 794;
        const pageHeightPx = Math.floor((contentHeightMm / contentWidthMm) * exportWidthPx);

        const contentHeightPx = Math.max(preview.scrollHeight, preview.offsetHeight, 1);
        const pages = Math.max(1, Math.ceil(contentHeightPx / pageHeightPx));

        hint.classList.remove('hidden');
        if (pages > 1) {
            hint.textContent = `PDF estime: ${pages} pages. Si vous voulez une seule page, reduisez un peu le texte.`;
            hint.classList.remove('text-slate-600');
            hint.classList.add('text-amber-700');
            return;
        }

        hint.textContent = 'PDF estime: 1 page.';
        hint.classList.remove('text-amber-700');
        hint.classList.add('text-slate-600');
    }

    normalizeCssPixel(value, min = 0, max = 4000) {
        const raw = String(value ?? '').trim();
        if (!raw) return '';
        const parsed = Number(raw.replace(',', '.'));
        if (!Number.isFinite(parsed)) return '';
        const clamped = Math.max(min, Math.min(max, parsed));
        return String(Math.round(clamped));
    }

    normalizeCssNumber(value, min = 0, max = 4000, decimals = 2) {
        const raw = String(value ?? '').trim();
        if (!raw) return '';
        const parsed = Number(raw.replace(',', '.'));
        if (!Number.isFinite(parsed)) return '';
        const clamped = Math.max(min, Math.min(max, parsed));
        const factor = Math.pow(10, Math.max(0, Math.floor(decimals)));
        const rounded = Math.round(clamped * factor) / factor;
        return String(rounded);
    }

    normalizeLineHeightValue(value, min = 0.8, max = 3) {
        const raw = String(value ?? '').trim();
        if (!raw) return '';
        const parsed = Number(raw.replace(',', '.'));
        if (!Number.isFinite(parsed)) return '';
        const clamped = Math.max(min, Math.min(max, parsed));
        return String(Number(clamped.toFixed(2)));
    }

    cssColorToHex(value, fallback = '#222222') {
        const hex = this.normalizeHexColor(value);
        if (hex) return hex;
        const raw = String(value || '').trim();
        const rgbMatch = raw.match(/^rgba?\(([^)]+)\)$/i);
        if (!rgbMatch) return fallback;
        const parts = rgbMatch[1].split(',').map((p) => Number(p.trim()));
        if (parts.length < 3 || parts.some((n, idx) => idx < 3 && !Number.isFinite(n))) return fallback;
        if (parts.length >= 4 && Number.isFinite(parts[3]) && parts[3] <= 0.01) return fallback;
        const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
        return `#${toHex(parts[0])}${toHex(parts[1])}${toHex(parts[2])}`;
    }

    buildStyleTargetKey(el, preview) {
        if (!el || !preview) return '';
        if (el.matches('img') || el.getAttribute('data-preview') === 'image') return '';
        if (el.dataset.preview) return `preview:${el.dataset.preview}`;
        const previewList = el.closest('[data-preview-list]');
        if (previewList) {
            const listName = previewList.getAttribute('data-preview-list') || 'list';
            if (el.matches('li')) {
                const index = Array.from(previewList.children).indexOf(el);
                return `list-item:${listName}:${Math.max(0, index)}`;
            }
            return `list:${listName}`;
        }
        const expItem = el.closest('.pv-exp-item');
        if (expItem) {
            const expIndex = Array.from(preview.querySelectorAll('.pv-exp-item')).indexOf(expItem);
            if (el.classList.contains('pv-exp-date')) return `exp:${expIndex}:date`;
            if (el.classList.contains('pv-exp-role')) return `exp:${expIndex}:role`;
            if (el.classList.contains('pv-exp-company')) return `exp:${expIndex}:company`;
            if (el.matches('li')) {
                const list = el.closest('.pv-exp-list');
                const liIndex = list ? Array.from(list.children).indexOf(el) : 0;
                return `exp:${expIndex}:bullet:${Math.max(0, liIndex)}`;
            }
        }
        const eduItem = el.closest('.pv-edu-list');
        if (eduItem && el.matches('.pv-edu-li')) {
            const index = Array.from(eduItem.children).indexOf(el);
            return `edu:${Math.max(0, index)}`;
        }
        return `path:${this.buildElementPath(el, preview)}`;
    }

    buildElementPath(el, stopNode) {
        if (!el || !stopNode) return '';
        const segments = [];
        let current = el;
        while (current && current !== stopNode) {
            const parent = current.parentElement;
            if (!parent) break;
            const siblings = Array.from(parent.children || []);
            const idx = siblings.indexOf(current);
            segments.push(`${current.tagName.toLowerCase()}:${Math.max(0, idx)}`);
            current = parent;
        }
        segments.reverse();
        return segments.join('/');
    }

    setupStyleTargets(preview) {
        if (!preview) return;
        const selectors = [
            '[data-edit-block]:not(img):not([data-preview="image"])',
            '[data-preview]:not(img):not([data-preview="image"])',
            '.pv-r-title',
            '.pv-l-title',
            '.pv-sk-col-title',
            '.pv-l-item',
            '.pv-l-text',
            '.pv-r-role',
            '.pv-r-name',
            '.pv-exp-date',
            '.pv-exp-role',
            '.pv-exp-company',
            '.pv-edu-li',
            '.pv-exp-list li',
            '.pv-sk-list li'
        ];
        const seen = new Set();
        selectors.forEach((selector) => {
            preview.querySelectorAll(selector).forEach((el) => seen.add(el));
        });
        const usedKeys = new Map();
        Array.from(seen).forEach((el) => {
            const baseKey = this.buildStyleTargetKey(el, preview);
            if (!baseKey) return;
            const count = usedKeys.get(baseKey) || 0;
            const key = count > 0 ? `${baseKey}__${count}` : baseKey;
            usedKeys.set(baseKey, count + 1);
            el.setAttribute('data-style-target', '1');
            el.setAttribute('data-style-key', key);
            if (!el.getAttribute('data-style-label')) {
                const snippet = (el.textContent || '').replace(/\s+/g, ' ').trim();
                el.setAttribute('data-style-label', snippet.slice(0, 48) || key);
            }
        });
        this.selectedStyleTargetKeys = this.normalizeStyleTargetKeys(this.selectedStyleTargetKeys)
            .filter((key) => Boolean(this.getStyleTargetElement(key, preview)));
        if (this.activeStyleTargetKey && !this.getStyleTargetElement(this.activeStyleTargetKey, preview)) {
            this.activeStyleTargetKey = '';
            this.styleEditorNeedsSync = true;
        }
    }

    getStyleTargetElement(key, root = null) {
        const cleanKey = String(key || '').trim();
        if (!cleanKey) return null;
        const host = root || this.querySelector('#pv-preview');
        if (!host) return null;
        return host.querySelector(`[data-style-key="${this.toAttrSelectorValue(cleanKey)}"]`);
    }

    getStyleObjectByKey(key) {
        const cleanKey = String(key || '').trim();
        if (!cleanKey) return null;
        if (!this.elementStyleMap[cleanKey]) this.elementStyleMap[cleanKey] = {};
        return this.elementStyleMap[cleanKey];
    }

    getActiveStyleObject() {
        return this.getStyleObjectByKey(this.activeStyleTargetKey);
    }

    selectStyleTargetByKey(key, openEditor = false) {
        const cleanKey = String(key || '').trim();
        if (!cleanKey) return;
        const previousKey = this.activeStyleTargetKey;
        const preview = this.querySelector('#pv-preview');
        if (!preview) return;
        const target = this.getStyleTargetElement(cleanKey, preview);
        if (!target) return;
        const targetChanged = previousKey !== cleanKey;
        if (previousKey && previousKey !== cleanKey) {
            this.pendingStyleResetKey = '';
            this.styleControlDirtyKey = cleanKey;
            this.resetStyleControlDirtyFlags();
            this.resetStyleToggleDirtyFlags();
        }
        this.activeStyleTargetKey = cleanKey;
        this.selectedStyleTargetKeys = [cleanKey];
        if (openEditor) this.styleEditorVisible = true;
        if (targetChanged || openEditor) {
            this.styleEditorNeedsSync = true;
        }
        this.updateCustomControlsUi();
    }

    clearStyleSelectionUi() {
        if (this.inlineEditorState) {
            this.closeInlineTextEditor({ applyChanges: false });
        }
        this.activeStyleTargetKey = '';
        this.selectedStyleTargetKeys = [];
        this.pendingStyleResetKey = '';
        this.styleControlDirtyKey = '';
        this.resetStyleControlDirtyFlags();
        this.resetStyleToggleDirtyFlags();
        this.styleEditorVisible = false;
        this.additionalSelectionMode = false;
        this.moveModeEnabled = false;
        this.styleEditorNeedsSync = true;
        this.updateCustomControlsUi();
    }

    getPreferredHotspotForKey(styleKey) {
        const cleanKey = String(styleKey || '').trim();
        if (!cleanKey) return null;
        const selectorKey = this.toAttrSelectorValue(cleanKey);
        const zones = Array.from(this.querySelectorAll(`[data-style-hotspot="1"][data-style-key="${selectorKey}"]`));
        if (!zones.length) return null;
        let best = zones[0];
        let bestArea = 0;
        zones.forEach((zone) => {
            const rect = zone.getBoundingClientRect();
            const area = rect && rect.width && rect.height ? (rect.width * rect.height) : 0;
            if (area > bestArea) {
                bestArea = area;
                best = zone;
            }
        });
        return best;
    }

    makeStyleLabel(text, fallback = 'Bloc') {
        const normalized = String(text ?? '').replace(/\s+/g, ' ').trim();
        if (normalized) return normalized.slice(0, 48);
        return String(fallback || 'Bloc');
    }

    canInlineEditTarget(target) {
        if (!target || !(target instanceof HTMLElement)) return false;
        if (target.matches('ul,ol,img,svg,canvas,input,textarea,select,button')) return false;
        if (target.querySelector('ul,ol')) return false;
        if (target.querySelector('[data-style-target="1"]')) return false;
        return true;
    }

    resolveInlineEditableTarget(styleKey, preview) {
        const cleanKey = String(styleKey || '').trim();
        if (!cleanKey || !preview) return { target: null, styleKey: '' };
        const initialTarget = this.getStyleTargetElement(cleanKey, preview);
        if (!initialTarget) return { target: null, styleKey: '' };
        if (this.canInlineEditTarget(initialTarget)) {
            return { target: initialTarget, styleKey: cleanKey };
        }

        const nestedTargets = Array.from(initialTarget.querySelectorAll('[data-style-target="1"]'));
        for (let i = 0; i < nestedTargets.length; i += 1) {
            const candidate = nestedTargets[i];
            if (!this.canInlineEditTarget(candidate)) continue;
            const candidateKey = String(candidate.getAttribute('data-style-key') || '').trim();
            if (candidateKey) {
                return { target: candidate, styleKey: candidateKey };
            }
        }

        return { target: null, styleKey: '' };
    }

    applyInlineTextToTarget(target, text, styleKey = '') {
        if (!target) return;
        const normalized = String(text ?? '').replace(/\r/g, '').trim();
        target.textContent = normalized;
        const key = String(styleKey || target.getAttribute('data-style-key') || '').trim();
        const nextLabel = this.makeStyleLabel(normalized, key || 'Bloc');
        target.setAttribute('data-style-label', nextLabel);
        if (key) {
            this.textOverrideMap[key] = normalized;
        }
    }

    openInlineTextEditor(styleKey) {
        const cleanKey = String(styleKey || '').trim();
        if (!cleanKey) return false;
        const preview = this.querySelector('#pv-preview');
        if (!preview) return false;
        const resolved = this.resolveInlineEditableTarget(cleanKey, preview);
        const target = resolved.target;
        const resolvedKey = resolved.styleKey;
        if (!target || !resolvedKey) return false;

        this.closeInlineTextEditor({ applyChanges: true });
        this.selectStyleTargetByKey(resolvedKey, false);

        const modal = this.querySelector('[data-inline-modal]');
        const labelNode = this.querySelector('[data-inline-modal-label]');
        const input = this.querySelector('[data-inline-input]');
        if (!(modal instanceof HTMLElement) || !(input instanceof HTMLTextAreaElement)) return false;

        const initialText = Object.prototype.hasOwnProperty.call(this.textOverrideMap, resolvedKey)
            ? this.textOverrideMap[resolvedKey]
            : (target.textContent || '');
        input.value = String(initialText || '');
        if (labelNode) {
            labelNode.textContent = target.getAttribute('data-style-label') || resolvedKey;
        }
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.setAttribute('aria-hidden', 'false');

        window.requestAnimationFrame(() => {
            input.focus();
            input.select();
        });

        this.inlineEditorState = { styleKey: resolvedKey, box: modal, input };
        return true;
    }

    closeInlineTextEditor(options = {}) {
        const state = this.inlineEditorState;
        if (!state) return;
        if (options?.applyChanges === true) {
            this.commitInlineTextEditor();
            return;
        }
        if (state.box instanceof HTMLElement) {
            state.box.classList.add('hidden');
            state.box.classList.remove('flex');
            state.box.setAttribute('aria-hidden', 'true');
        }
        this.inlineEditorState = null;
    }

    commitInlineTextEditor() {
        const state = this.inlineEditorState;
        if (!state) return false;
        const styleKey = String(state.styleKey || '').trim();
        const nextText = state.input instanceof HTMLTextAreaElement ? state.input.value : '';
        const preview = this.querySelector('#pv-preview');
        const target = this.getStyleTargetElement(styleKey, preview);
        if (target) {
            this.applyInlineTextToTarget(target, nextText, styleKey);
        } else {
            this.textOverrideMap[styleKey] = String(nextText || '').trim();
        }
        this.closeInlineTextEditor({ applyChanges: false });
        this.autoFitPending = true;
        this.styleEditorNeedsSync = true;
        this.refreshAfterStyleChange({
            delayMs: 0,
            showLoading: true,
            busyMessage: 'Application des modifications...'
        });
        return true;
    }

    applyTextOverrides(preview) {
        if (!preview || !this.textOverrideMap || typeof this.textOverrideMap !== 'object') return;
        Object.keys(this.textOverrideMap).forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(this.textOverrideMap, key)) return;
            const target = this.getStyleTargetElement(key, preview);
            if (!this.canInlineEditTarget(target)) return;
            this.applyInlineTextToTarget(target, this.textOverrideMap[key], key);
        });
    }

    applyPendingGlobalEdits() {
        const refs = this.ensureUiRefs();
        const typographySelect = refs.typographySelect;
        const leftWidthInput = refs.leftWidthInput;
        const shapeSelect = refs.shapeSelect;
        const colorInput = refs.colorInput;

        let changed = false;
        let typographyChanged = false;

        if (typographySelect && typographySelect.dataset.globalDirty === '1') {
            const nextTypography = Object.prototype.hasOwnProperty.call(this.typographyOptions, typographySelect.value)
                ? typographySelect.value
                : 'poppins';
            if (nextTypography !== this.typographyKey) {
                this.typographyKey = nextTypography;
                typographyChanged = true;
                changed = true;
            }
            typographySelect.dataset.globalDirty = '0';
        }

        if (leftWidthInput && leftWidthInput.dataset.globalDirty === '1') {
            const nextWidth = this.clampLeftColumnWidth(leftWidthInput.value);
            if (nextWidth !== this.leftColumnWidth) {
                this.leftColumnWidth = nextWidth;
                changed = true;
            }
            leftWidthInput.dataset.globalDirty = '0';
        }

        if (shapeSelect && shapeSelect.dataset.globalDirty === '1') {
            const nextShape = shapeSelect.value === 'circle' ? 'circle' : 'rect';
            if (nextShape !== this.photoShape) {
                this.photoShape = nextShape;
                changed = true;
            }
            shapeSelect.dataset.globalDirty = '0';
        }

        if (colorInput && colorInput.dataset.globalDirty === '1') {
            const nextColor = this.normalizeHexColor(colorInput.value);
            if (nextColor && nextColor !== this.leftColumnColor) {
                this.leftColumnColor = nextColor;
                changed = true;
            }
            colorInput.dataset.globalDirty = '0';
        }

        if (!changed) {
            this.updateCustomControlsUi();
            return;
        }
        this.autoFitPending = true;
        this.styleEditorNeedsSync = true;

        if (typographyChanged) {
            this.ensureTypographyStylesheet(this.typographyKey).then(() => {
                this.refreshAfterStyleChange({
                    delayMs: 0,
                    showLoading: true,
                    busyMessage: 'Application des modifications...'
                });
            });
            return;
        }
        this.refreshAfterStyleChange({
            delayMs: 0,
            showLoading: true,
            busyMessage: 'Application des modifications...'
        });
    }

    setStyleToggleUiState(action, enabled, options = {}) {
        const btn = this.getActionButton(action);
        if (!btn) return;
        const isEnabled = Boolean(enabled);
        btn.dataset.styleValue = isEnabled ? '1' : '0';
        if (options.markDirty) btn.dataset.styleDirty = '1';
        if (options.resetDirty) btn.dataset.styleDirty = '0';
        btn.classList.toggle('bg-sky-700', isEnabled);
        btn.classList.toggle('text-white', isEnabled);
        btn.classList.toggle('border-sky-700', isEnabled);
    }

    queueStyleToggleChange(action) {
        if (!this.activeStyleTargetKey) return;
        const btn = this.getActionButton(action);
        if (!btn) return;
        const current = btn.dataset.styleValue === '1';
        this.setStyleToggleUiState(action, !current, { markDirty: true });
        if (this.pendingStyleResetKey === this.activeStyleTargetKey) {
            this.pendingStyleResetKey = '';
        }
        this.styleControlDirtyKey = this.activeStyleTargetKey;
        this.updateCustomControlsUi();
    }

    queueStyleReset() {
        if (!this.activeStyleTargetKey) return;
        this.pendingStyleResetKey = this.activeStyleTargetKey;
        this.styleControlDirtyKey = this.activeStyleTargetKey;
        this.resetStyleControlDirtyFlags();
        this.getStyleToggleActions().forEach((action) => {
            this.setStyleToggleUiState(action, false, { resetDirty: true });
        });
        this.updateCustomControlsUi();
    }

    applyPendingStyleEdits() {
        const targetKey = String(this.activeStyleTargetKey || '').trim();
        if (!targetKey) return;
        const refs = this.ensureUiRefs();
        const selectedKeys = this.getSelectedStyleTargetKeys();
        if (!selectedKeys.length) return;
        const directionalFields = new Set(['offsetTopPx', 'offsetBottomPx', 'offsetLeftPx', 'offsetRightPx']);
        let changed = false;

        if (this.pendingStyleResetKey === targetKey) {
            selectedKeys.forEach((styleKey) => {
                if (!Object.prototype.hasOwnProperty.call(this.elementStyleMap, styleKey)) return;
                delete this.elementStyleMap[styleKey];
                changed = true;
            });
            this.pendingStyleResetKey = '';
        } else {
            const styleControls = refs.styleControlNodes || [];
            styleControls.forEach((node) => {
                if (!(node instanceof HTMLInputElement || node instanceof HTMLSelectElement)) return;
                if (node.dataset.styleDirty !== '1') return;
                const field = node.getAttribute('data-style-control');
                if (!field) return;
                if (directionalFields.has(field)) return;
                selectedKeys.forEach((styleKey) => {
                    const didChange = this.updateStyleValueForKey(styleKey, field, node.value, { deferRefresh: true });
                    if (didChange) changed = true;
                });
                node.dataset.styleDirty = '0';
            });

            const dirtyDirectionalControls = styleControls.filter((node) => {
                const field = String(node.getAttribute('data-style-control') || '').trim();
                return directionalFields.has(field) && node.dataset.styleDirty === '1';
            });
            if (dirtyDirectionalControls.length) {
                const directionalValues = {
                    top: refs.styleControls?.offsetTopPx?.value || '',
                    bottom: refs.styleControls?.offsetBottomPx?.value || '',
                    left: refs.styleControls?.offsetLeftPx?.value || '',
                    right: refs.styleControls?.offsetRightPx?.value || ''
                };
                selectedKeys.forEach((styleKey) => {
                    const didChange = this.updateDirectionalOffsetsForKey(styleKey, directionalValues, { deferRefresh: true });
                    if (didChange) changed = true;
                });
                dirtyDirectionalControls.forEach((node) => {
                    node.dataset.styleDirty = '0';
                });
            }

            const toggleMap = [
                ['style-bold', 'bold'],
                ['style-italic', 'italic'],
                ['style-underline', 'underline'],
                ['style-split-two', 'splitColumns']
            ];
            const dirtyToggles = toggleMap
                .map(([action, field]) => ({ button: this.getActionButton(action), field }))
                .filter(({ button }) => Boolean(button && button.dataset.styleDirty === '1'));
            if (dirtyToggles.length) {
                selectedKeys.forEach((styleKey) => {
                    const style = this.getStyleObjectByKey(styleKey);
                    if (!style) return;
                    dirtyToggles.forEach(({ button, field }) => {
                        style[field] = button.dataset.styleValue === '1';
                        changed = true;
                    });
                    if (!Object.keys(style).length) {
                        delete this.elementStyleMap[styleKey];
                    }
                });
                dirtyToggles.forEach(({ button }) => {
                    button.dataset.styleDirty = '0';
                });
            }
        }

        if (changed) {
            this.moveModeEnabled = false;
            this.styleEditorNeedsSync = true;
            this.refreshAfterStyleChange({
                delayMs: 0,
                showLoading: true,
                busyMessage: 'Application des modifications...'
            });
            return;
        }
        this.updateCustomControlsUi();
    }

    toggleActiveStyleFlag(flag) {
        const style = this.getActiveStyleObject();
        if (!style) return;
        if (flag !== 'bold' && flag !== 'italic' && flag !== 'underline') return;
        style[flag] = !Boolean(style[flag]);
        this.refreshAfterStyleChange();
    }

    nudgeActiveStyleTarget(dx = 0, dy = 0) {
        const style = this.getActiveStyleObject();
        if (!style) return;
        const clamp = (value) => Math.max(-this.maxMoveOffsetPx, Math.min(this.maxMoveOffsetPx, Math.round(value)));
        const currentX = Number(style.offsetXPx || 0);
        const currentY = Number(style.offsetYPx || 0);
        const nextX = clamp((Number.isFinite(currentX) ? currentX : 0) + dx);
        const nextY = clamp((Number.isFinite(currentY) ? currentY : 0) + dy);

        if (nextX !== 0) style.offsetXPx = String(nextX);
        else delete style.offsetXPx;

        if (nextY !== 0) style.offsetYPx = String(nextY);
        else delete style.offsetYPx;

        this.refreshAfterStyleChange({ delayMs: this.moveRenderDelayMs, skipHint: true });
    }

    updateStyleValueForKey(styleKey, field, value, options = {}) {
        const cleanKey = String(styleKey || '').trim();
        const style = this.getStyleObjectByKey(cleanKey);
        if (!style) return false;
        let changed = false;
        switch (field) {
            case 'textColor': {
                const next = this.normalizeHexColor(value);
                if (next && style.textColor !== next) {
                    style.textColor = next;
                    changed = true;
                }
                break;
            }
            case 'bgColor': {
                const next = this.normalizeHexColor(value);
                if (next && style.bgColor !== next) {
                    style.bgColor = next;
                    changed = true;
                }
                break;
            }
            case 'fontSizePx': {
                const next = this.normalizeCssNumber(value, 8, 160, 2);
                if (next) {
                    if (style.fontSizePx !== next) {
                        style.fontSizePx = next;
                        changed = true;
                    }
                } else if (style.fontSizePx !== undefined) {
                    delete style.fontSizePx;
                    changed = true;
                }
                break;
            }
            case 'lineHeight': {
                const next = this.normalizeLineHeightValue(value, 0.8, 3);
                if (next) {
                    if (style.lineHeight !== next) {
                        style.lineHeight = next;
                        changed = true;
                    }
                } else if (style.lineHeight !== undefined) {
                    delete style.lineHeight;
                    changed = true;
                }
                break;
            }
            case 'textAlign': {
                const next = String(value || '').trim();
                if (next) {
                    if (style.textAlign !== next) {
                        style.textAlign = next;
                        changed = true;
                    }
                } else if (style.textAlign !== undefined) {
                    delete style.textAlign;
                    changed = true;
                }
                break;
            }
            case 'bulletStyle': {
                const next = String(value || '').trim() || 'none';
                if (style.bulletStyle !== next) {
                    style.bulletStyle = next;
                    changed = true;
                }
                break;
            }
            case 'widthPx': {
                const next = this.normalizeCssPixel(value, 20, 1600);
                if (next) {
                    if (style.widthPx !== next) {
                        style.widthPx = next;
                        changed = true;
                    }
                } else if (style.widthPx !== undefined) {
                    delete style.widthPx;
                    changed = true;
                }
                break;
            }
            case 'heightPx': {
                const next = this.normalizeCssPixel(value, 20, 1600);
                if (next) {
                    if (style.heightPx !== next) {
                        style.heightPx = next;
                        changed = true;
                    }
                } else if (style.heightPx !== undefined) {
                    delete style.heightPx;
                    changed = true;
                }
                break;
            }
            default:
                return false;
        }
        if (Object.prototype.hasOwnProperty.call(this.elementStyleMap, cleanKey) && !Object.keys(style).length) {
            delete this.elementStyleMap[cleanKey];
        }
        if (changed && !options?.deferRefresh) this.refreshAfterStyleChange();
        return changed;
    }

    updateDirectionalOffsetsForKey(styleKey, values = {}, options = {}) {
        const cleanKey = String(styleKey || '').trim();
        const style = this.getStyleObjectByKey(cleanKey);
        if (!style) return false;

        const normalizeOffset = (raw) => {
            const normalized = this.normalizeCssPixel(raw, 0, this.maxMoveOffsetPx);
            if (!normalized) return 0;
            const parsed = Number(normalized);
            return Number.isFinite(parsed) ? parsed : 0;
        };

        const left = normalizeOffset(values.left);
        const right = normalizeOffset(values.right);
        const top = normalizeOffset(values.top);
        const bottom = normalizeOffset(values.bottom);

        const nextX = Math.max(-this.maxMoveOffsetPx, Math.min(this.maxMoveOffsetPx, Math.round(right - left)));
        const nextY = Math.max(-this.maxMoveOffsetPx, Math.min(this.maxMoveOffsetPx, Math.round(bottom - top)));
        const currentX = Number(style.offsetXPx || 0);
        const currentY = Number(style.offsetYPx || 0);

        let changed = false;
        if (nextX !== (Number.isFinite(currentX) ? currentX : 0)) {
            if (nextX !== 0) style.offsetXPx = String(nextX);
            else delete style.offsetXPx;
            changed = true;
        }
        if (nextY !== (Number.isFinite(currentY) ? currentY : 0)) {
            if (nextY !== 0) style.offsetYPx = String(nextY);
            else delete style.offsetYPx;
            changed = true;
        }

        if (Object.prototype.hasOwnProperty.call(this.elementStyleMap, cleanKey) && !Object.keys(style).length) {
            delete this.elementStyleMap[cleanKey];
        }
        if (changed && !options?.deferRefresh) this.refreshAfterStyleChange();
        return changed;
    }

    updateActiveStyleValue(field, value, options = {}) {
        return this.updateStyleValueForKey(this.activeStyleTargetKey, field, value, options);
    }

    resetActiveStyleTarget() {
        if (!this.activeStyleTargetKey) return;
        delete this.elementStyleMap[this.activeStyleTargetKey];
        this.styleEditorNeedsSync = true;
        this.refreshAfterStyleChange();
    }

    syncStyleEditorControls() {
        const refs = this.ensureUiRefs();
        const editor = refs.editor;
        if (!editor) return;
        const hasTarget = Boolean(this.activeStyleTargetKey);
        if (hasTarget && this.styleControlDirtyKey && this.styleControlDirtyKey !== this.activeStyleTargetKey) {
            this.resetStyleControlDirtyFlags();
            this.resetStyleToggleDirtyFlags();
        }
        this.styleControlDirtyKey = hasTarget ? this.activeStyleTargetKey : '';
        const preview = this.querySelector('#pv-preview');
        const target = hasTarget ? this.getStyleTargetElement(this.activeStyleTargetKey, preview) : null;
        const style = hasTarget ? (this.elementStyleMap[this.activeStyleTargetKey] || {}) : {};
        const computed = target ? window.getComputedStyle(target) : null;
        const selectedKeys = this.getSelectedStyleTargetKeys();
        const extraSelectedCount = Math.max(0, selectedKeys.length - 1);
        const label = refs.styleTargetLabel;
        if (label) {
            const baseLabel = target ? (target.getAttribute('data-style-label') || this.activeStyleTargetKey) : 'Aucun';
            label.textContent = extraSelectedCount > 0 ? `${baseLabel} (+${extraSelectedCount})` : baseLabel;
        }

        const setValue = (field, val) => {
            const node = refs.styleControls?.[field];
            if (!node) return;
            const preserveDirty = hasTarget && node.dataset.styleDirty === '1';
            if (!preserveDirty) {
                node.value = val;
                node.dataset.styleDirty = '0';
            }
            if (!hasTarget) {
                node.dataset.styleDirty = '0';
            }
            node.disabled = !hasTarget;
        };
        setValue('textColor', this.cssColorToHex(style.textColor || computed?.color || '', '#222222'));
        setValue('bgColor', this.cssColorToHex(style.bgColor || computed?.backgroundColor || '', '#ffffff'));
        setValue('fontSizePx', style.fontSizePx || this.normalizeCssNumber(computed?.fontSize || '', 8, 160, 2));
        setValue('lineHeight', style.lineHeight || this.normalizeLineHeightValue(computed?.lineHeight || '', 0.8, 3));
        setValue('textAlign', style.textAlign || (computed ? String(computed.textAlign || '') : ''));
        setValue('bulletStyle', style.bulletStyle || 'none');
        setValue('widthPx', style.widthPx || '');
        setValue('heightPx', style.heightPx || '');
        const offsetX = Number(style.offsetXPx || 0);
        const offsetY = Number(style.offsetYPx || 0);
        setValue('offsetTopPx', offsetY < 0 ? String(Math.abs(Math.round(offsetY))) : '');
        setValue('offsetBottomPx', offsetY > 0 ? String(Math.abs(Math.round(offsetY))) : '');
        setValue('offsetLeftPx', offsetX < 0 ? String(Math.abs(Math.round(offsetX))) : '');
        setValue('offsetRightPx', offsetX > 0 ? String(Math.abs(Math.round(offsetX))) : '');

        ['style-bold', 'style-italic', 'style-underline', 'style-split-two', 'style-reset', 'save-style-edits', 'style-select-another', 'style-open-inline-editor', 'style-close-editor'].forEach((action) => {
            const btn = this.getActionButton(action);
            if (btn) btn.disabled = !hasTarget;
        });
        const inlineEditBtn = this.getActionButton('style-open-inline-editor');
        if (inlineEditBtn && extraSelectedCount > 0) {
            inlineEditBtn.disabled = true;
        }
        this.styleEditorNeedsSync = false;
    }

    applyElementStyle(target, style) {
        if (!target || !style || typeof style !== 'object') return;
        if (style.textColor) target.style.color = style.textColor;
        if (style.bgColor) target.style.setProperty('background-color', style.bgColor, 'important');
        if (style.fontSizePx) target.style.fontSize = `${style.fontSizePx}px`;
        if (style.lineHeight) target.style.lineHeight = style.lineHeight;
        if (style.bold !== undefined) target.style.fontWeight = style.bold ? '700' : '400';
        if (style.italic !== undefined) target.style.fontStyle = style.italic ? 'italic' : 'normal';
        if (style.underline !== undefined) target.style.textDecoration = style.underline ? 'underline' : 'none';
        if (style.textAlign) target.style.textAlign = style.textAlign;
        if (style.widthPx) {
            target.style.width = `${style.widthPx}px`;
            if (window.getComputedStyle(target).display === 'inline') {
                target.style.display = 'inline-block';
            }
        }
        if (style.heightPx) {
            target.style.height = `${style.heightPx}px`;
            if (window.getComputedStyle(target).display === 'inline') {
                target.style.display = 'inline-block';
            }
        }
        if (style.splitColumns && ['DIV', 'UL', 'OL'].includes(target.tagName)) {
            let splitTarget = target;
            if (target.tagName === 'DIV' && target.children.length > 1) {
                const lastChild = target.lastElementChild;
                if (lastChild instanceof HTMLElement && ['DIV', 'UL', 'OL'].includes(lastChild.tagName)) {
                    splitTarget = lastChild;
                    splitTarget.setAttribute('data-split-proxy', '1');
                }
            }
            splitTarget.style.display = 'grid';
            splitTarget.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
            splitTarget.style.columnGap = '18px';
            splitTarget.style.rowGap = '10px';
            splitTarget.style.gridAutoFlow = 'row';
            splitTarget.style.alignItems = 'start';
            splitTarget.style.justifyItems = 'stretch';
        } else {
            target.style.removeProperty('column-count');
            target.style.removeProperty('column-gap');
            target.style.removeProperty('column-fill');
            target.style.removeProperty('grid-template-columns');
            target.style.removeProperty('grid-auto-flow');
            target.style.removeProperty('row-gap');
            target.style.removeProperty('align-items');
            target.style.removeProperty('justify-items');
        }

        const offsetX = Number(style.offsetXPx || 0);
        const offsetY = Number(style.offsetYPx || 0);
        const hasOffset = Number.isFinite(offsetX) && Number.isFinite(offsetY) && (Math.abs(offsetX) > 0 || Math.abs(offsetY) > 0);
        if (hasOffset) {
            target.style.transform = `translate(${Math.round(offsetX)}px, ${Math.round(offsetY)}px)`;
        } else {
            target.style.removeProperty('transform');
        }

        const listTarget = target.closest('ul,ol');
        if (listTarget) {
            const bulletStyle = style.bulletStyle || 'none';
            listTarget.style.listStyleType = bulletStyle;
            listTarget.style.paddingLeft = bulletStyle === 'none' ? '0' : '1.1rem';
        }
    }

    refreshVisibleHotspotSelection(options = {}) {
        const activeKey = String(this.activeStyleTargetKey || '').trim();
        const selectedKeys = this.getSelectedStyleTargetKeys();
        const domVersion = Number(this.hotspotDomVersion || 0);
        const selectionSignature = `${activeKey}::${selectedKeys.join('|')}`;
        const prevState = this.hotspotSelectionState || { selectionSignature: '', domVersion: -1 };
        const force = Boolean(options?.force);
        const stateUnchanged = (
            prevState.selectionSignature === selectionSignature
            && prevState.domVersion === domVersion
        );
        if (!force && stateUnchanged) return;

        const removeActiveClasses = (node) => {
            if (!(node instanceof HTMLElement) || !node.isConnected) return;
            node.classList.remove(
                'ring-2',
                'ring-sky-500',
                'ring-amber-400',
                'ring-inset',
                'bg-sky-300/20',
                'bg-amber-200/20'
            );
        };

        const previousNodes = Array.isArray(this.activeHotspotNodes) ? this.activeHotspotNodes : [];
        previousNodes.forEach(removeActiveClasses);

        const highlightedNodes = [];
        let anchorZone = null;
        let anchorArea = -1;
        selectedKeys.forEach((styleKey) => {
            const selectorKey = this.toAttrSelectorValue(styleKey);
            const nodes = Array.from(this.querySelectorAll(`[data-style-hotspot="1"][data-style-key="${selectorKey}"]`));
            const isActive = styleKey === activeKey;
            nodes.forEach((zone) => {
                highlightedNodes.push(zone);
                if (isActive) {
                    zone.classList.add('ring-2', 'ring-sky-500', 'ring-inset', 'bg-sky-300/20');
                    const width = Number.parseFloat(String(zone.style.width || '0').replace('%', ''));
                    const height = Number.parseFloat(String(zone.style.height || '0').replace('%', ''));
                    const area = (Number.isFinite(width) ? width : 0) * (Number.isFinite(height) ? height : 0);
                    if (!anchorZone || area > anchorArea) {
                        anchorZone = zone;
                        anchorArea = area;
                    }
                    return;
                }
                zone.classList.add('ring-2', 'ring-amber-400', 'ring-inset', 'bg-amber-200/20');
            });
        });

        this.activeHotspotNodes = highlightedNodes;
        this.hotspotSelectionState = { selectionSignature, domVersion };
    }

    syncVisibleHotspotsWithOffsets() {
        let activeMoved = false;
        this.querySelectorAll('[data-style-hotspot="1"]').forEach((zone) => {
            const styleKey = String(zone.getAttribute('data-style-key') || '').trim();
            if (!styleKey) return;

            const style = this.elementStyleMap[styleKey] || {};
            const renderedOffsetX = Number(zone.dataset.renderedOffsetX || 0);
            const renderedOffsetY = Number(zone.dataset.renderedOffsetY || 0);
            const scale = Number(zone.dataset.hotspotScale || 1);
            const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
            const targetOffsetX = Number(style.offsetXPx || 0);
            const targetOffsetY = Number(style.offsetYPx || 0);
            const safeTargetOffsetX = Number.isFinite(targetOffsetX) ? targetOffsetX : 0;
            const safeTargetOffsetY = Number.isFinite(targetOffsetY) ? targetOffsetY : 0;
            const safeRenderedOffsetX = Number.isFinite(renderedOffsetX) ? renderedOffsetX : 0;
            const safeRenderedOffsetY = Number.isFinite(renderedOffsetY) ? renderedOffsetY : 0;

            const shiftX = (safeTargetOffsetX - safeRenderedOffsetX) * safeScale;
            const shiftY = (safeTargetOffsetY - safeRenderedOffsetY) * safeScale;
            if (Math.abs(shiftX) > 0.05 || Math.abs(shiftY) > 0.05) {
                zone.style.transform = `translate(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px)`;
                if (styleKey === this.activeStyleTargetKey) {
                    activeMoved = true;
                }
            } else {
                zone.style.removeProperty('transform');
            }
        });
        if (activeMoved) {
            this.refreshVisibleHotspotSelection({ force: true });
        }
    }

    appendDirectionalMoveControls(zone, styleKey) {
        const layer = zone?.parentElement;
        if (!layer) return;
        const layerRect = layer.getBoundingClientRect();
        const zoneRect = zone.getBoundingClientRect();
        if (!layerRect?.width || !layerRect?.height || !zoneRect?.width || !zoneRect?.height) return;

        const centerXPx = (zoneRect.left - layerRect.left) + (zoneRect.width / 2);
        const centerYPx = (zoneRect.top - layerRect.top) + Math.min(24, Math.max(zoneRect.height / 2, 8));
        const centerX = Math.max(6, Math.min(94, (centerXPx / layerRect.width) * 100));
        const centerY = Math.max(8, Math.min(92, (centerYPx / layerRect.height) * 100));

        const controls = document.createElement('div');
        controls.className = 'absolute z-[4] grid grid-cols-3 grid-rows-3 gap-1 rounded-lg border border-slate-200 bg-white/95 p-1 shadow-lg backdrop-blur-sm';
        controls.style.left = `${centerX}%`;
        controls.style.top = `${centerY}%`;
        controls.style.transform = 'translate(-50%, -50%)';
        controls.setAttribute('data-style-move-controls', '1');
        controls.innerHTML = `
            <button type="button" data-action="move-up" data-style-key="${styleKey}" class="col-start-2 row-start-1 inline-flex h-7 w-7 items-center justify-center rounded border border-slate-300 bg-white text-xs text-slate-700 hover:bg-slate-100" title="Monter"><i class="fa-solid fa-arrow-up"></i></button>
            <button type="button" data-action="move-left" data-style-key="${styleKey}" class="col-start-1 row-start-2 inline-flex h-7 w-7 items-center justify-center rounded border border-slate-300 bg-white text-xs text-slate-700 hover:bg-slate-100" title="Gauche"><i class="fa-solid fa-arrow-left"></i></button>
            <button type="button" data-action="move-right" data-style-key="${styleKey}" class="col-start-3 row-start-2 inline-flex h-7 w-7 items-center justify-center rounded border border-slate-300 bg-white text-xs text-slate-700 hover:bg-slate-100" title="Droite"><i class="fa-solid fa-arrow-right"></i></button>
            <button type="button" data-action="move-down" data-style-key="${styleKey}" class="col-start-2 row-start-3 inline-flex h-7 w-7 items-center justify-center rounded border border-slate-300 bg-white text-xs text-slate-700 hover:bg-slate-100" title="Descendre"><i class="fa-solid fa-arrow-down"></i></button>
        `;
        layer.appendChild(controls);
    }

    normalizeHexColor(value) {
        const raw = (value || '').trim();
        if (!raw) return '';
        if (/^#[0-9a-f]{6}$/i.test(raw)) {
            return raw.toLowerCase();
        }
        const shortMatch = raw.match(/^#([0-9a-f]{3})$/i);
        if (!shortMatch) return '';
        const hex = shortMatch[1].toLowerCase();
        return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    clampFontScale(value) {
        const next = Number(value);
        if (!Number.isFinite(next)) return this.fontScale;
        return Math.max(this.minFontScale, Math.min(this.maxFontScale, next));
    }

    clampLeftColumnWidth(value) {
        const next = Number(value);
        if (!Number.isFinite(next)) return this.leftColumnWidth;
        return Math.max(this.minLeftColumnWidth, Math.min(this.maxLeftColumnWidth, Math.round(next)));
    }

    clampLineHeightScale(value) {
        const next = Number(value);
        if (!Number.isFinite(next)) return this.lineHeightScale;
        return Math.max(this.minLineHeightScale, Math.min(this.maxLineHeightScale, next));
    }

    refreshAfterStyleChange(options = {}) {
        const delayMsRaw = Number(options?.delayMs);
        const delayMs = Number.isFinite(delayMsRaw) ? Math.max(0, Math.floor(delayMsRaw)) : this.softRenderDelayMs;
        const skipHint = Boolean(options?.skipHint);
        const showLoading = Boolean(options?.showLoading);
        const busyMessage = String(options?.busyMessage || '').trim();
        this.applyPreviewCustomStyles();
        this.bumpPreviewVersion();
        this.syncVisibleHotspotsWithOffsets();
        if (!skipHint) {
            this.updatePdfPagesHint();
        }
        this.schedulePaginatedPreviewRender({ delayMs, showLoading, busyMessage });
    }

    adjustFontScale(direction) {
        const step = Number(direction) > 0 ? this.fontScaleStep : -this.fontScaleStep;
        const nextScale = this.clampFontScale(this.fontScale + step);
        if (Math.abs(nextScale - this.fontScale) < 0.0001) {
            this.updateCustomControlsUi();
            return;
        }
        this.fontScale = nextScale;
        this.refreshAfterStyleChange();
    }

    setTypography(key) {
        const resolvedKey = Object.prototype.hasOwnProperty.call(this.typographyOptions, key) ? key : 'poppins';
        if (resolvedKey === this.typographyKey) {
            this.updateCustomControlsUi();
            return;
        }
        this.typographyKey = resolvedKey;
        this.ensureTypographyStylesheet(this.typographyKey).then(() => {
            this.refreshAfterStyleChange({
                delayMs: 0,
                showLoading: true,
                busyMessage: 'Application des modifications...'
            });
        });
    }

    setLeftColumnColor(value) {
        const nextColor = this.normalizeHexColor(value);
        if (!nextColor) return;
        if (nextColor === this.leftColumnColor) {
            this.updateCustomControlsUi();
            return;
        }
        this.leftColumnColor = nextColor;
        this.refreshAfterStyleChange();
    }

    setLeftColumnWidth(value) {
        const nextWidth = this.clampLeftColumnWidth(value);
        if (nextWidth === this.leftColumnWidth) {
            this.updateCustomControlsUi();
            return;
        }
        this.leftColumnWidth = nextWidth;
        this.refreshAfterStyleChange();
    }

    setPhotoShape(value) {
        const shape = value === 'circle' ? 'circle' : 'rect';
        if (shape === this.photoShape) {
            this.updateCustomControlsUi();
            return;
        }
        this.photoShape = shape;
        this.refreshAfterStyleChange();
    }

    setTitleColor(value) {
        const nextColor = this.normalizeHexColor(value);
        if (!nextColor) return;
        if (nextColor === this.titleColor) {
            this.updateCustomControlsUi();
            return;
        }
        this.titleColor = nextColor;
        this.refreshAfterStyleChange();
    }

    setSubtitleColor(value) {
        const nextColor = this.normalizeHexColor(value);
        if (!nextColor) return;
        if (nextColor === this.subtitleColor) {
            this.updateCustomControlsUi();
            return;
        }
        this.subtitleColor = nextColor;
        this.refreshAfterStyleChange();
    }

    setLineHeightScale(value) {
        const nextScale = this.clampLineHeightScale(value);
        if (Math.abs(nextScale - this.lineHeightScale) < 0.0001) {
            this.updateCustomControlsUi();
            return;
        }
        this.lineHeightScale = nextScale;
        this.refreshAfterStyleChange();
    }

    applyPreviewCustomStyles() {
        const preview = this.querySelector('#pv-preview');
        if (!preview) {
            this.updateCustomControlsUi();
            return;
        }
        this.applyStylesToPreviewNode(preview);
        if (this.autoFitPending) {
            this.applyTextAutoFit(preview);
            this.autoFitPending = false;
        }
        this.updateCustomControlsUi();
    }

    applyStylesToPreviewNode(preview) {
        if (!preview) return;
        this.setupStyleTargets(preview);
        this.applyTextOverrides(preview);
        this.resetStyleTargetInlineStyles(preview);
        const typography = this.getTypographyConfig(this.typographyKey);
        if (typography && typography.fontFamily) {
            preview.style.fontFamily = typography.fontFamily;
        }

        const rightColumnWidth = Math.max(5, 100 - this.leftColumnWidth);
        preview.style.gridTemplateColumns = `${this.leftColumnWidth}% ${rightColumnWidth}%`;

        const leftColumn = preview.querySelector('.pv-left');
        const textColor = this.getContrastingTextColor(this.leftColumnColor);
        if (leftColumn) {
            leftColumn.style.backgroundColor = this.leftColumnColor;
            leftColumn.style.color = textColor;
            leftColumn.querySelectorAll('.pv-l-title').forEach((title) => {
                title.style.color = textColor;
            });
        }

        preview.querySelectorAll('.pv-left .pv-l-line').forEach((line) => {
            line.style.backgroundColor = textColor;
        });

        preview.querySelectorAll('.pv-r-line').forEach((line) => {
            line.style.backgroundColor = this.leftColumnColor;
        });

        preview.querySelectorAll('.pv-l-list, .pv-edu-list, .pv-exp-list, .pv-sk-list').forEach((list) => {
            list.style.listStyleType = 'none';
            list.style.paddingLeft = '0';
        });

        preview.querySelectorAll('.pv-r-name, .pv-r-title, .pv-sk-col-title').forEach((el) => {
            el.style.color = this.titleColor;
        });
        preview.querySelectorAll('.pv-r-role, .pv-exp-role, .pv-exp-company, .pv-exp-date, .pv-edu-year, .pv-edu-degree').forEach((el) => {
            el.style.color = this.subtitleColor;
        });

        const photo = preview.querySelector('.pv-photo');
        if (photo) {
            this.applyPhotoShapeStyles(photo, textColor);
        }

        this.applyScaledFontSizes(preview);
        Object.entries(this.elementStyleMap || {}).forEach(([key, style]) => {
            const target = this.getStyleTargetElement(key, preview);
            if (!target) return;
            this.applyElementStyle(target, style);
        });
    }

    resetStyleTargetInlineStyles(preview) {
        if (!preview) return;
        const nodes = new Set([
            ...Array.from(preview.querySelectorAll('[data-style-target="1"]')),
            ...Array.from(preview.querySelectorAll('[data-split-proxy="1"]'))
        ]);
        nodes.forEach((el) => {
            el.style.removeProperty('color');
            el.style.removeProperty('background-color');
            el.style.removeProperty('font-size');
            el.style.removeProperty('line-height');
            el.style.removeProperty('font-weight');
            el.style.removeProperty('font-style');
            el.style.removeProperty('text-decoration');
            el.style.removeProperty('text-align');
            el.style.removeProperty('width');
            el.style.removeProperty('height');
            el.style.removeProperty('display');
            el.style.removeProperty('transform');
            el.style.removeProperty('column-count');
            el.style.removeProperty('column-gap');
            el.style.removeProperty('column-fill');
            el.style.removeProperty('grid-template-columns');
            el.style.removeProperty('grid-auto-flow');
            el.style.removeProperty('row-gap');
            el.style.removeProperty('align-items');
            el.style.removeProperty('justify-items');
            if (el.hasAttribute('data-split-proxy')) {
                el.removeAttribute('data-split-proxy');
            }
        });
    }

    applyPhotoShapeStyles(photo, textColor = '#ffffff') {
        if (!photo) return;
        const wrapper = photo.closest('.pv-photo-wrap');
        const hasImage = Boolean(photo.getAttribute('src'));
        if (wrapper instanceof HTMLElement) {
            if (!hasImage) {
                wrapper.style.display = 'none';
                wrapper.style.height = '0';
                wrapper.style.overflow = 'hidden';
                photo.style.display = 'none';
                return;
            }
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.justifyContent = 'center';
            wrapper.style.width = '100%';
            wrapper.style.height = '250px';
            wrapper.style.overflow = 'hidden';
        }
        photo.style.display = 'block';
        photo.style.objectFit = 'cover';
        photo.style.objectPosition = 'center center';
        photo.style.flexShrink = '0';

        if (this.photoShape === 'circle') {
            photo.style.width = 'min(188px, calc(100% - 28px))';
            photo.style.height = 'min(188px, calc(100% - 28px))';
            photo.style.maxWidth = '100%';
            photo.style.margin = '0 auto';
            photo.style.borderRadius = '9999px';
            photo.style.border = `4px solid ${textColor}`;
            return;
        }

        photo.style.width = '100%';
        photo.style.height = '250px';
        photo.style.maxWidth = '100%';
        photo.style.margin = '0';
        photo.style.borderRadius = '0';
        photo.style.border = '0';
    }

    applyScaledFontSizes(preview) {
        if (!preview) return;
        const targets = this.getScalableTextTargets(preview);
        targets.forEach((el) => {
            const computed = window.getComputedStyle(el);
            if (!el.dataset.scaleBaseFontPx) {
                const baseFont = parseFloat(computed.fontSize || '0');
                if (Number.isFinite(baseFont) && baseFont > 0) {
                    el.dataset.scaleBaseFontPx = String(baseFont);
                }
            }

            const baseFontPx = parseFloat(el.dataset.scaleBaseFontPx || '0');
            if (Number.isFinite(baseFontPx) && baseFontPx > 0) {
                const nextFontPx = (baseFontPx * this.fontScale).toFixed(2);
                el.style.fontSize = `${nextFontPx}px`;
            }

            if (!el.dataset.scaleBaseLinePx) {
                const lineHeightRaw = computed.lineHeight || '';
                if (/px$/i.test(lineHeightRaw)) {
                    const baseLine = parseFloat(lineHeightRaw);
                    if (Number.isFinite(baseLine) && baseLine > 0) {
                        el.dataset.scaleBaseLinePx = String(baseLine);
                    }
                }
            }

            const baseLinePx = parseFloat(el.dataset.scaleBaseLinePx || '0');
            if (Number.isFinite(baseLinePx) && baseLinePx > 0) {
                const nextLinePx = Math.max(baseLinePx * this.fontScale * this.lineHeightScale, 1).toFixed(2);
                el.style.lineHeight = `${nextLinePx}px`;
            }
        });
    }

    getScalableTextTargets(preview) {
        if (!preview) return [];
        const selectors = [
            '[data-autofit]',
            '.pv-l-title',
            '.pv-r-title',
            '.pv-sk-col-title',
            '.pv-r-name',
            '.pv-r-role',
            '.pv-l-item i',
            '.pv-edu-li',
            '.pv-exp-date',
            '.pv-exp-role',
            '.pv-exp-company',
            '.pv-l-text'
        ];
        const seen = new Set();
        selectors.forEach((selector) => {
            preview.querySelectorAll(selector).forEach((el) => seen.add(el));
        });
        return Array.from(seen);
    }

    updateCustomControlsUi() {
        if (!this.activeStyleTargetKey && this.additionalSelectionMode) {
            this.additionalSelectionMode = false;
        }
        const refs = this.ensureUiRefs();
        const colorInput = refs.colorInput;
        if (colorInput) {
            const isDirty = colorInput.dataset.globalDirty === '1';
            const sourceColor = isDirty ? colorInput.value : this.leftColumnColor;
            const nextColor = this.normalizeHexColor(sourceColor) || this.normalizeHexColor(this.leftColumnColor);
            if (nextColor && colorInput.value !== nextColor) {
                colorInput.value = nextColor;
            }
            if (!isDirty) {
                colorInput.dataset.globalDirty = '0';
            }
        }
        const typographySelect = refs.typographySelect;
        if (typographySelect) {
            const isDirty = typographySelect.dataset.globalDirty === '1';
            const targetValue = isDirty ? typographySelect.value : this.typographyKey;
            const nextTypography = Object.prototype.hasOwnProperty.call(this.typographyOptions, targetValue)
                ? targetValue
                : this.typographyKey;
            if (typographySelect.value !== nextTypography) {
                typographySelect.value = nextTypography;
            }
            if (!isDirty) {
                typographySelect.dataset.globalDirty = '0';
            }
        }

        const leftWidthInput = refs.leftWidthInput;
        let liveWidth = this.leftColumnWidth;
        if (leftWidthInput) {
            const isDirty = leftWidthInput.dataset.globalDirty === '1';
            liveWidth = this.clampLeftColumnWidth(isDirty ? leftWidthInput.value : this.leftColumnWidth);
            const expected = String(liveWidth);
            if (leftWidthInput.value !== expected) {
                leftWidthInput.value = expected;
            }
            if (!isDirty) {
                leftWidthInput.dataset.globalDirty = '0';
            }
        }
        const leftWidthLabel = refs.leftWidthLabel;
        if (leftWidthLabel) {
            leftWidthLabel.textContent = `${liveWidth}%`;
        }

        const shapeSelect = refs.shapeSelect;
        if (shapeSelect) {
            const isDirty = shapeSelect.dataset.globalDirty === '1';
            const liveShape = (isDirty ? shapeSelect.value : this.photoShape) === 'circle' ? 'circle' : 'rect';
            if (shapeSelect.value !== liveShape) {
                shapeSelect.value = liveShape;
            }
            if (!isDirty) {
                shapeSelect.dataset.globalDirty = '0';
            }
        }
        const globalSaveBtn = refs.globalSaveBtn;
        if (globalSaveBtn) {
            const hasGlobalPending = Boolean(
                colorInput?.dataset.globalDirty === '1'
                || typographySelect?.dataset.globalDirty === '1'
                || leftWidthInput?.dataset.globalDirty === '1'
                || shapeSelect?.dataset.globalDirty === '1'
            );
            globalSaveBtn.classList.toggle('ring-2', hasGlobalPending);
            globalSaveBtn.classList.toggle('ring-amber-300', hasGlobalPending);
        }

        const editor = refs.editor;
        if (editor) {
            editor.classList.toggle('hidden', !this.styleEditorVisible);
        }

        const activeStyle = this.activeStyleTargetKey ? (this.elementStyleMap[this.activeStyleTargetKey] || {}) : null;
        const toggleState = (action, enabled) => {
            const btn = this.getActionButton(action);
            if (!btn) return;
            const preserveDirty = Boolean(this.activeStyleTargetKey) && btn.dataset.styleDirty === '1';
            const liveState = preserveDirty
                ? (btn.dataset.styleValue === '1')
                : Boolean(enabled);
            this.setStyleToggleUiState(action, liveState, { resetDirty: !preserveDirty });
            if (!this.activeStyleTargetKey) {
                btn.dataset.styleDirty = '0';
            }
        };
        toggleState('style-bold', Boolean(activeStyle?.bold));
        toggleState('style-italic', Boolean(activeStyle?.italic));
        toggleState('style-underline', Boolean(activeStyle?.underline));
        toggleState('style-split-two', Boolean(activeStyle?.splitColumns));
        const styleSaveBtn = this.getActionButton('save-style-edits');
        if (styleSaveBtn) {
            const hasDirtyStyleControl = (refs.styleControlNodes || []).some((node) => node.dataset.styleDirty === '1');
            const hasDirtyToggle = this.getStyleToggleActions().some((action) => {
                const btn = this.getActionButton(action);
                return Boolean(btn && btn.dataset.styleDirty === '1');
            });
            const hasStylePending = Boolean(
                this.pendingStyleResetKey && this.pendingStyleResetKey === this.activeStyleTargetKey
            ) || hasDirtyStyleControl || hasDirtyToggle;
            styleSaveBtn.classList.toggle('ring-2', hasStylePending);
            styleSaveBtn.classList.toggle('ring-amber-300', hasStylePending);
        }
        const styleResetBtn = this.getActionButton('style-reset');
        if (styleResetBtn) {
            const pendingReset = Boolean(this.pendingStyleResetKey && this.pendingStyleResetKey === this.activeStyleTargetKey);
            styleResetBtn.classList.toggle('bg-amber-100', pendingReset);
            styleResetBtn.classList.toggle('border-amber-300', pendingReset);
        }
        const addSelectionBtn = this.getActionButton('style-select-another');
        if (addSelectionBtn) {
            const isEnabled = Boolean(this.additionalSelectionMode && this.activeStyleTargetKey);
            addSelectionBtn.classList.toggle('bg-sky-700', isEnabled);
            addSelectionBtn.classList.toggle('text-white', isEnabled);
            addSelectionBtn.classList.toggle('border-sky-700', isEnabled);
        }
        if (this.styleEditorNeedsSync) {
            this.syncStyleEditorControls();
        }
        this.refreshVisibleHotspotSelection();
    }

    getContrastingTextColor(hexColor) {
        const hex = this.normalizeHexColor(hexColor) || '#2f3e4e';
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const luminance = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return luminance >= 156 ? '#0f172a' : '#ffffff';
    }

    buildPageSlices(canvas, maxPageHeightPx, textFlow = null) {
        if (!canvas || !maxPageHeightPx) return [];
        const scaledFlow = this.scaleTextFlowForCanvas(textFlow, canvas.height);
        const slices = [];
        let renderedPx = 0;
        while (renderedPx < canvas.height) {
            const sliceHeightPx = this.findSmartSliceHeight(canvas, renderedPx, maxPageHeightPx, scaledFlow);
            if (!sliceHeightPx || sliceHeightPx < 1) break;
            slices.push(sliceHeightPx);
            renderedPx += sliceHeightPx;
        }
        if (!slices.length) {
            slices.push(Math.max(1, Math.min(maxPageHeightPx, canvas.height)));
        }
        return slices;
    }

    findSmartSliceHeight(canvas, startY, maxSliceHeightPx, textFlow = null) {
        const remaining = canvas.height - startY;
        if (remaining <= maxSliceHeightPx) return remaining;
        const blockRanges = Array.isArray(textFlow?.blockRanges) ? textFlow.blockRanges : [];

        // Evite les fins de page trop "vides" : on coupe pres du bas par defaut.
        const minSliceHeightPx = Math.max(760, Math.floor(maxSliceHeightPx * 0.78));
        const hardMinSlicePx = Math.max(120, Math.floor(maxSliceHeightPx * 0.2));
        const idealEndY = startY + maxSliceHeightPx;
        const minEndY = startY + minSliceHeightPx;
        if (minEndY >= idealEndY - 10) {
            const forcedCut = this.adjustCutForBlocks(idealEndY, startY, blockRanges, maxSliceHeightPx);
            if (forcedCut === null) return maxSliceHeightPx;
            return Math.max(hardMinSlicePx, Math.min(maxSliceHeightPx, forcedCut - startY));
        }
        const maxBottomGapPx = Math.max(48, Math.floor(maxSliceHeightPx * 0.08));

        const safeCut = this.findNearestSafeCut(textFlow, minEndY, idealEndY);
        if (safeCut !== null) {
            const adjustedSafeCut = this.adjustCutForBlocks(safeCut, startY, blockRanges, maxSliceHeightPx);
            if (adjustedSafeCut === null) return maxSliceHeightPx;
            const safeHeight = adjustedSafeCut - startY;
            const bottomGap = idealEndY - adjustedSafeCut;
            if (safeHeight >= hardMinSlicePx && bottomGap <= maxBottomGapPx) {
                return Math.min(maxSliceHeightPx, safeHeight);
            }
        }

        const scanBackPx = Math.min(160, idealEndY - minEndY);
        const searchStartY = idealEndY - scanBackPx;
        const searchEndY = idealEndY - 8;
        if (searchEndY <= searchStartY) return maxSliceHeightPx;

        const xStart = Math.floor(canvas.width * 0.34);
        const xEnd = Math.floor(canvas.width * 0.985);
        const scanWidth = Math.max(8, xEnd - xStart);
        const scanHeight = Math.max(1, searchEndY - searchStartY);

        const ctx = canvas.getContext('2d', { willReadFrequently: true }) || canvas.getContext('2d');
        if (!ctx) return maxSliceHeightPx;

        let bestLocalRow = -1;
        let nearBottomRow = -1;
        let bestScore = Number.POSITIVE_INFINITY;
        const xStep = 3;
        const nearWhiteThreshold = 0.012;

        try {
            const strip = ctx.getImageData(xStart, searchStartY, scanWidth, scanHeight).data;
            for (let row = scanHeight - 1; row >= 0; row -= 1) {
                let nonWhite = 0;
                let samples = 0;
                for (let x = 0; x < scanWidth; x += xStep) {
                    const idx = (row * scanWidth + x) * 4;
                    const r = strip[idx];
                    const g = strip[idx + 1];
                    const b = strip[idx + 2];
                    const a = strip[idx + 3];
                    if (a > 10) {
                        samples += 1;
                        if (r < 242 || g < 242 || b < 242) {
                            nonWhite += 1;
                        }
                    }
                }
                if (!samples) continue;
                const score = nonWhite / samples;
                if (nearBottomRow < 0 && score <= nearWhiteThreshold) {
                    nearBottomRow = row;
                    break;
                }
                if (score < bestScore || (Math.abs(score - bestScore) < 0.0001 && row > bestLocalRow)) {
                    bestScore = score;
                    bestLocalRow = row;
                }
            }
        } catch (error) {
            return maxSliceHeightPx;
        }

        const chosenRow = nearBottomRow >= 0 ? nearBottomRow : bestLocalRow;
        if (chosenRow < 0 || bestScore > 0.075) return maxSliceHeightPx;

        const breakY = searchStartY + chosenRow;
        const adjustedBreakY = this.adjustCutForBlocks(breakY, startY, blockRanges, maxSliceHeightPx);
        if (adjustedBreakY === null) return maxSliceHeightPx;
        const sliceHeight = adjustedBreakY - startY;
        if (sliceHeight < hardMinSlicePx) {
            const fallbackCut = this.adjustCutForBlocks(idealEndY, startY, blockRanges, maxSliceHeightPx);
            if (fallbackCut === null) return maxSliceHeightPx;
            return Math.max(hardMinSlicePx, Math.min(maxSliceHeightPx, fallbackCut - startY));
        }
        return Math.min(maxSliceHeightPx, sliceHeight);
    }

    adjustCutForBlocks(cutY, startY, blockRanges = [], maxSliceHeightPx = 0) {
        if (!Number.isFinite(cutY)) return cutY;
        if (!Array.isArray(blockRanges) || !blockRanges.length) return Math.floor(cutY);

        const originalCut = Math.floor(cutY);
        let adjustedCut = originalCut;
        let guard = 0;

        while (guard < 30) {
            const crossing = this.findCrossingBlock(blockRanges, adjustedCut);
            if (!crossing) break;

            const nextCut = crossing.top - 2;
            const maxAllowedCut = startY + (Number.isFinite(maxSliceHeightPx) ? maxSliceHeightPx : 0);
            const beforeHeight = nextCut - startY;
            const preferAfterThreshold = Math.max(320, Math.floor((Number.isFinite(maxSliceHeightPx) ? maxSliceHeightPx : 0) * 0.66));
            const afterBlockCut = crossing.bottom + 2;

            if (beforeHeight < preferAfterThreshold && afterBlockCut > startY + 2 && (!maxAllowedCut || afterBlockCut <= maxAllowedCut)) {
                adjustedCut = afterBlockCut;
                break;
            }

            // Si le bloc commence en tete de page, on tente de couper APRES ce bloc.
            if (nextCut <= startY + 2) {
                if (afterBlockCut > startY + 2 && (!maxAllowedCut || afterBlockCut <= maxAllowedCut)) {
                    adjustedCut = afterBlockCut;
                    break;
                }
                return null;
            }

            adjustedCut = nextCut;
            guard += 1;
        }

        return Math.max(startY + 2, adjustedCut);
    }

    findCrossingBlock(blockRanges, cutY) {
        if (!Array.isArray(blockRanges) || !blockRanges.length) return null;
        for (let i = 0; i < blockRanges.length; i += 1) {
            const range = blockRanges[i];
            if (cutY < range.top - 3) break;
            if (cutY <= range.bottom + 3) return range;
        }
        return null;
    }

    normalizeBlockRanges(ranges = []) {
        if (!Array.isArray(ranges) || !ranges.length) return [];
        const sorted = ranges
            .filter((item) => Number.isFinite(item?.top) && Number.isFinite(item?.bottom) && item.bottom > item.top)
            .map((item) => ({ top: Math.floor(item.top), bottom: Math.floor(item.bottom) }))
            .sort((a, b) => (a.top - b.top) || (a.bottom - b.bottom));
        if (!sorted.length) return [];

        const merged = [{ ...sorted[0] }];
        for (let i = 1; i < sorted.length; i += 1) {
            const current = sorted[i];
            const prev = merged[merged.length - 1];
            if (current.top <= prev.bottom + 2) {
                prev.bottom = Math.max(prev.bottom, current.bottom);
            } else {
                merged.push({ ...current });
            }
        }
        return merged;
    }

    findNearestSafeCut(textFlow, minEndY, idealEndY) {
        if (!textFlow) return null;
        const density = textFlow.density instanceof Uint16Array ? textFlow.density : null;
        const boundaries = textFlow.boundaries instanceof Uint8Array ? textFlow.boundaries : null;
        if (!density || !boundaries || !density.length || !boundaries.length) return null;

        const startY = Math.max(2, Math.floor(minEndY));
        const endY = Math.min(Math.min(density.length, boundaries.length) - 3, Math.floor(idealEndY));
        if (endY <= startY) return null;

        let bestRow = null;
        let bestScore = Number.POSITIVE_INFINITY;
        for (let y = endY; y >= startY; y -= 1) {
            if (!boundaries[y]) continue;
            const score = density[y - 1] + density[y] + density[y + 1];
            if (score === 0) return y;
            if (score < bestScore) {
                bestScore = score;
                bestRow = y;
            }
        }

        for (let y = endY; y >= startY; y -= 1) {
            if (density[y - 1] === 0 && density[y] === 0 && density[y + 1] === 0) return y;
        }

        if (bestRow !== null) return bestRow;
        return null;
    }

    collectTextRowOccupancy(rootNode, maxY) {
        if (!rootNode) return null;
        const rootRect = rootNode.getBoundingClientRect();
        const maxAllowed = Math.max(256, Math.floor(maxY || rootNode.scrollHeight || 0) + 2);
        const density = new Uint16Array(maxAllowed + 2);
        const boundaries = new Uint8Array(maxAllowed + 2);
        const blockRanges = [];
        const addBlockRange = (rect, options = {}) => {
            if (!rect || rect.width < 4 || rect.height < 6) return;
            const padPx = Number.isFinite(options.padPx) ? Math.max(0, Math.floor(options.padPx)) : 4;
            const maxHeightRatio = Number.isFinite(options.maxHeightRatio) ? options.maxHeightRatio : 0.55;
            const top = Math.max(0, Math.floor(rect.top - rootRect.top) - padPx);
            const bottom = Math.min(maxAllowed, Math.ceil(rect.bottom - rootRect.top) - 1 + padPx);
            if (bottom <= top) return;
            const height = bottom - top + 1;
            if (maxHeightRatio > 0 && height > Math.floor(maxAllowed * maxHeightRatio)) return;
            blockRanges.push({ top, bottom });
        };

        const walker = document.createTreeWalker(
            rootNode,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    if (!node || !node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    const style = window.getComputedStyle(parent);
                    if (style.display === 'none' || style.visibility === 'hidden') return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        while (walker.nextNode()) {
            const textNode = walker.currentNode;
            const range = document.createRange();
            range.selectNodeContents(textNode);
            const rects = Array.from(range.getClientRects());
            rects.forEach((rect) => {
                if (!rect || rect.height < 3 || rect.width < 2) return;
                const top = Math.max(0, Math.floor(rect.top - rootRect.top));
                const bottom = Math.min(maxAllowed, Math.ceil(rect.bottom - rootRect.top) - 1);
                if (bottom < top) return;
                for (let y = top; y <= bottom; y += 1) {
                    density[y] = Math.min(65535, density[y] + 1);
                }
                const cutBefore = Math.max(1, top - 1);
                const cutAfter = Math.min(maxAllowed, bottom + 1);
                boundaries[cutBefore] = 1;
                boundaries[cutAfter] = 1;
            });
            range.detach();
        }

        rootNode.querySelectorAll('[data-edit-block]').forEach((el) => {
            addBlockRange(el.getBoundingClientRect(), { padPx: 6, maxHeightRatio: 0.55 });
        });

        // Garde la section competences (titre + contenu) sur la meme page quand c'est possible.
        const protectedSkillSections = new Set();
        rootNode.querySelectorAll('.pv-skills-grid').forEach((grid) => {
            const section = grid.closest('.pv-r-section');
            if (section) protectedSkillSections.add(section);
        });
        protectedSkillSections.forEach((section) => {
            addBlockRange(section.getBoundingClientRect(), { padPx: 12, maxHeightRatio: 0.92 });
        });

        // Protege aussi les sections de la colonne gauche pour eviter qu elles
        // basculent visuellement sur la page suivante quand la colonne droite se tasse.
        rootNode.querySelectorAll('.pv-l-section').forEach((section) => {
            addBlockRange(section.getBoundingClientRect(), { padPx: 12, maxHeightRatio: 0.42 });
        });

        // Evite surtout les coupures dans les lignes d'experience/education.
        rootNode.querySelectorAll('.pv-exp-item, .pv-edu-li').forEach((el) => {
            addBlockRange(el.getBoundingClientRect(), { padPx: 10, maxHeightRatio: 0.92 });
        });

        return {
            density,
            boundaries,
            blockRanges: this.normalizeBlockRanges(blockRanges),
            sourceHeight: maxAllowed + 1
        };
    }

    scaleTextFlowForCanvas(textFlow, canvasHeight) {
        if (!textFlow || !(textFlow.density instanceof Uint16Array) || !(textFlow.boundaries instanceof Uint8Array)) {
            return null;
        }
        const sourceHeight = Math.max(1, Number(textFlow.sourceHeight || textFlow.density.length - 1));
        const targetHeight = Math.max(1, Math.floor(canvasHeight));
        if (Math.abs(sourceHeight - targetHeight) <= 1) {
            return textFlow;
        }

        const scaledDensity = new Uint16Array(targetHeight + 2);
        const scaledBoundaries = new Uint8Array(targetHeight + 2);
        const scaledBlockRanges = [];
        const ratio = targetHeight / sourceHeight;
        const maxSrc = Math.min(sourceHeight, textFlow.density.length - 1);

        for (let y = 0; y <= maxSrc; y += 1) {
            const mapped = Math.max(0, Math.min(targetHeight + 1, Math.round(y * ratio)));
            if (textFlow.density[y] > 0) {
                scaledDensity[mapped] = Math.min(65535, scaledDensity[mapped] + textFlow.density[y]);
                if (mapped + 1 <= targetHeight + 1) {
                    scaledDensity[mapped + 1] = Math.min(65535, scaledDensity[mapped + 1] + textFlow.density[y]);
                }
            }
            if (textFlow.boundaries[y]) {
                scaledBoundaries[mapped] = 1;
            }
        }

        if (Array.isArray(textFlow.blockRanges) && textFlow.blockRanges.length) {
            textFlow.blockRanges.forEach((range) => {
                if (!Number.isFinite(range?.top) || !Number.isFinite(range?.bottom)) return;
                const top = Math.max(0, Math.min(targetHeight, Math.floor(range.top * ratio) - 6));
                const bottom = Math.max(top + 1, Math.min(targetHeight + 1, Math.ceil(range.bottom * ratio) + 6));
                if (bottom <= top) return;
                scaledBlockRanges.push({ top, bottom });
            });
        }

        return {
            density: scaledDensity,
            boundaries: scaledBoundaries,
            blockRanges: this.normalizeBlockRanges(scaledBlockRanges),
            sourceHeight: targetHeight
        };
    }

    collectEditHotspots(rootNode, maxY) {
        if (!rootNode) return [];
        const rootRect = rootNode.getBoundingClientRect();
        const maxAllowedY = Math.max(0, Math.floor(maxY || rootNode.scrollHeight || 0));
        const seen = new Set();
        const hotspots = [];

        rootNode.querySelectorAll('[data-style-target="1"]').forEach((el) => {
            const styleKey = (el.getAttribute('data-style-key') || '').trim();
            if (!styleKey) return;
            const nearestStep = el.getAttribute('data-edit-step') || el.closest('[data-edit-step]')?.getAttribute('data-edit-step') || '';
            const step = String(nearestStep || '').trim();

            const rect = el.getBoundingClientRect();
            if (!rect || rect.width < 4 || rect.height < 4) return;

            const x = Math.max(0, rect.left - rootRect.left);
            const y = Math.max(0, rect.top - rootRect.top);
            const width = Math.min(rootRect.width - x, rect.width);
            const height = Math.min(maxAllowedY - y, rect.height);
            if (width < 4 || height < 4) return;

            const key = `${styleKey}:${Math.round(x)}:${Math.round(y)}:${Math.round(width)}:${Math.round(height)}`;
            if (seen.has(key)) return;
            seen.add(key);
            hotspots.push({
                step,
                styleKey,
                label: (el.getAttribute('data-style-label') || '').trim(),
                x,
                y,
                width,
                height
            });
        });

        return hotspots;
    }

    appendPageHotspots(layer, options) {
        if (!layer) return;
        const {
            hotspots = [],
            pageStartPx = 0,
            pageEndPx = 0,
            pageCanvasWidthPx = 1,
            pageCanvasHeightPx = 1,
            marginXPx = 0,
            marginYPx = 0,
            drawWidthPx = 1
        } = options || {};
        if (!Array.isArray(hotspots) || !hotspots.length) return;

        const scale = drawWidthPx / pageCanvasWidthPx;
        const maxRight = marginXPx + drawWidthPx;
        const maxBottom = pageCanvasHeightPx - marginYPx;

        hotspots.forEach((spot) => {
            const spotTop = spot.y;
            const spotBottom = spot.y + spot.height;
            if (spotBottom <= pageStartPx || spotTop >= pageEndPx) return;

            const visibleTop = Math.max(spotTop, pageStartPx);
            const visibleBottom = Math.min(spotBottom, pageEndPx);
            const visibleHeight = (visibleBottom - visibleTop) * scale;
            if (visibleHeight < 3) return;

            const leftPx = marginXPx + (spot.x * scale);
            const topPx = marginYPx + ((visibleTop - pageStartPx) * scale);
            const widthPx = spot.width * scale;

            const clampedLeft = Math.max(marginXPx, Math.min(leftPx, maxRight - 4));
            const clampedTop = Math.max(marginYPx, Math.min(topPx, maxBottom - 4));
            const clampedWidth = Math.max(4, Math.min(widthPx, maxRight - clampedLeft));
            const clampedHeight = Math.max(4, Math.min(visibleHeight, maxBottom - clampedTop));
            if (clampedWidth < 4 || clampedHeight < 4) return;

            const zone = document.createElement('div');
            zone.className = 'absolute z-[2] cursor-pointer bg-sky-300/0 transition-colors duration-150 hover:bg-sky-300/20';
            zone.style.left = `${(clampedLeft / pageCanvasWidthPx) * 100}%`;
            zone.style.top = `${(clampedTop / pageCanvasHeightPx) * 100}%`;
            zone.style.width = `${(clampedWidth / pageCanvasWidthPx) * 100}%`;
            zone.style.height = `${(clampedHeight / pageCanvasHeightPx) * 100}%`;
            zone.setAttribute('data-edit-step', spot.step);
            zone.setAttribute('data-style-hotspot', '1');
            if (spot.styleKey) zone.setAttribute('data-style-key', spot.styleKey);
            if (spot.label) zone.setAttribute('title', spot.label);
            const renderedStyle = spot.styleKey ? (this.elementStyleMap[spot.styleKey] || {}) : null;
            zone.dataset.renderedOffsetX = String(Math.round(Number(renderedStyle?.offsetXPx || 0)));
            zone.dataset.renderedOffsetY = String(Math.round(Number(renderedStyle?.offsetYPx || 0)));
            zone.dataset.hotspotScale = String(scale);
            layer.appendChild(zone);
        });
    }

    async renderPaginatedPreview(options = {}) {
        const source = this.querySelector('#pv-preview');
        const host = this.querySelector('[data-preview-pages]');
        if (!source || !host) return;
        const showLoading = Boolean(options?.showLoading);
        const busyMessage = String(options?.busyMessage || '').trim() || 'Generation de la previsualisation paginee...';
        const externalBusyToken = options?.busyToken || null;
        if (!showLoading && !this.isPreviewVisible()) return;
        const renderVersion = this.previewVersion;
        if (renderVersion === this.lastPaginatedPreviewVersion && host.children.length) {
            if (externalBusyToken) {
                this.stopBusyIndicator(externalBusyToken);
            }
            if (!this.busyTokens.size) {
                this.maybeOpenDeferredToolsGuide();
            }
            return;
        }
        const busyToken = externalBusyToken || (showLoading ? this.startBusyIndicator(busyMessage, 0) : null);

        const token = Symbol('pv-pages-render');
        this.pagesRenderToken = token;

        let exportNode = null;
        try {
            await this.ensureRenderDependencies();
            if (this.pagesRenderToken !== token) return;
            if (typeof window.html2canvas !== 'function') return;

            const exportWidth = 794;
            const pageWidthMm = 210;
            const pageHeightMm = 297;
            const marginXmm = 6;
            const marginYmm = 0;
            const contentWidthMm = pageWidthMm - (marginXmm * 2);
            const contentHeightMm = pageHeightMm - (marginYmm * 2);

            exportNode = source.cloneNode(true);
            exportNode.id = 'pv-preview-pages-export';
            exportNode.style.position = 'fixed';
            exportNode.style.left = '-10000px';
            exportNode.style.top = '0';
            exportNode.style.width = `${exportWidth}px`;
            exportNode.style.height = 'auto';
            exportNode.style.transform = 'none';
            exportNode.style.transformOrigin = 'top left';
            exportNode.style.maxWidth = 'none';
            exportNode.style.maxHeight = 'none';
            exportNode.style.pointerEvents = 'none';
            exportNode.style.zIndex = '-1';
            document.body.appendChild(exportNode);
            this.applyStylesToPreviewNode(exportNode);
            this.applyTextAutoFit(exportNode);

            await this.waitForExportAssets(exportNode);
            const contentHeightPx = Math.max(exportNode.scrollHeight, exportNode.offsetHeight, 1);
            exportNode.style.height = `${contentHeightPx}px`;
            const textOccupancy = this.collectTextRowOccupancy(exportNode, contentHeightPx);
            const editHotspots = this.collectEditHotspots(exportNode, contentHeightPx);

            const canvas = await window.html2canvas(exportNode, {
                scale: 1,
                useCORS: true,
                backgroundColor: '#ffffff',
                width: exportWidth,
                height: contentHeightPx,
                windowWidth: exportWidth,
                windowHeight: contentHeightPx,
                scrollX: 0,
                scrollY: 0
            });

            if (exportNode.parentElement) exportNode.parentElement.removeChild(exportNode);
            if (this.pagesRenderToken !== token) return;

            const pageHeightPx = Math.floor((contentHeightMm / contentWidthMm) * canvas.width);
            const pageCanvasHeightPx = Math.round((pageHeightMm / pageWidthMm) * canvas.width);
            const marginXPx = Math.round((marginXmm / pageWidthMm) * canvas.width);
            const marginYPx = Math.round((marginYmm / pageWidthMm) * canvas.width);
            const drawWidthPx = canvas.width - (marginXPx * 2);

            const slices = this.buildPageSlices(canvas, pageHeightPx, textOccupancy);
            const nextPageNodes = [];
            let renderedPx = 0;
            let pageNumber = 1;
            for (const sliceHeightPx of slices) {
                const sliceCanvas = document.createElement('canvas');
                sliceCanvas.width = canvas.width;
                sliceCanvas.height = sliceHeightPx;
                const sliceCtx = sliceCanvas.getContext('2d');
                if (!sliceCtx) break;

                sliceCtx.drawImage(
                    canvas,
                    0,
                    renderedPx,
                    canvas.width,
                    sliceHeightPx,
                    0,
                    0,
                    canvas.width,
                    sliceHeightPx
                );

                const drawHeightPx = Math.round((sliceHeightPx / canvas.width) * drawWidthPx);
                const previewPageHeightPx = sliceHeightPx < pageHeightPx
                    ? Math.max((marginYPx * 2) + drawHeightPx, 1)
                    : pageCanvasHeightPx;

                const pageCanvas = document.createElement('canvas');
                pageCanvas.width = canvas.width;
                pageCanvas.height = previewPageHeightPx;
                const pageCtx = pageCanvas.getContext('2d');
                if (!pageCtx) break;
                pageCtx.fillStyle = '#ffffff';
                pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
                pageCtx.drawImage(sliceCanvas, marginXPx, marginYPx, drawWidthPx, drawHeightPx);

                const pageWrap = document.createElement('div');
                pageWrap.className = 'shrink-0 snap-start flex flex-col items-center gap-1';
                const pageLabel = document.createElement('p');
                pageLabel.className = 'text-[11px] font-semibold uppercase tracking-wide text-slate-500';
                pageLabel.textContent = `Page ${pageNumber}`;
                const pageFrame = document.createElement('div');
                pageFrame.className = 'relative w-[254px] sm:w-[349px] md:w-[476px] lg:w-[635px] xl:w-[794px]';
                const pageImg = document.createElement('img');
                pageImg.src = pageCanvas.toDataURL('image/png', 1.0);
                pageImg.alt = `Previsualisation page ${pageNumber}`;
                pageImg.className = 'h-auto w-full box-border border border-slate-300 bg-white shadow-sm';
                const hotspotLayer = document.createElement('div');
                hotspotLayer.className = 'absolute inset-0 z-[2]';
                this.appendPageHotspots(hotspotLayer, {
                    hotspots: editHotspots,
                    pageStartPx: renderedPx,
                    pageEndPx: renderedPx + sliceHeightPx,
                    pageCanvasWidthPx: pageCanvas.width,
                    pageCanvasHeightPx: pageCanvas.height,
                    marginXPx,
                    marginYPx,
                    drawWidthPx
                });
                pageFrame.appendChild(pageImg);
                pageFrame.appendChild(hotspotLayer);

                pageWrap.appendChild(pageLabel);
                pageWrap.appendChild(pageFrame);
                nextPageNodes.push(pageWrap);

                renderedPx += sliceHeightPx;
                pageNumber += 1;
                if (pageNumber % 2 === 0) {
                    await this.yieldToBrowser();
                    if (this.pagesRenderToken !== token) return;
                }
            }
            if (this.pagesRenderToken !== token) return;
            if (nextPageNodes.length) {
                host.replaceChildren(...nextPageNodes);
                this.lastPaginatedPreviewVersion = renderVersion;
                this.hotspotDomVersion += 1;
                this.activeHotspotNodes = [];
                this.hotspotSelectionState = { selectionSignature: '', domVersion: -1 };
            }
            this.refreshVisibleHotspotSelection({ force: true });
        } catch (error) {
            console.error('Echec rendu pagine:', error);
            if (!host.children.length) {
                host.innerHTML = '<div class="shrink-0 snap-start w-[254px] rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-700 sm:w-[349px] md:w-[476px] lg:w-[635px] xl:w-[794px]">Impossible de generer la previsualisation paginee.</div>';
            }
        } finally {
            if (exportNode && exportNode.parentElement) {
                exportNode.parentElement.removeChild(exportNode);
            }
            if (busyToken) {
                this.stopBusyIndicator(busyToken);
            }
            if (this.pagesRenderToken === token && !this.busyTokens.size) {
                this.maybeOpenDeferredToolsGuide();
            }
        }
    }

    resolveDataWithDefaults() {
        const output = { ...this.defaultData };
        Object.keys(this.defaultData).forEach((key) => {
            const incoming = this.data[key];
            if (Array.isArray(incoming) && incoming.length > 0) {
                output[key] = incoming;
            } else if (typeof incoming === 'string' && incoming.trim().length > 0) {
                output[key] = incoming.trim();
            }
        });
        return output;
    }

    setText(key, value) {
        const el = this.querySelector(`[data-preview="${key}"]`);
        if (el) el.textContent = value || '';
    }

    renderList(listKey, items) {
        const list = this.querySelector(`[data-preview-list="${listKey}"]`);
        if (!list) return;
        list.innerHTML = '';
        const stepByList = {
            interests: 'interests',
            languages: 'languages',
            softwares: 'tools'
        };
        const targetStep = stepByList[listKey] || '';
        items.forEach((item) => {
            const li = document.createElement('li');
            if (listKey === 'interests') {
                li.className = 'pv-l-item mb-2 flex items-center justify-center gap-2 break-words text-[14px] leading-[1.6] opacity-90';
                li.setAttribute('data-autofit', '');
                li.setAttribute('data-autofit-min', '8');
            }
            if (targetStep) {
                li.setAttribute('data-edit-step', targetStep);
                li.setAttribute('data-edit-block', '');
                li.classList.add('cursor-pointer');
            }
            li.textContent = item;
            list.appendChild(li);
        });
    }

    splitToItems(value) {
        if (Array.isArray(value)) {
            return value
                .map((item) => (typeof item === 'string' ? item.trim() : ''))
                .filter(Boolean);
        }
        return (value || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    buildExperienceBullets(data) {
        const raw = (data.exp_description || '').trim();
        const parts = raw
            .split(/\n+/)
            .map((s) => s.trim())
            .filter(Boolean);
        return parts;
    }

    buildExperienceItems(data) {
        if (Array.isArray(data.experiences) && data.experiences.length) {
            const rows = data.experiences
                .map((item) => {
                    if (!item || typeof item !== 'object') return null;
                    const title = (item.title || '').trim();
                    const organization = (item.organization || '').trim();
                    const location = (item.location || '').trim();
                    const startDate = (item.start_date || '').trim();
                    const endDate = (item.end_date || '').trim();
                    const description = (item.description || '').trim();
                    if (!title && !organization && !location && !startDate && !endDate && !description) return null;
                    return {
                        title,
                        organization,
                        location,
                        dates: this.formatDateRange(startDate, endDate),
                        bullets: this.buildBulletsFromText(description)
                    };
                })
                .filter(Boolean);
            if (rows.length) return rows;
        }

        const title = (data.exp_title || '').trim();
        const organization = (data.exp_organization || '').trim();
        const location = (data.exp_location || '').trim();
        const dates = this.formatDateRange(data.exp_start_date, data.exp_end_date);
        const bullets = this.buildExperienceBullets(data);
        if (!title && !organization && !location && !dates && !bullets.length) {
            return [];
        }

        return [{
            title,
            organization,
            location,
            dates,
            bullets
        }];
    }

    buildBulletsFromText(rawText) {
        const parts = (rawText || '')
            .split(/\n+/)
            .map((s) => s.trim())
            .filter(Boolean);
        return parts;
    }

    renderExperienceList(items) {
        const list = this.querySelector('[data-preview-list="exp_bullets"]');
        const role = this.querySelector('[data-preview="exp_title"]');
        const org = this.querySelector('[data-preview="exp_organization"]');
        const loc = this.querySelector('[data-preview="exp_location"]');
        const dates = this.querySelector('[data-preview="exp_dates"]');
        if (!list || !role || !org || !loc || !dates) return;

        const target = role.closest('.pv-exp-content');
        const article = role.closest('.pv-exp-item');
        if (!target || !article) return;

        article.parentElement?.querySelectorAll('.pv-exp-extra').forEach((node) => node.remove());
        list.innerHTML = '';
        const rows = Array.isArray(items) ? items.filter(Boolean) : [];
        const first = rows[0] || null;
        article.classList.toggle('hidden', !first);

        if (!first) {
            role.textContent = '';
            org.textContent = '';
            loc.textContent = '';
            dates.textContent = '';
            return;
        }

        role.textContent = first.title || '';
        org.textContent = first.organization || '';
        loc.textContent = first.location || '';
        dates.textContent = first.dates || '';

        (first.bullets || []).forEach((item) => {
            const li = document.createElement('li');
            li.setAttribute('data-edit-step', 'experiences');
            li.setAttribute('data-edit-block', '');
            li.classList.add('cursor-pointer');
            li.textContent = item;
            list.appendChild(li);
        });

        if (rows.length > 1) {
            rows.slice(1).forEach((item) => {
                const extra = document.createElement('article');
                extra.className = 'pv-exp-item pv-exp-extra mt-3 flex gap-[14px]';
                extra.setAttribute('data-edit-step', 'experiences');
                extra.setAttribute('data-edit-block', '');
                extra.innerHTML = `
                    <div class="pv-exp-date w-[110px] shrink-0 cursor-pointer text-[14px] font-semibold hover:opacity-90" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8">${item.dates || ''}</div>
                    <div class="pv-exp-content flex-1">
                        <p class="pv-exp-role m-0 cursor-pointer break-words text-[14px] font-semibold uppercase hover:opacity-90" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8">${item.title || ''}</p>
                        <p class="pv-exp-company m-0 mt-0.5 cursor-pointer break-words text-[14px] font-medium hover:opacity-90" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8">${[item.organization, item.location].filter(Boolean).join(' - ')}</p>
                        <ul class="pv-exp-list mb-0 mt-2 list-disc pl-[18px] text-[14px] leading-[1.5]" data-edit-step="experiences" data-edit-block data-autofit data-autofit-min="8"></ul>
                    </div>
                `;
                const bulletList = extra.querySelector('.pv-exp-list');
                (item.bullets || []).forEach((bullet) => {
                    const li = document.createElement('li');
                    li.setAttribute('data-edit-step', 'experiences');
                    li.setAttribute('data-edit-block', '');
                    li.classList.add('cursor-pointer');
                    li.textContent = bullet;
                    bulletList.appendChild(li);
                });
                article.parentElement.appendChild(extra);
            });
        }
    }

    buildInterestItems(data, rawData = {}) {
        if (Object.prototype.hasOwnProperty.call(rawData, 'interests')) {
            const explicitItems = this.splitToItems(rawData.interests);
            return explicitItems;
        }
        return this.splitToItems(data.interests);
    }

    buildEducationItems(data) {
        if (Array.isArray(data.educations) && data.educations.length) {
            const rows = data.educations
                .map((item) => {
                    if (!item || typeof item !== 'object') return '';
                    const dates = this.formatDateRange(item.start_date, item.end_date);
                    const degree = (item.degree || '').trim();
                    const school = (item.school || '').trim();
                    const schoolAddress = (item.school_address || '').trim();
                    return { dates, degree, school, schoolAddress };
                })
                .filter((item) => item.degree || item.school || item.schoolAddress || item.dates);
            if (rows.length) return rows;
        }

        return [];
    }

    renderEducationList(items) {
        const list = this.querySelector('[data-preview-list="educations"]');
        if (!list) return;
        list.innerHTML = '';

        if (!items.length) {
            return;
        }

        items.forEach((item) => {
            const li = document.createElement('li');
            li.className = 'pv-edu-li mb-[10px] list-item break-words text-[14px] leading-[1.6]';
            li.setAttribute('data-edit-step', 'educations');
            li.setAttribute('data-edit-block', '');
            li.classList.add('cursor-pointer');
            li.setAttribute('data-autofit', '');
            li.setAttribute('data-autofit-min', '8');

            let hasContent = false;
            if (item.dates) {
                const dates = document.createElement('span');
                dates.className = 'pv-edu-year font-semibold';
                dates.textContent = item.dates;
                li.appendChild(dates);
                hasContent = true;
            }

            if (item.degree) {
                if (hasContent) li.appendChild(document.createTextNode(' - '));
                const degree = document.createElement('span');
                degree.className = 'pv-edu-degree font-semibold';
                degree.textContent = item.degree;
                li.appendChild(degree);
                hasContent = true;
            }

            if (item.school) {
                if (hasContent) li.appendChild(document.createTextNode(' - '));
                li.appendChild(document.createTextNode(item.school));
                hasContent = true;
            }

            if (item.schoolAddress) {
                if (hasContent) li.appendChild(document.createTextNode(' - '));
                li.appendChild(document.createTextNode(item.schoolAddress));
            }

            list.appendChild(li);
        });
    }

    buildLanguageItems(data) {
        if (Array.isArray(data.languages) && data.languages.length) {
            const rows = data.languages
                .map((item) => {
                    if (!item || typeof item !== 'object') return '';
                    const name = (item.name || '').trim();
                    const level = (item.level || '').trim();
                    if (!name) return '';
                    return level ? `${name} - ${level}` : name;
                })
                .filter(Boolean);
            if (rows.length) return rows;
        }

        return [];
    }

    buildSoftwareItems(data) {
        if (Array.isArray(data.tools) && data.tools.length) {
            const rows = data.tools
                .map((item) => {
                    if (!item || typeof item !== 'object') return '';
                    const type = (item.type || '').trim();
                    const name = (item.name || '').trim();
                    const level = (item.level || '').trim();
                    if (!name) return '';
                    return { type, text: `${name}${level ? ` (${level})` : ''}` };
                })
                .filter(Boolean);
            if (rows.length) {
                const selectedType = rows[0].type === 'Materiel' ? 'Materiel' : 'Logiciel';
                const filtered = rows.filter((row) => (row.type || 'Logiciel') === selectedType).map((row) => row.text);
                return {
                    title: selectedType === 'Materiel' ? 'Materiels' : 'Logiciels',
                    items: filtered
                };
            }
        }

        const fromSoftwares = this.splitToItems(data.softwares);
        if (fromSoftwares.length) {
            return {
                title: 'Logiciels',
                items: fromSoftwares
            };
        }

        return {
            title: 'Logiciels',
            items: []
        };
    }

    formatDateRange(start, end) {
        const startVal = start || '';
        const endVal = end || '';
        if (startVal && endVal) return `Debut: ${startVal} | Fin: ${endVal}`;
        if (startVal) return `Debut: ${startVal}`;
        if (endVal) return `Fin: ${endVal}`;
        return '';
    }

    formatPhoneDisplay(data) {
        if (Array.isArray(data.phones) && data.phones.length) {
            return data.phones.join(' / ');
        }
        return data.phoneno || '';
    }

    formatAddressDisplay(data) {
        const line1 = [data.address_number, data.address_street]
            .map((value) => (value || '').trim())
            .filter(Boolean)
            .join(' ');
        const line2 = [data.address_postal, data.address_city]
            .map((value) => (value || '').trim())
            .filter(Boolean)
            .join(' ');
        const country = (data.address_country || '').trim();

        const fromStructured = [line1, line2, country].filter(Boolean).join(', ');
        if (fromStructured) return fromStructured;
        return data.address || '';
    }

    setDownloadLoading(button, loading) {
        if (!button || !(button instanceof HTMLElement)) return;
        if (!button.dataset.defaultHtml) {
            button.dataset.defaultHtml = button.innerHTML;
        }

        button.disabled = loading;
        button.classList.toggle('opacity-70', loading);
        button.classList.toggle('cursor-not-allowed', loading);
        button.innerHTML = loading
            ? '<i class="fa-solid fa-spinner fa-spin"></i>Generation PDF...'
            : (button.dataset.defaultHtml || button.innerHTML);
    }

    async waitForExportAssets(node) {
        if (!node) return;
        const images = Array.from(node.querySelectorAll('img'));
        await Promise.all(images.map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
                const done = () => {
                    img.removeEventListener('load', done);
                    img.removeEventListener('error', done);
                    resolve();
                };
                img.addEventListener('load', done, { once: true });
                img.addEventListener('error', done, { once: true });
            });
        }));

        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }
    }

    async downloadPdf(button) {
        if (this.isDownloading) return;
        const target = this.querySelector('#pv-preview');
        if (!target) return;
        const canDownload = await ensureCvDownloadAccess();
        if (!canDownload) return;

        this.isDownloading = true;
        this.setDownloadLoading(button, true);
        const busyToken = this.startBusyIndicator('Generation du PDF...', 120);

        try {
            await this.renderPaginatedPreview();
            const renderedPagesHost = this.querySelector('[data-preview-pages]');
            const renderedPageImages = Array.from(
                renderedPagesHost?.querySelectorAll('.pv-page-frame > img') || []
            );

            if (this.lastPaginatedPreviewVersion === this.previewVersion && renderedPageImages.length) {
                await Promise.all(renderedPageImages.map((img) => {
                    if (img.complete) return Promise.resolve();
                    return new Promise((resolve) => {
                        const done = () => {
                            img.removeEventListener('load', done);
                            img.removeEventListener('error', done);
                            resolve();
                        };
                        img.addEventListener('load', done, { once: true });
                        img.addEventListener('error', done, { once: true });
                    });
                }));

                await this.ensurePdfDependencies();
                if (!window.jspdf?.jsPDF) return;

                const pdf = new window.jspdf.jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });
                const pageWidthMm = 210;

                renderedPageImages.forEach((pageImg, index) => {
                    const pageSrc = pageImg.currentSrc || pageImg.src;
                    if (!pageSrc) return;
                    if (index > 0) {
                        pdf.addPage();
                    }

                    const naturalWidth = Number(pageImg.naturalWidth || pageImg.width || 794);
                    const naturalHeight = Number(pageImg.naturalHeight || pageImg.height || 1123);
                    const renderHeightMm = (naturalHeight / naturalWidth) * pageWidthMm;
                    pdf.addImage(pageSrc, 'PNG', 0, 0, pageWidthMm, renderHeightMm);
                });

                pdf.save('mon-cv.pdf');
                return;
            }

            await this.ensurePdfDependencies();
            if (typeof window.html2canvas !== 'function' || !window.jspdf?.jsPDF) return;
            const exportWidth = 794;
            const exportNode = target.cloneNode(true);
            exportNode.id = 'pv-preview-export';
            exportNode.style.position = 'fixed';
            exportNode.style.left = '-10000px';
            exportNode.style.top = '0';
            exportNode.style.width = `${exportWidth}px`;
            exportNode.style.height = 'auto';
            exportNode.style.transform = 'none';
            exportNode.style.transformOrigin = 'top left';
            exportNode.style.maxWidth = 'none';
            exportNode.style.maxHeight = 'none';
            exportNode.style.pointerEvents = 'none';
            exportNode.style.zIndex = '-1';
            document.body.appendChild(exportNode);
            this.applyStylesToPreviewNode(exportNode);
            this.applyTextAutoFit(exportNode);

            await this.waitForExportAssets(exportNode);
            const contentHeight = Math.max(exportNode.scrollHeight, exportNode.offsetHeight, 1123);
            exportNode.style.height = `${contentHeight}px`;
            const textOccupancy = this.collectTextRowOccupancy(exportNode, contentHeight);

            const canvas = await window.html2canvas(exportNode, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                width: exportWidth,
                height: contentHeight,
                windowWidth: exportWidth,
                windowHeight: contentHeight,
                scrollX: 0,
                scrollY: 0,
                onclone: (doc) => {
                    const exportRoot = doc.querySelector('#pv-preview-export') || doc.querySelector('#pv-preview');
                    if (exportRoot && exportRoot.style) {
                        exportRoot.style.transform = 'none';
                        exportRoot.style.transformOrigin = 'top left';
                        exportRoot.style.width = `${exportWidth}px`;
                        exportRoot.style.height = `${contentHeight}px`;
                        this.applyStylesToPreviewNode(exportRoot);
                        this.applyTextAutoFit(exportRoot);
                    }
                }
            });

            if (exportNode.parentElement) {
                exportNode.parentElement.removeChild(exportNode);
            }

            const pdf = new window.jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            const marginXmm = 6;
            const marginYmm = 0;
            const pageWidthMm = 210;
            const pageHeightMm = 297;
            const contentWidthMm = pageWidthMm - (marginXmm * 2);
            const contentHeightMm = pageHeightMm - (marginYmm * 2);
            const pageHeightPx = Math.floor((contentHeightMm / contentWidthMm) * canvas.width);
            const slices = this.buildPageSlices(canvas, pageHeightPx, textOccupancy);
            let renderedPx = 0;
            let pageIndex = 0;
            for (const sliceHeightPx of slices) {
                const sliceCanvas = document.createElement('canvas');
                sliceCanvas.width = canvas.width;
                sliceCanvas.height = sliceHeightPx;
                const ctx = sliceCanvas.getContext('2d');
                if (!ctx) throw new Error('Contexte canvas indisponible pour export PDF.');

                ctx.drawImage(
                    canvas,
                    0,
                    renderedPx,
                    canvas.width,
                    sliceHeightPx,
                    0,
                    0,
                    canvas.width,
                    sliceHeightPx
                );

                const pageImage = sliceCanvas.toDataURL('image/png', 1.0);
                if (pageIndex > 0) {
                    pdf.addPage();
                }
                const renderHeightMm = (sliceHeightPx / canvas.width) * contentWidthMm;
                pdf.addImage(pageImage, 'PNG', marginXmm, marginYmm, contentWidthMm, renderHeightMm);

                renderedPx += sliceHeightPx;
                pageIndex += 1;
            }
            pdf.save('mon-cv.pdf');
        } catch (error) {
            console.error('Echec export PDF:', error);
        } finally {
            const staleNode = document.querySelector('#pv-preview-export');
            if (staleNode && staleNode.parentElement) {
                staleNode.parentElement.removeChild(staleNode);
            }
            this.isDownloading = false;
            this.setDownloadLoading(button, false);
            this.stopBusyIndicator(busyToken);
        }
    }

    applyTextAutoFit(preview = null) {
        void preview;
    }

    resetAutoFit(el) {
        if (!el) return;
        if (!el.dataset.baseFontSize) {
            const computed = window.getComputedStyle(el);
            el.dataset.baseFontSize = computed.fontSize;
            el.dataset.baseLineHeight = computed.lineHeight;
        }
        el.style.fontSize = el.dataset.baseFontSize;
        el.style.lineHeight = el.dataset.baseLineHeight;
    }

    shrinkTextStep(el) {
        if (!el) return false;
        const computed = window.getComputedStyle(el);
        const currentSize = parseFloat(computed.fontSize || '0');
        const minSize = parseFloat(el.getAttribute('data-autofit-min') || '8');
        if (!currentSize || currentSize <= minSize) return false;

        const nextSize = Math.max(minSize, currentSize - 0.35);
        if (nextSize >= currentSize) return false;
        el.style.fontSize = `${nextSize}px`;

        const currentLineHeight = parseFloat(computed.lineHeight || '0');
        if (currentLineHeight && Number.isFinite(currentLineHeight)) {
            const ratio = currentLineHeight / currentSize;
            const nextLineHeight = Math.max(nextSize * 1.1, nextSize * ratio);
            el.style.lineHeight = `${nextLineHeight}px`;
        }
        return true;
    }

    fitContainerText(container) {
        if (!container) return;
        const targets = Array.from(container.querySelectorAll('[data-autofit]'));
        if (!targets.length) return;

        let guard = 0;
        while (this.isOverflowing(container) && guard < 60) {
            let changed = false;
            targets.forEach((el) => {
                if (this.shrinkTextStep(el)) changed = true;
            });
            if (!changed) break;
            guard += 1;
        }
    }

    isOverflowing(el) {
        if (!el) return false;
        return el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
    }
}

if (!customElements.get('previsualisation-cv')) {
    customElements.define('previsualisation-cv', PrevisualisationCV);
}
