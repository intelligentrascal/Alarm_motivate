import { html, css, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseSketchCard } from '../shared/base-card';
import { stateIcon, formatState, timeAgo } from '../shared/utils';
import type { HomeAssistant, CardConfig } from '../shared/types';

@customElement('sketch-entity-card')
export class SketchEntityCard extends BaseSketchCard {
  static styles = [
    ...super.styles,
    css`
      .entity-row {
        display: flex;
        align-items: center;
        gap: 14px;
        cursor: pointer;
      }
      .entity-icon-wrap {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1.5px dashed var(--sketch-ink-light);
        border-radius: 50%;
        flex-shrink: 0;
      }
      .entity-info {
        flex: 1;
        min-width: 0;
      }
      .entity-state-badge {
        text-align: right;
      }
      .last-changed {
        font-family: var(--sketch-font);
        font-size: 0.75em;
        color: var(--sketch-ink-muted);
        margin-top: 2px;
        font-style: italic;
      }
    `,
  ];

  setConfig(config: CardConfig): void {
    if (!config.entity) throw new Error('Please define an entity');
    super.setConfig(config);
  }

  static getStubConfig(hass: HomeAssistant) {
    const entities = Object.keys(hass.states);
    return { entity: entities[0] || 'light.example' };
  }

  getCardSize() {
    return 2;
  }

  render() {
    const entity = this.getEntity();
    if (!entity) {
      return html`<ha-card><div class="sketch-card-content"><p class="sketch-name">Entity not found</p></div></ha-card>`;
    }

    const icon = this._config.icon || stateIcon(entity);
    const name = this.getName();
    const state = formatState(entity);
    const showName = this._config.show_name !== false;
    const showState = this._config.show_state !== false;
    const showIcon = this._config.show_icon !== false;
    const isOn = ['on', 'open', 'playing', 'home', 'unlocked'].includes(entity.state);

    return html`
      <ha-card>
        <div class="sketch-card-content">
          <div class="entity-row" @click=${this.handleAction}>
            ${showIcon
              ? html`
                  <div class="entity-icon-wrap">
                    <ha-icon class="sketch-icon" .icon=${icon}></ha-icon>
                  </div>
                `
              : nothing}
            <div class="entity-info">
              ${showName ? html`<p class="sketch-name">${name}</p>` : nothing}
              <div class="last-changed">${timeAgo(entity.last_changed)}</div>
            </div>
            ${showState
              ? html`
                  <div class="entity-state-badge">
                    <span class="sketch-badge ${isOn ? 'on' : 'off'}">${state}</span>
                  </div>
                `
              : nothing}
          </div>
        </div>
      </ha-card>
    `;
  }
}
