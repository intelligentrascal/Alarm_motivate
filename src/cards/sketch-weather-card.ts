import { html, css, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseSketchCard } from '../shared/base-card';
import { stateIcon } from '../shared/utils';
import type { HomeAssistant, WeatherCardConfig } from '../shared/types';

@customElement('sketch-weather-card')
export class SketchWeatherCard extends BaseSketchCard {
  static styles = [
    ...super.styles,
    css`
      .weather-main {
        display: flex;
        align-items: center;
        gap: 16px;
        cursor: pointer;
      }
      .weather-icon-wrap {
        flex-shrink: 0;
      }
      .weather-icon-wrap ha-icon {
        --mdc-icon-size: 48px;
        color: var(--sketch-primary);
      }
      .weather-temp {
        font-family: var(--sketch-font);
        font-size: 2.6em;
        font-weight: 700;
        line-height: 1;
      }
      .weather-condition {
        font-family: var(--sketch-font);
        font-size: 1em;
        color: var(--sketch-ink-muted);
        text-transform: capitalize;
        margin-top: 2px;
      }
      .weather-details {
        display: flex;
        gap: 16px;
        margin-top: 10px;
        flex-wrap: wrap;
      }
      .weather-detail {
        display: flex;
        align-items: center;
        gap: 4px;
        font-family: var(--sketch-font);
        font-size: 0.9em;
        color: var(--sketch-ink-muted);
      }
      .weather-detail ha-icon {
        --mdc-icon-size: 16px;
      }
      .forecast-row {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
        gap: 4px;
        overflow-x: auto;
      }
      .forecast-day {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        min-width: 48px;
        padding: 4px;
      }
      .forecast-day-name {
        font-family: var(--sketch-font);
        font-size: 0.75em;
        color: var(--sketch-ink-muted);
        font-weight: 600;
      }
      .forecast-day ha-icon {
        --mdc-icon-size: 20px;
        color: var(--sketch-primary);
      }
      .forecast-temps {
        font-family: var(--sketch-font);
        font-size: 0.75em;
      }
      .forecast-high { font-weight: 700; }
      .forecast-low { color: var(--sketch-ink-muted); }
    `,
  ];

  setConfig(config: WeatherCardConfig): void {
    if (!config.entity) throw new Error('Please define a weather entity');
    super.setConfig(config);
  }

  static getStubConfig(hass: HomeAssistant) {
    const weather = Object.keys(hass.states).filter((e) => e.startsWith('weather.'));
    return { entity: weather[0] || 'weather.example' };
  }

  getCardSize() {
    return 4;
  }

  private get _weatherConfig(): WeatherCardConfig {
    return this._config as WeatherCardConfig;
  }

  private _weatherIconName(condition: string): string {
    const map: Record<string, string> = {
      'clear-night': 'mdi:weather-night',
      cloudy: 'mdi:weather-cloudy',
      fog: 'mdi:weather-fog',
      hail: 'mdi:weather-hail',
      lightning: 'mdi:weather-lightning',
      'lightning-rainy': 'mdi:weather-lightning-rainy',
      partlycloudy: 'mdi:weather-partly-cloudy',
      pouring: 'mdi:weather-pouring',
      rainy: 'mdi:weather-rainy',
      snowy: 'mdi:weather-snowy',
      'snowy-rainy': 'mdi:weather-snowy-rainy',
      sunny: 'mdi:weather-sunny',
      windy: 'mdi:weather-windy',
      'windy-variant': 'mdi:weather-windy-variant',
      exceptional: 'mdi:alert-circle-outline',
    };
    return map[condition] || 'mdi:weather-cloudy';
  }

  render() {
    const entity = this.getEntity();
    if (!entity) {
      return html`<ha-card><div class="sketch-card-content"><p class="sketch-name">Weather not found</p></div></ha-card>`;
    }

    const temp = entity.attributes.temperature ?? '--';
    const unit = entity.attributes.temperature_unit || '\u00b0';
    const condition = entity.state;
    const humidity = entity.attributes.humidity;
    const wind = entity.attributes.wind_speed;
    const windUnit = entity.attributes.wind_speed_unit || 'km/h';
    const pressure = entity.attributes.pressure;
    const forecast = entity.attributes.forecast || [];
    const showForecast = this._weatherConfig.show_forecast !== false;
    const numForecasts = this._weatherConfig.num_forecasts || 5;

    return html`
      <ha-card>
        <div class="sketch-card-content">
          <div class="weather-main" @click=${this.handleAction}>
            <div class="weather-icon-wrap">
              <ha-icon .icon=${this._weatherIconName(condition)}></ha-icon>
            </div>
            <div>
              <div class="weather-temp">${temp}${unit}</div>
              <div class="weather-condition">${condition.replace(/-/g, ' ')}</div>
            </div>
          </div>

          <div class="weather-details">
            ${humidity != null
              ? html`<div class="weather-detail"><ha-icon icon="mdi:water-percent"></ha-icon>${humidity}%</div>`
              : nothing}
            ${wind != null
              ? html`<div class="weather-detail"><ha-icon icon="mdi:weather-windy"></ha-icon>${wind} ${windUnit}</div>`
              : nothing}
            ${pressure != null
              ? html`<div class="weather-detail"><ha-icon icon="mdi:gauge"></ha-icon>${pressure} hPa</div>`
              : nothing}
          </div>

          ${showForecast && forecast.length > 0
            ? html`
                <hr class="sketch-divider" />
                <div class="forecast-row">
                  ${forecast.slice(0, numForecasts).map(
                    (day: any) => html`
                      <div class="forecast-day">
                        <span class="forecast-day-name">
                          ${new Date(day.datetime).toLocaleDateString(undefined, { weekday: 'short' })}
                        </span>
                        <ha-icon .icon=${this._weatherIconName(day.condition)}></ha-icon>
                        <div class="forecast-temps">
                          <span class="forecast-high">${day.temperature}\u00b0</span>
                          ${day.templow != null
                            ? html`<span class="forecast-low"> ${day.templow}\u00b0</span>`
                            : nothing}
                        </div>
                      </div>
                    `
                  )}
                </div>
              `
            : nothing}
        </div>
      </ha-card>
    `;
  }
}
