import { html, css, nothing, LitElement, svg } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { sharedStyles } from '../shared/styles';
import type { SeparatorCardConfig } from '../shared/types';

@customElement('sketch-separator-card')
export class SketchSeparatorCard extends LitElement {
  @state() private _config!: SeparatorCardConfig;

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
      .separator-wrap {
        display: flex;
        align-items: center;
        padding: 8px 0;
        gap: 10px;
      }
      .separator-line {
        flex: 1;
        height: 8px;
        overflow: visible;
      }
      .wavy-line {
        stroke: var(--sketch-ink-muted, rgba(42, 42, 42, 0.35));
        stroke-width: 1.8;
        stroke-linecap: round;
        fill: none;
      }
      .separator-label {
        font-family: var(--sketch-font, 'Caveat', cursive);
        font-size: 1em;
        font-weight: 600;
        color: var(--sketch-ink-muted, rgba(42, 42, 42, 0.5));
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
        padding: 0 4px;
        background: var(--sketch-bg, #faf7f0);
      }
      .separator-label ha-icon {
        --mdc-icon-size: 16px;
        color: var(--sketch-ink-muted, rgba(42, 42, 42, 0.5));
      }
    `,
  ];

  setConfig(config: SeparatorCardConfig): void {
    if (!config) throw new Error('Invalid configuration');
    this._config = { ...config };
  }

  static getStubConfig() {
    return { name: 'Section' };
  }

  getCardSize() {
    return 1;
  }

  private _renderWavyLine(width = 200) {
    // Generate a hand-drawn wavy line path
    const h = 4;
    const segments = 12;
    const segW = width / segments;
    let d = `M 0 ${h}`;
    for (let i = 0; i < segments; i++) {
      const x1 = i * segW + segW * 0.3;
      const y1 = h + (i % 2 === 0 ? -2.5 : 2.5) + (Math.sin(i * 1.7) * 0.8);
      const x2 = (i + 1) * segW;
      const y2 = h + (Math.sin((i + 1) * 2.3) * 0.5);
      d += ` Q ${x1} ${y1} ${x2} ${y2}`;
    }

    return svg`
      <svg class="separator-line" viewBox="0 0 ${width} 8" preserveAspectRatio="none">
        <path class="wavy-line" d="${d}" />
      </svg>
    `;
  }

  render() {
    const name = this._config?.name;
    const icon = this._config?.icon;

    if (name || icon) {
      return html`
        <ha-card>
          <div class="separator-wrap">
            ${this._renderWavyLine(200)}
            <span class="separator-label">
              ${icon ? html`<ha-icon .icon=${icon}></ha-icon>` : nothing}
              ${name || ''}
            </span>
            ${this._renderWavyLine(200)}
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="separator-wrap">
          ${this._renderWavyLine(600)}
        </div>
      </ha-card>
    `;
  }
}
