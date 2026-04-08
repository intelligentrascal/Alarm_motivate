import { html, css, nothing, svg } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseSketchCard } from '../shared/base-card';
import { stateIcon } from '../shared/utils';
import type { HomeAssistant, SensorCardConfig } from '../shared/types';

@customElement('sketch-sensor-card')
export class SketchSensorCard extends BaseSketchCard {
  @state() private _history: number[] = [];

  static styles = [
    ...super.styles,
    css`
      .sensor-header {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        cursor: pointer;
      }
      .sensor-icon-wrap {
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1.5px dashed var(--sketch-ink-light);
        border-radius: 50%;
        flex-shrink: 0;
      }
      .sensor-value-row {
        display: flex;
        align-items: baseline;
        gap: 4px;
      }
      .sensor-graph {
        margin-top: 12px;
        width: 100%;
        height: 50px;
      }
      .spark-line {
        fill: none;
        stroke: var(--sketch-primary);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .spark-area {
        fill: var(--sketch-primary);
        opacity: 0.08;
      }
      .spark-dot {
        fill: var(--sketch-primary);
      }
    `,
  ];

  setConfig(config: SensorCardConfig): void {
    if (!config.entity) throw new Error('Please define a sensor entity');
    super.setConfig(config);
  }

  static getStubConfig(hass: HomeAssistant) {
    const sensors = Object.keys(hass.states).filter((e) => e.startsWith('sensor.'));
    return { entity: sensors[0] || 'sensor.example', graph: true };
  }

  getCardSize() {
    return 3;
  }

  private get _sensorConfig(): SensorCardConfig {
    return this._config as SensorCardConfig;
  }

  connectedCallback() {
    super.connectedCallback();
    this._generateMockHistory();
  }

  private _generateMockHistory() {
    // Generate a plausible sparkline from current state
    const entity = this.getEntity();
    const current = entity ? parseFloat(entity.state) : 20;
    if (isNaN(current)) {
      this._history = [];
      return;
    }
    const points = 24;
    const history: number[] = [];
    let val = current * 0.9;
    for (let i = 0; i < points; i++) {
      val += (Math.random() - 0.45) * (current * 0.08);
      history.push(val);
    }
    history.push(current);
    this._history = history;
  }

  private _renderSparkline() {
    if (this._history.length < 2) return nothing;

    const w = 280;
    const h = 50;
    const padding = 4;
    const min = Math.min(...this._history);
    const max = Math.max(...this._history);
    const range = max - min || 1;

    const points = this._history.map((v, i) => ({
      x: padding + (i / (this._history.length - 1)) * (w - padding * 2),
      y: padding + (1 - (v - min) / range) * (h - padding * 2),
    }));

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${h} L ${points[0].x} ${h} Z`;
    const lastPoint = points[points.length - 1];

    return html`
      <svg class="sensor-graph" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
        <path class="spark-area" d="${areaPath}" />
        <path class="spark-line" d="${linePath}" />
        <circle class="spark-dot" cx="${lastPoint.x}" cy="${lastPoint.y}" r="3" />
      </svg>
    `;
  }

  render() {
    const entity = this.getEntity();
    if (!entity) {
      return html`<ha-card><div class="sketch-card-content"><p class="sketch-name">Sensor not found</p></div></ha-card>`;
    }

    const icon = this._config.icon || stateIcon(entity);
    const unit = entity.attributes.unit_of_measurement || '';
    const showGraph = this._sensorConfig.graph !== false;

    return html`
      <ha-card>
        <div class="sketch-card-content">
          <div class="sensor-header" @click=${this.handleAction}>
            <div class="sensor-icon-wrap">
              <ha-icon class="sketch-icon" .icon=${icon}></ha-icon>
            </div>
            <div class="sketch-col">
              <p class="sketch-name">${this.getName()}</p>
              <div class="sensor-value-row">
                <span class="sketch-value">${entity.state}</span>
                ${unit ? html`<span class="sketch-unit">${unit}</span>` : nothing}
              </div>
            </div>
          </div>
          ${showGraph ? this._renderSparkline() : nothing}
        </div>
      </ha-card>
    `;
  }
}
