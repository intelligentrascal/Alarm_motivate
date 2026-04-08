import { html, css, nothing, LitElement } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { sharedStyles } from '../shared/styles';
import type { HomeAssistant, HorizontalButtonsStackConfig, NavButton } from '../shared/types';

@customElement('sketch-horizontal-buttons-stack')
export class SketchHorizontalButtonsStack extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: HorizontalButtonsStackConfig;
  @state() private _activeHash = '';

  private _hashListener = () => this._updateActiveHash();

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
      .nav-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 5;
        padding-bottom: env(safe-area-inset-bottom, 0px);
      }
      ha-card {
        rotate: 0deg;
        border-radius: 0;
        filter: none;
        border: none;
        border-image: none;
        border-top: 2px solid var(--sketch-border, #2a2a2a);
        background: var(--sketch-bg, #faf7f0);
      }
      ha-card:hover {
        transform: none;
        filter: none;
      }
      /* Torn paper edge SVG on top border */
      .torn-edge {
        position: absolute;
        top: -8px;
        left: 0;
        right: 0;
        height: 8px;
        overflow: hidden;
      }
      .torn-edge svg {
        width: 100%;
        height: 8px;
      }
      .torn-edge-path {
        fill: var(--sketch-bg, #faf7f0);
        stroke: var(--sketch-border, #2a2a2a);
        stroke-width: 1.5;
      }
      .nav-scroll {
        display: flex;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        gap: 4px;
        padding: 8px 12px 10px;
        position: relative;
      }
      .nav-scroll::-webkit-scrollbar {
        display: none;
      }
      .nav-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 6px 12px;
        min-width: 56px;
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--sketch-ink-muted, rgba(42, 42, 42, 0.5));
        transition: color 0.2s ease, transform 0.15s ease;
        flex-shrink: 0;
        position: relative;
      }
      .nav-btn:active {
        transform: scale(0.95);
      }
      .nav-btn.active {
        color: var(--sketch-ink, #2a2a2a);
      }
      .nav-icon-wrap {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1.5px dashed var(--sketch-ink-light, #e8e0d0);
        border-radius: 50%;
        transition: all 0.2s ease;
      }
      .nav-btn.active .nav-icon-wrap {
        border-style: solid;
        border-color: var(--sketch-primary, #4a6fa5);
        background: var(--sketch-primary, #4a6fa5);
      }
      .nav-btn.active .nav-icon-wrap ha-icon {
        color: #fff;
      }
      .nav-icon-wrap ha-icon {
        --mdc-icon-size: 20px;
      }
      .nav-label {
        font-family: var(--sketch-font, 'Caveat', cursive);
        font-size: 0.75em;
        font-weight: 600;
        white-space: nowrap;
        max-width: 64px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      /* Fade edges for scroll indication */
      .nav-container {
        position: relative;
      }
      .nav-container::before,
      .nav-container::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 20px;
        z-index: 1;
        pointer-events: none;
      }
      .nav-container::before {
        left: 0;
        background: linear-gradient(to right, var(--sketch-bg, #faf7f0), transparent);
      }
      .nav-container::after {
        right: 0;
        background: linear-gradient(to left, var(--sketch-bg, #faf7f0), transparent);
      }
    `,
  ];

  setConfig(config: HorizontalButtonsStackConfig): void {
    if (!config || !config.buttons || !Array.isArray(config.buttons)) {
      throw new Error('Please define buttons array');
    }
    this._config = { ...config };
  }

  static getStubConfig() {
    return {
      style: 'fixed',
      buttons: [
        { name: 'Home', icon: 'mdi:home', hash: 'home' },
        { name: 'Lights', icon: 'mdi:lightbulb-group', hash: 'lights' },
        { name: 'Climate', icon: 'mdi:thermostat', hash: 'climate' },
        { name: 'Security', icon: 'mdi:shield-home', hash: 'security' },
        { name: 'Media', icon: 'mdi:speaker', hash: 'media' },
      ],
    };
  }

  getCardSize() {
    return 1;
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateActiveHash();
    window.addEventListener('hashchange', this._hashListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this._hashListener);
  }

  private _updateActiveHash() {
    this._activeHash = window.location.hash.replace('#', '');
  }

  private _handleButtonTap(btn: NavButton) {
    if (btn.hash) {
      window.location.hash = btn.hash;
    } else if (btn.navigation_path) {
      window.history.pushState(null, '', btn.navigation_path);
      this.dispatchEvent(new CustomEvent('location-changed', { bubbles: true, composed: true }));
    }
  }

  private _getOrderedButtons(): NavButton[] {
    const buttons = [...this._config.buttons];
    if (!this.hass) return buttons;

    // Auto-reorder: buttons with active motion sensors move to front
    return buttons.sort((a, b) => {
      if (!a.entity && !b.entity) return 0;
      const aActive = a.entity && this.hass.states[a.entity]?.state === 'on' ? 1 : 0;
      const bActive = b.entity && this.hass.states[b.entity]?.state === 'on' ? 1 : 0;
      return bActive - aActive;
    });
  }

  render() {
    if (!this._config?.buttons) return nothing;

    const isFixed = this._config.style !== 'inline';
    const buttons = this._getOrderedButtons();

    return html`
      <div class="${isFixed ? 'nav-fixed' : ''}">
        <ha-card>
          <div class="torn-edge">
            <svg viewBox="0 0 400 8" preserveAspectRatio="none">
              <path class="torn-edge-path" d="M0 8 L0 4 Q10 1 20 3 Q30 6 40 2 Q50 0 60 4 Q70 7 80 3 Q90 1 100 5 Q110 7 120 2 Q130 0 140 4 Q150 6 160 2 Q170 1 180 5 Q190 7 200 3 Q210 0 220 4 Q230 6 240 2 Q250 1 260 5 Q270 7 280 3 Q290 0 300 4 Q310 6 320 2 Q330 1 340 5 Q350 7 360 3 Q370 0 380 4 Q390 6 400 3 L400 8 Z" />
            </svg>
          </div>
          <div class="nav-container">
            <div class="nav-scroll">
              ${buttons.map(
                (btn) => html`
                  <button
                    class="nav-btn ${btn.hash === this._activeHash ? 'active' : ''}"
                    @click=${() => this._handleButtonTap(btn)}
                  >
                    <div class="nav-icon-wrap">
                      <ha-icon .icon=${btn.icon}></ha-icon>
                    </div>
                    <span class="nav-label">${btn.name}</span>
                  </button>
                `
              )}
            </div>
          </div>
        </ha-card>
      </div>
    `;
  }
}
