import { html, css, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseSketchCard } from '../shared/base-card';
import type { HomeAssistant, PersonCardConfig } from '../shared/types';

@customElement('sketch-person-card')
export class SketchPersonCard extends BaseSketchCard {
  static styles = [
    ...super.styles,
    css`
      .person-row {
        display: flex;
        align-items: center;
        gap: 14px;
        cursor: pointer;
      }
      .person-avatar {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: 2.5px solid var(--sketch-border);
        object-fit: cover;
        flex-shrink: 0;
        rotate: 1deg;
        filter: drop-shadow(2px 3px 0px rgba(0, 0, 0, 0.1));
      }
      .person-avatar-placeholder {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: 2.5px dashed var(--sketch-ink-light);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: var(--sketch-bg);
      }
      .person-avatar-placeholder ha-icon {
        --mdc-icon-size: 28px;
        color: var(--sketch-ink-muted);
      }
      .person-info {
        flex: 1;
        min-width: 0;
      }
      .person-location {
        font-family: var(--sketch-font);
        font-size: 0.95em;
        color: var(--sketch-ink-muted);
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 2px;
      }
      .person-location ha-icon {
        --mdc-icon-size: 14px;
      }
      .person-status {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
      }
      .status-dot.home {
        background: var(--sketch-success);
        box-shadow: 0 0 4px var(--sketch-success);
      }
      .status-dot.away {
        background: var(--sketch-ink-muted);
      }
      .battery-row {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 6px;
      }
      .battery-bar {
        flex: 1;
        height: 6px;
        background: var(--sketch-ink-light);
        border-radius: 3px;
        overflow: hidden;
      }
      .battery-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.3s ease;
      }
      .battery-fill.high { background: var(--sketch-success); }
      .battery-fill.mid { background: var(--sketch-warning); }
      .battery-fill.low { background: var(--sketch-danger); }
      .battery-text {
        font-family: var(--sketch-font);
        font-size: 0.8em;
        color: var(--sketch-ink-muted);
        min-width: 32px;
        text-align: right;
      }
    `,
  ];

  setConfig(config: PersonCardConfig): void {
    if (!config.entity) throw new Error('Please define a person entity');
    super.setConfig(config);
  }

  static getStubConfig(hass: HomeAssistant) {
    const persons = Object.keys(hass.states).filter((e) => e.startsWith('person.'));
    return { entity: persons[0] || 'person.example' };
  }

  getCardSize() {
    return 2;
  }

  private get _personConfig(): PersonCardConfig {
    return this._config as PersonCardConfig;
  }

  render() {
    const entity = this.getEntity();
    if (!entity) {
      return html`<ha-card><div class="sketch-card-content"><p class="sketch-name">Person not found</p></div></ha-card>`;
    }

    const name = this.getName();
    const avatar = entity.attributes.entity_picture;
    const isHome = entity.state === 'home';
    const location = entity.state === 'home' ? 'Home' : entity.state === 'not_home' ? 'Away' : entity.state;
    const showLocation = this._personConfig.show_location !== false;
    const showBattery = this._personConfig.show_battery !== false;
    const batteryEntity = this._personConfig.battery_entity
      ? this.hass.states[this._personConfig.battery_entity]
      : undefined;
    const batteryLevel = batteryEntity ? parseInt(batteryEntity.state) : null;

    let batteryClass = 'high';
    if (batteryLevel !== null) {
      if (batteryLevel < 20) batteryClass = 'low';
      else if (batteryLevel < 50) batteryClass = 'mid';
    }

    const gpsAccuracy = entity.attributes.gps_accuracy;
    const locationIcon = isHome ? 'mdi:home' : 'mdi:map-marker';

    return html`
      <ha-card>
        <div class="sketch-card-content">
          <div class="person-row" @click=${this.handleAction}>
            ${avatar
              ? html`<img class="person-avatar" src="${avatar}" alt="${name}" />`
              : html`
                  <div class="person-avatar-placeholder">
                    <ha-icon icon="mdi:account"></ha-icon>
                  </div>
                `}
            <div class="person-info">
              <p class="sketch-name">${name}</p>
              ${showLocation
                ? html`
                    <div class="person-location">
                      <span class="person-status">
                        <span class="status-dot ${isHome ? 'home' : 'away'}"></span>
                        <ha-icon .icon=${locationIcon}></ha-icon>
                        ${location}
                      </span>
                      ${gpsAccuracy ? html`<span style="font-size:0.8em">(~${gpsAccuracy}m)</span>` : nothing}
                    </div>
                  `
                : nothing}
              ${showBattery && batteryLevel !== null
                ? html`
                    <div class="battery-row">
                      <ha-icon icon="mdi:battery" style="--mdc-icon-size:14px;color:var(--sketch-ink-muted)"></ha-icon>
                      <div class="battery-bar">
                        <div class="battery-fill ${batteryClass}" style="width:${batteryLevel}%"></div>
                      </div>
                      <span class="battery-text">${batteryLevel}%</span>
                    </div>
                  `
                : nothing}
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }
}
