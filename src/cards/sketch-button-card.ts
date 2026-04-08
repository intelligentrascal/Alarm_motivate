import { html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseSketchCard } from '../shared/base-card';
import { stateIcon } from '../shared/utils';
import type { HomeAssistant, CardConfig } from '../shared/types';

@customElement('sketch-button-card')
export class SketchButtonCard extends BaseSketchCard {
  @state() private _pressing = false;

  static styles = [
    ...super.styles,
    css`
      .button-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px 16px;
        cursor: pointer;
        user-select: none;
        min-height: 80px;
        transition: transform 0.15s ease;
      }
      .button-wrap.pressing {
        transform: scale(0.96);
      }
      .button-icon-wrap {
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
        border: 2px dashed var(--sketch-ink-light);
        border-radius: 50%;
        transition: background 0.2s ease, border-color 0.2s ease;
      }
      .button-icon-wrap.active {
        background: var(--sketch-primary);
        border-color: var(--sketch-primary);
        border-style: solid;
      }
      .button-icon-wrap.active ha-icon {
        color: #fff;
      }
      .button-label {
        font-family: var(--sketch-font);
        font-size: 1.2em;
        font-weight: 600;
        text-align: center;
      }
      .button-state {
        font-family: var(--sketch-font);
        font-size: 0.9em;
        color: var(--sketch-ink-muted);
        margin-top: 2px;
      }
    `,
  ];

  setConfig(config: CardConfig): void {
    super.setConfig(config);
  }

  static getStubConfig(hass: HomeAssistant) {
    const entities = Object.keys(hass.states).filter((e) => e.startsWith('light.') || e.startsWith('switch.'));
    return { entity: entities[0] || 'light.example', tap_action: { action: 'toggle' } };
  }

  getCardSize() {
    return 3;
  }

  private _handlePress() {
    this._pressing = true;
  }

  private _handleRelease() {
    this._pressing = false;
    this.handleAction();
  }

  render() {
    const entity = this.getEntity();
    const icon = this._config.icon || (entity ? stateIcon(entity) : 'mdi:gesture-tap');
    const name = this.getName() || 'Button';
    const isActive = entity && ['on', 'open', 'playing', 'home'].includes(entity.state);
    const showName = this._config.show_name !== false;
    const showState = this._config.show_state !== false;
    const showIcon = this._config.show_icon !== false;

    return html`
      <ha-card>
        <div
          class="sketch-card-content button-wrap ${this._pressing ? 'pressing' : ''}"
          @mousedown=${this._handlePress}
          @mouseup=${this._handleRelease}
          @mouseleave=${() => (this._pressing = false)}
          @touchstart=${this._handlePress}
          @touchend=${this._handleRelease}
        >
          ${showIcon
            ? html`
                <div class="button-icon-wrap ${isActive ? 'active' : ''}">
                  <ha-icon class="sketch-icon" .icon=${icon}></ha-icon>
                </div>
              `
            : nothing}
          ${showName ? html`<div class="button-label">${name}</div>` : nothing}
          ${showState && entity
            ? html`<div class="button-state">${entity.state}</div>`
            : nothing}
        </div>
      </ha-card>
    `;
  }
}
