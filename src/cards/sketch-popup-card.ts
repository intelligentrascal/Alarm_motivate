import { html, css, nothing, LitElement } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { sharedStyles } from '../shared/styles';
import type { HomeAssistant, PopupCardConfig } from '../shared/types';

@customElement('sketch-popup-card')
export class SketchPopupCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: PopupCardConfig;
  @state() private _open = false;
  @state() private _childCards: HTMLElement[] = [];

  private _hashListener = () => this._checkHash();
  private _autoCloseTimer?: number;

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
      /* Card itself takes no space when closed */
      ha-card {
        display: none;
      }

      /* Backdrop overlay */
      .popup-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(42, 42, 42, 0.35);
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
        z-index: 10;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      .popup-backdrop.open {
        opacity: 1;
        pointer-events: auto;
      }

      /* Panel */
      .popup-panel {
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%) translateY(100%);
        z-index: 11;
        background: var(--sketch-bg, #faf7f0);
        border: 2.5px solid var(--sketch-border, #2a2a2a);
        border-bottom: none;
        border-radius: 12px 12px 0 0;
        max-height: 85vh;
        overflow-y: auto;
        scrollbar-width: thin;
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        rotate: 0deg;
        filter: drop-shadow(0px -4px 12px rgba(0, 0, 0, 0.15));
        border-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect x='2' y='2' width='96' height='96' rx='10' fill='none' stroke='%232a2a2a' stroke-width='2.5' stroke-dasharray='8 3 2 3' stroke-linecap='round'/%3E%3C/svg%3E") 12 stretch;
      }
      .popup-panel.open {
        transform: translateX(-50%) translateY(0);
      }

      /* Handle bar */
      .popup-handle {
        width: 40px;
        height: 4px;
        background: var(--sketch-ink-light, #e8e0d0);
        border-radius: 2px;
        margin: 10px auto 4px;
      }

      /* Header */
      .popup-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 20px 10px;
        position: relative;
      }
      .popup-header ha-icon {
        --mdc-icon-size: 24px;
        color: var(--sketch-primary, #4a6fa5);
      }
      .popup-title {
        font-family: var(--sketch-font, 'Caveat', cursive);
        font-size: 1.5em;
        font-weight: 700;
        color: var(--sketch-ink, #2a2a2a);
        flex: 1;
      }
      .popup-close {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 1.5px solid var(--sketch-ink-light, #e8e0d0);
        border-radius: 50%;
        cursor: pointer;
        color: var(--sketch-ink-muted);
        padding: 0;
        transition: background 0.2s;
        flex-shrink: 0;
      }
      .popup-close:hover {
        background: rgba(42, 42, 42, 0.06);
      }
      .popup-close ha-icon {
        --mdc-icon-size: 18px;
        color: var(--sketch-ink-muted);
      }

      /* Underline decoration */
      .popup-header-line {
        border: none;
        margin: 0 20px;
        height: 2px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='4'%3E%3Cpath d='M0 2 Q75 0 150 2 Q225 4 300 2' fill='none' stroke='%23e8e0d0' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }

      /* Content area for child cards */
      .popup-content {
        padding: 12px 16px 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      /* Corner decoration */
      .popup-panel::before,
      .popup-panel::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        border-color: var(--sketch-ink-muted);
        border-style: solid;
        opacity: 0.25;
      }
      .popup-panel::before {
        top: 8px;
        left: 8px;
        border-width: 2px 0 0 2px;
        border-radius: 4px 0 0 0;
      }
      .popup-panel::after {
        top: 8px;
        right: 8px;
        border-width: 2px 2px 0 0;
        border-radius: 0 4px 0 0;
      }
    `,
  ];

  setConfig(config: PopupCardConfig): void {
    if (!config) throw new Error('Invalid configuration');
    if (!config.hash) throw new Error('Please define a hash (e.g. "kitchen")');
    this._config = { ...config };
  }

  static getStubConfig() {
    return {
      hash: 'example',
      name: 'Example Pop-up',
      icon: 'mdi:home',
      cards: [],
    };
  }

  getCardSize() {
    return 0; // Takes no space on dashboard
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', this._hashListener);
    this._checkHash();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this._hashListener);
    this._clearAutoClose();
  }

  private _checkHash() {
    const hash = window.location.hash.replace('#', '');
    const shouldOpen = hash === this._config?.hash;
    if (shouldOpen && !this._open) {
      this._openPopup();
    } else if (!shouldOpen && this._open) {
      this._closePopup();
    }
  }

  private async _openPopup() {
    this._open = true;
    await this._renderChildCards();
    this._startAutoClose();
    document.body.style.overflow = 'hidden';
  }

  private _closePopup() {
    this._open = false;
    this._clearAutoClose();
    document.body.style.overflow = '';
    // Clear hash without triggering hashchange
    if (window.location.hash.replace('#', '') === this._config?.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }

  private _startAutoClose() {
    this._clearAutoClose();
    const timeout = this._config?.auto_close;
    if (timeout && timeout > 0) {
      this._autoCloseTimer = window.setTimeout(() => this._closePopup(), timeout * 1000);
    }
  }

  private _clearAutoClose() {
    if (this._autoCloseTimer) {
      clearTimeout(this._autoCloseTimer);
      this._autoCloseTimer = undefined;
    }
  }

  private async _renderChildCards() {
    if (!this._config?.cards?.length || !this.hass) {
      this._childCards = [];
      return;
    }

    try {
      const helpers = await (window as any).loadCardHelpers();
      const cards: HTMLElement[] = [];

      for (const cardConfig of this._config.cards) {
        try {
          const card = await helpers.createCardElement(cardConfig);
          card.hass = this.hass;
          cards.push(card);
        } catch {
          // If card creation fails, show error placeholder
          const errorCard = document.createElement('div');
          errorCard.textContent = `Error loading card: ${cardConfig.type}`;
          errorCard.style.cssText = 'padding:8px;color:red;font-family:var(--sketch-font)';
          cards.push(errorCard);
        }
      }

      this._childCards = cards;
    } catch {
      // loadCardHelpers not available
      this._childCards = [];
    }
  }

  updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);
    if (changedProps.has('hass') && this._childCards.length > 0) {
      this._childCards.forEach((card: any) => {
        if (card.hass !== undefined) card.hass = this.hass;
      });
    }
  }

  private _handleBackdropClick() {
    this._closePopup();
  }

  render() {
    const width = this._config?.width || '90%';
    const name = this._config?.name;
    const icon = this._config?.icon;

    return html`
      <div
        class="popup-backdrop ${this._open ? 'open' : ''}"
        @click=${this._handleBackdropClick}
      ></div>
      <div
        class="popup-panel ${this._open ? 'open' : ''}"
        style="width: ${width}; max-width: 500px"
        @click=${(e: Event) => e.stopPropagation()}
      >
        <div class="popup-handle"></div>
        ${name || icon
          ? html`
              <div class="popup-header">
                ${icon ? html`<ha-icon .icon=${icon}></ha-icon>` : nothing}
                ${name ? html`<span class="popup-title">${name}</span>` : nothing}
                <button class="popup-close" @click=${this._closePopup}>
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>
              <div class="popup-header-line"></div>
            `
          : html`
              <div style="display:flex;justify-content:flex-end;padding:4px 12px 0">
                <button class="popup-close" @click=${this._closePopup}>
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>
            `}
        <div class="popup-content">
          ${this._childCards.map((card) => card)}
        </div>
      </div>
    `;
  }
}
