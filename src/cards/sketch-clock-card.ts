import { html, css, nothing, svg } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { LitElement } from 'lit';
import { sharedStyles } from '../shared/styles';
import type { ClockCardConfig } from '../shared/types';

@customElement('sketch-clock-card')
export class SketchClockCard extends LitElement {
  @state() private _config!: ClockCardConfig;
  @state() private _time = new Date();
  private _timer?: number;

  static styles = [
    sharedStyles,
    css`
      .clock-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 16px;
      }
      .clock-name {
        font-family: var(--sketch-font);
        font-size: 1em;
        color: var(--sketch-ink-muted);
        margin-bottom: 8px;
      }
      .analog-clock {
        width: 140px;
        height: 140px;
      }
      .clock-face {
        fill: var(--sketch-bg, #faf7f0);
        stroke: var(--sketch-ink, #2a2a2a);
        stroke-width: 2;
        stroke-dasharray: 6 2 1 2;
        stroke-linecap: round;
      }
      .clock-center {
        fill: var(--sketch-ink, #2a2a2a);
      }
      .hour-mark {
        stroke: var(--sketch-ink, #2a2a2a);
        stroke-width: 2;
        stroke-linecap: round;
      }
      .minute-mark {
        stroke: var(--sketch-ink-muted, rgba(42,42,42,0.3));
        stroke-width: 1;
        stroke-linecap: round;
      }
      .hour-hand {
        stroke: var(--sketch-ink, #2a2a2a);
        stroke-width: 3.5;
        stroke-linecap: round;
      }
      .minute-hand {
        stroke: var(--sketch-ink, #2a2a2a);
        stroke-width: 2.5;
        stroke-linecap: round;
      }
      .second-hand {
        stroke: var(--sketch-danger, #f44336);
        stroke-width: 1;
        stroke-linecap: round;
      }
      .digital-time {
        font-family: var(--sketch-font);
        font-size: 2.4em;
        font-weight: 700;
        line-height: 1;
        margin-top: 8px;
      }
      .digital-date {
        font-family: var(--sketch-font);
        font-size: 1em;
        color: var(--sketch-ink-muted);
        margin-top: 4px;
      }
      .clock-number {
        font-family: var(--sketch-font);
        font-size: 11px;
        fill: var(--sketch-ink, #2a2a2a);
        text-anchor: middle;
        dominant-baseline: central;
        font-weight: 600;
      }
    `,
  ];

  setConfig(config: ClockCardConfig): void {
    if (!config) throw new Error('Invalid configuration');
    this._config = { ...config };
  }

  static getStubConfig() {
    return { mode: 'both', show_date: true, show_seconds: true };
  }

  getCardSize() {
    return 4;
  }

  connectedCallback() {
    super.connectedCallback();
    this._tick();
    this._timer = window.setInterval(() => this._tick(), 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._timer) clearInterval(this._timer);
  }

  private _tick() {
    this._time = new Date();
  }

  private _renderAnalog() {
    const h = this._time.getHours() % 12;
    const m = this._time.getMinutes();
    const s = this._time.getSeconds();
    const showSeconds = this._config.show_seconds !== false;

    const hourAngle = (h + m / 60) * 30;
    const minuteAngle = (m + s / 60) * 6;
    const secondAngle = s * 6;

    const cx = 70, cy = 70, r = 60;

    const handEnd = (angle: number, length: number) => {
      const rad = ((angle - 90) * Math.PI) / 180;
      return { x: cx + Math.cos(rad) * length, y: cy + Math.sin(rad) * length };
    };

    const hourEnd = handEnd(hourAngle, 32);
    const minuteEnd = handEnd(minuteAngle, 46);
    const secondEnd = handEnd(secondAngle, 50);

    // Hour marks and numbers
    const marks: any[] = [];
    const numbers: any[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = i * 30;
      const outerR = r - 2;
      const innerR = r - 8;
      const numR = r - 16;
      const rad = ((angle - 90) * Math.PI) / 180;
      marks.push(svg`
        <line
          class="hour-mark"
          x1=${cx + Math.cos(rad) * innerR}
          y1=${cy + Math.sin(rad) * innerR}
          x2=${cx + Math.cos(rad) * outerR}
          y2=${cy + Math.sin(rad) * outerR}
        />
      `);
      numbers.push(svg`
        <text class="clock-number"
          x=${cx + Math.cos(rad) * numR}
          y=${cy + Math.sin(rad) * numR}
        >${i === 0 ? 12 : i}</text>
      `);
    }

    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue;
      const angle = i * 6;
      const rad = ((angle - 90) * Math.PI) / 180;
      marks.push(svg`
        <line
          class="minute-mark"
          x1=${cx + Math.cos(rad) * (r - 2)}
          y1=${cy + Math.sin(rad) * (r - 2)}
          x2=${cx + Math.cos(rad) * (r - 5)}
          y2=${cy + Math.sin(rad) * (r - 5)}
        />
      `);
    }

    return html`
      <svg class="analog-clock" viewBox="0 0 140 140">
        <circle class="clock-face" cx=${cx} cy=${cy} r=${r} />
        ${marks}
        ${numbers}
        <line class="hour-hand" x1=${cx} y1=${cy} x2=${hourEnd.x} y2=${hourEnd.y} />
        <line class="minute-hand" x1=${cx} y1=${cy} x2=${minuteEnd.x} y2=${minuteEnd.y} />
        ${showSeconds
          ? svg`<line class="second-hand" x1=${cx} y1=${cy} x2=${secondEnd.x} y2=${secondEnd.y} />`
          : nothing}
        <circle class="clock-center" cx=${cx} cy=${cy} r="3" />
      </svg>
    `;
  }

  private _renderDigital() {
    const h = this._time.getHours();
    const m = this._time.getMinutes();
    const s = this._time.getSeconds();
    const showSeconds = this._config.show_seconds !== false;
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = showSeconds ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}`;

    return html`<div class="digital-time">${timeStr}</div>`;
  }

  render() {
    const mode = this._config?.mode || 'both';
    const showDate = this._config?.show_date !== false;
    const name = this._config?.name;

    const dateStr = this._time.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return html`
      <ha-card>
        <div class="sketch-card-content clock-content">
          ${name ? html`<div class="clock-name">${name}</div>` : nothing}
          ${mode === 'analog' || mode === 'both' ? this._renderAnalog() : nothing}
          ${mode === 'digital' || mode === 'both' ? this._renderDigital() : nothing}
          ${showDate ? html`<div class="digital-date">${dateStr}</div>` : nothing}
        </div>
      </ha-card>
    `;
  }
}
