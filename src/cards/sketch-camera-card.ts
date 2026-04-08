import { html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseSketchCard } from '../shared/base-card';
import type { HomeAssistant, CameraCardConfig } from '../shared/types';

@customElement('sketch-camera-card')
export class SketchCameraCard extends BaseSketchCard {
  @state() private _imageUrl = '';
  @state() private _loading = true;
  private _refreshTimer?: number;

  static styles = [
    ...super.styles,
    css`
      .camera-wrap {
        position: relative;
        overflow: hidden;
        border-radius: var(--sketch-radius, 2px);
      }
      .camera-img {
        width: 100%;
        display: block;
        cursor: pointer;
        transition: opacity 0.3s ease;
      }
      .camera-img.loading {
        opacity: 0.5;
      }
      .camera-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 140px;
        background: var(--sketch-ink-light);
        color: var(--sketch-ink-muted);
        flex-direction: column;
        gap: 8px;
      }
      .camera-placeholder ha-icon {
        --mdc-icon-size: 40px;
      }
      .camera-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 8px 12px;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .camera-name {
        font-family: var(--sketch-font);
        font-size: 1.1em;
        font-weight: 600;
        color: #fff;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
      }
      .camera-state {
        font-family: var(--sketch-font);
        font-size: 0.85em;
        color: rgba(255, 255, 255, 0.8);
      }
      .camera-controls {
        display: flex;
        gap: 8px;
        padding: 8px 12px;
        justify-content: center;
      }
      .cam-btn {
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 1.5px solid var(--sketch-border);
        border-radius: 50%;
        cursor: pointer;
        color: var(--sketch-ink);
        padding: 0;
        transition: background 0.2s;
      }
      .cam-btn:hover { background: rgba(42, 42, 42, 0.06); }
      .cam-btn ha-icon { --mdc-icon-size: 18px; }
      .tape-corner {
        position: absolute;
        width: 30px;
        height: 12px;
        background: rgba(255, 235, 180, 0.7);
        border: 1px solid rgba(200, 180, 120, 0.5);
        z-index: 1;
      }
      .tape-corner.tl {
        top: -4px;
        left: 8px;
        rotate: -5deg;
      }
      .tape-corner.tr {
        top: -4px;
        right: 8px;
        rotate: 3deg;
      }
    `,
  ];

  setConfig(config: CameraCardConfig): void {
    if (!config.entity) throw new Error('Please define a camera entity');
    super.setConfig(config);
  }

  static getStubConfig(hass: HomeAssistant) {
    const cameras = Object.keys(hass.states).filter((e) => e.startsWith('camera.'));
    return { entity: cameras[0] || 'camera.example' };
  }

  getCardSize() {
    return 5;
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateImage();
    this._refreshTimer = window.setInterval(() => this._updateImage(), 10000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._refreshTimer) clearInterval(this._refreshTimer);
  }

  private _updateImage() {
    const entity = this.getEntity();
    if (!entity) return;

    const entityPicture = entity.attributes.entity_picture;
    if (entityPicture) {
      this._imageUrl = entityPicture;
      this._loading = false;
    }
  }

  updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);
    if (changedProps.has('hass')) {
      this._updateImage();
    }
  }

  private _handleImageClick() {
    this.fireEvent('hass-more-info', { entityId: this._config.entity });
  }

  private _handleRefresh() {
    this._loading = true;
    this._updateImage();
    setTimeout(() => (this._loading = false), 500);
  }

  render() {
    const entity = this.getEntity();
    if (!entity) {
      return html`<ha-card><div class="sketch-card-content"><p class="sketch-name">Camera not found</p></div></ha-card>`;
    }

    const name = this.getName();
    const showControls = (this._config as CameraCardConfig).show_controls !== false;
    const isIdle = entity.state === 'idle';

    return html`
      <ha-card>
        <div class="camera-wrap">
          <div class="tape-corner tl"></div>
          <div class="tape-corner tr"></div>
          ${this._imageUrl
            ? html`
                <img
                  class="camera-img ${this._loading ? 'loading' : ''}"
                  src="${this._imageUrl}"
                  alt="${name}"
                  @click=${this._handleImageClick}
                  @error=${() => (this._imageUrl = '')}
                />
              `
            : html`
                <div class="camera-placeholder" @click=${this._handleImageClick}>
                  <ha-icon icon="mdi:video-off-outline"></ha-icon>
                  <span style="font-family:var(--sketch-font);font-size:0.9em">${isIdle ? 'Camera idle' : 'No image'}</span>
                </div>
              `}
          <div class="camera-overlay">
            <span class="camera-name">${name}</span>
            <span class="camera-state">${entity.state}</span>
          </div>
        </div>
        ${showControls
          ? html`
              <div class="camera-controls">
                <button class="cam-btn" @click=${this._handleRefresh} title="Refresh">
                  <ha-icon icon="mdi:refresh"></ha-icon>
                </button>
                <button class="cam-btn" @click=${this._handleImageClick} title="Fullscreen">
                  <ha-icon icon="mdi:fullscreen"></ha-icon>
                </button>
              </div>
            `
          : nothing}
      </ha-card>
    `;
  }
}
