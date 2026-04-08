import { html, css, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseSketchCard } from '../shared/base-card';
import { stateIcon, formatState } from '../shared/utils';
import type { HomeAssistant, TileCardConfig } from '../shared/types';

@customElement('sketch-tile-card')
export class SketchTileCard extends BaseSketchCard {
  static styles = [
    ...super.styles,
    css`
      ha-card {
        rotate: -0.3deg;
      }
      .tile-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        cursor: pointer;
        min-height: 36px;
      }
      .tile-icon {
        --mdc-icon-size: 22px;
        color: var(--sketch-primary);
        flex-shrink: 0;
      }
      .tile-icon.on {
        color: var(--sketch-success);
      }
      .tile-icon.off {
        color: var(--sketch-ink-muted);
      }
      .tile-name {
        font-family: var(--sketch-font);
        font-size: 1.05em;
        font-weight: 600;
        flex: 1;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .tile-state {
        font-family: var(--sketch-font);
        font-size: 0.95em;
        color: var(--sketch-ink-muted);
        white-space: nowrap;
        flex-shrink: 0;
      }
      .tile-toggle {
        width: 38px;
        height: 20px;
        border-radius: 10px;
        border: 1.5px solid var(--sketch-border);
        background: var(--sketch-ink-light);
        position: relative;
        cursor: pointer;
        flex-shrink: 0;
        transition: background 0.2s ease;
      }
      .tile-toggle.on {
        background: var(--sketch-primary);
        border-color: var(--sketch-primary);
      }
      .tile-toggle-knob {
        position: absolute;
        top: 1px;
        left: 1px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #fff;
        border: 1px solid var(--sketch-ink-light);
        transition: left 0.2s ease;
      }
      .tile-toggle.on .tile-toggle-knob {
        left: 17px;
        border-color: var(--sketch-primary);
      }
    `,
  ];

  setConfig(config: TileCardConfig): void {
    if (!config.entity) throw new Error('Please define an entity');
    super.setConfig(config);
  }

  static getStubConfig(hass: HomeAssistant) {
    const entities = Object.keys(hass.states);
    return { entity: entities[0] || 'light.example' };
  }

  getCardSize() {
    return 1;
  }

  private get _tileConfig(): TileCardConfig {
    return this._config as TileCardConfig;
  }

  private _isToggleable(): boolean {
    if (!this._config?.entity) return false;
    const domain = this._config.entity.split('.')[0];
    return ['light', 'switch', 'fan', 'input_boolean', 'automation', 'script', 'cover', 'lock'].includes(domain);
  }

  private _handleToggle(e: Event) {
    e.stopPropagation();
    this.toggleEntity();
  }

  render() {
    const entity = this.getEntity();
    if (!entity) {
      return html`<ha-card><div class="tile-row"><span class="tile-name">Not found</span></div></ha-card>`;
    }

    const icon = this._config.icon || stateIcon(entity);
    const name = this.getName();
    const state = formatState(entity);
    const isOn = ['on', 'open', 'playing', 'home', 'unlocked'].includes(entity.state);
    const showIcon = this._tileConfig.hide_icon !== true;
    const toggleable = this._isToggleable();

    return html`
      <ha-card>
        <div class="tile-row" @click=${this.handleAction}>
          ${showIcon
            ? html`<ha-icon class="tile-icon ${isOn ? 'on' : 'off'}" .icon=${icon}></ha-icon>`
            : nothing}
          <span class="tile-name">${name}</span>
          ${toggleable
            ? html`
                <div class="tile-toggle ${isOn ? 'on' : ''}" @click=${this._handleToggle}>
                  <div class="tile-toggle-knob"></div>
                </div>
              `
            : html`<span class="tile-state">${state}</span>`}
        </div>
      </ha-card>
    `;
  }
}
