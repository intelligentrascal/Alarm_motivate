import { html, css, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseSketchCard } from '../shared/base-card';
import { stateIcon } from '../shared/utils';
import type { HomeAssistant, LightCardConfig } from '../shared/types';

@customElement('sketch-light-card')
export class SketchLightCard extends BaseSketchCard {
  static styles = [
    ...super.styles,
    css`
      .light-header {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }
      .light-icon-wrap {
        width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px dashed var(--sketch-ink-light);
        border-radius: 50%;
        transition: all 0.3s ease;
      }
      .light-icon-wrap.on {
        background: rgba(255, 193, 7, 0.2);
        border-color: #ffc107;
        border-style: solid;
      }
      .light-icon-wrap.on ha-icon {
        color: #ffc107;
      }
      .light-controls {
        margin-top: 12px;
      }
      .brightness-row {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .brightness-value {
        font-family: var(--sketch-font);
        font-size: 1em;
        min-width: 40px;
        text-align: right;
        color: var(--sketch-ink-muted);
      }
      .color-temp-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 8px;
      }
      .ct-label {
        font-family: var(--sketch-font);
        font-size: 0.85em;
        color: var(--sketch-ink-muted);
        min-width: 20px;
      }
      .ct-slider {
        background: linear-gradient(to right, #ff8a2b, #fff, #90caf9);
      }
    `,
  ];

  setConfig(config: LightCardConfig): void {
    if (!config.entity) throw new Error('Please define a light entity');
    super.setConfig(config);
  }

  static getStubConfig(hass: HomeAssistant) {
    const lights = Object.keys(hass.states).filter((e) => e.startsWith('light.'));
    return { entity: lights[0] || 'light.example' };
  }

  getCardSize() {
    return 3;
  }

  private get _lightConfig(): LightCardConfig {
    return this._config as LightCardConfig;
  }

  private _toggleLight() {
    this.callService('light', 'toggle', { entity_id: this._config.entity });
  }

  private _setBrightness(e: Event) {
    const value = parseInt((e.target as HTMLInputElement).value);
    this.callService('light', 'turn_on', {
      entity_id: this._config.entity,
      brightness: Math.round((value / 100) * 255),
    });
  }

  private _setColorTemp(e: Event) {
    const value = parseInt((e.target as HTMLInputElement).value);
    this.callService('light', 'turn_on', {
      entity_id: this._config.entity,
      color_temp: value,
    });
  }

  render() {
    const entity = this.getEntity();
    if (!entity) {
      return html`<ha-card><div class="sketch-card-content"><p class="sketch-name">Light not found</p></div></ha-card>`;
    }

    const isOn = entity.state === 'on';
    const brightness = entity.attributes.brightness
      ? Math.round((entity.attributes.brightness / 255) * 100)
      : 0;
    const showBrightness = this._lightConfig.show_brightness !== false && isOn;
    const showColorTemp =
      this._lightConfig.show_color_temp !== false &&
      isOn &&
      entity.attributes.min_mireds !== undefined;
    const icon = this._config.icon || stateIcon(entity);

    return html`
      <ha-card>
        <div class="sketch-card-content">
          <div class="light-header" @click=${this._toggleLight}>
            <div class="light-icon-wrap ${isOn ? 'on' : ''}">
              <ha-icon class="sketch-icon" .icon=${icon}></ha-icon>
            </div>
            <div class="sketch-col">
              <p class="sketch-name">${this.getName()}</p>
              <p class="sketch-state">${isOn ? `${brightness}%` : 'Off'}</p>
            </div>
          </div>
          ${showBrightness
            ? html`
                <div class="light-controls">
                  <span class="sketch-label">Brightness</span>
                  <div class="brightness-row">
                    <input
                      type="range"
                      class="sketch-slider"
                      min="1"
                      max="100"
                      .value=${String(brightness)}
                      @change=${this._setBrightness}
                    />
                    <span class="brightness-value">${brightness}%</span>
                  </div>
                </div>
              `
            : nothing}
          ${showColorTemp
            ? html`
                <div class="color-temp-row">
                  <span class="ct-label">&#x2600;</span>
                  <input
                    type="range"
                    class="sketch-slider ct-slider"
                    min=${entity.attributes.min_mireds || 153}
                    max=${entity.attributes.max_mireds || 500}
                    .value=${String(entity.attributes.color_temp || 300)}
                    @change=${this._setColorTemp}
                  />
                  <span class="ct-label">&#x2744;</span>
                </div>
              `
            : nothing}
        </div>
      </ha-card>
    `;
  }
}
