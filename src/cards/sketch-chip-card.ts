import { html, css, nothing, LitElement } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { sharedStyles } from '../shared/styles';
import { stateIcon } from '../shared/utils';
import type { HomeAssistant, ChipCardConfig, ChipConfig } from '../shared/types';

@customElement('sketch-chip-card')
export class SketchChipCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: ChipCardConfig;

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }
      ha-card {
        background: transparent;
        border: none;
        border-image: none;
        box-shadow: none;
        filter: none;
        rotate: 0deg;
        overflow: visible;
      }
      ha-card:hover {
        transform: none;
        filter: none;
      }
      .chips-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 4px 0;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: var(--sketch-bg, #faf7f0);
        border: 1.5px solid var(--sketch-border, #2a2a2a);
        border-radius: 20px;
        font-family: var(--sketch-font, 'Caveat', cursive);
        font-size: 0.95em;
        font-weight: 600;
        color: var(--sketch-ink, #2a2a2a);
        cursor: pointer;
        rotate: -0.4deg;
        transition: transform 0.2s ease, filter 0.2s ease;
        white-space: nowrap;
        filter: drop-shadow(2px 3px 0px rgba(0, 0, 0, 0.1));
        border-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='1' y='1' width='58' height='28' rx='14' fill='none' stroke='%232a2a2a' stroke-width='1.5' stroke-dasharray='5 2 1 2' stroke-linecap='round'/%3E%3C/svg%3E") 10 stretch;
      }
      .chip:hover {
        transform: translate(-1px, -1px) rotate(-0.8deg);
        filter: drop-shadow(3px 4px 0px rgba(0, 0, 0, 0.12))
          drop-shadow(4px 6px 6px rgba(0, 0, 0, 0.06));
      }
      .chip:active {
        transform: translate(0, 0);
      }
      .chip ha-icon {
        --mdc-icon-size: 18px;
        color: var(--sketch-primary, #4a6fa5);
      }
      .chip.on ha-icon {
        color: var(--sketch-success, #4caf50);
      }
      .chip-label {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
  ];

  setConfig(config: ChipCardConfig): void {
    if (!config || !config.chips || !Array.isArray(config.chips)) {
      throw new Error('Please define chips array');
    }
    this._config = { ...config };
  }

  static getStubConfig() {
    return {
      chips: [
        { type: 'entity', entity: 'light.living_room' },
        { type: 'action', icon: 'mdi:home', name: 'Home', tap_action: { action: 'navigate', navigation_path: '/' } },
      ],
    };
  }

  getCardSize() {
    return 1;
  }

  private _handleChipTap(chip: ChipConfig) {
    const action = chip.tap_action?.action || (chip.entity ? 'more-info' : 'none');
    switch (action) {
      case 'toggle':
        if (chip.entity) {
          const [domain] = chip.entity.split('.');
          this.hass.callService(domain, 'toggle', { entity_id: chip.entity });
        }
        break;
      case 'more-info':
        if (chip.entity) {
          this.dispatchEvent(
            new CustomEvent('hass-more-info', {
              bubbles: true,
              composed: true,
              detail: { entityId: chip.entity },
            })
          );
        }
        break;
      case 'navigate':
        if (chip.tap_action?.navigation_path) {
          window.history.pushState(null, '', chip.tap_action.navigation_path);
          this.dispatchEvent(new CustomEvent('location-changed', { bubbles: true, composed: true }));
        }
        break;
      case 'call-service':
        if (chip.tap_action?.service) {
          const [domain, service] = chip.tap_action.service.split('.');
          this.hass.callService(domain, service, chip.tap_action.service_data);
        }
        break;
    }
  }

  private _renderChip(chip: ChipConfig) {
    const entity = chip.entity ? this.hass.states[chip.entity] : undefined;
    const icon = chip.icon || (entity ? stateIcon(entity) : 'mdi:circle');
    const isOn = entity && ['on', 'open', 'playing', 'home'].includes(entity.state);
    let label = chip.name;
    if (!label && entity) {
      label = entity.attributes.friendly_name || chip.entity;
    }
    if (chip.type === 'template' && chip.content) {
      label = chip.content;
    }

    return html`
      <div class="chip ${isOn ? 'on' : ''}" @click=${() => this._handleChipTap(chip)}>
        <ha-icon .icon=${icon}></ha-icon>
        ${label ? html`<span class="chip-label">${label}</span>` : nothing}
      </div>
    `;
  }

  render() {
    if (!this._config?.chips) return nothing;

    return html`
      <ha-card>
        <div class="chips-row">
          ${this._config.chips.map((chip) => this._renderChip(chip))}
        </div>
      </ha-card>
    `;
  }
}
