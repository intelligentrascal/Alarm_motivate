import { html, css, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseSketchCard } from '../shared/base-card';
import type { HomeAssistant, MediaPlayerCardConfig } from '../shared/types';

@customElement('sketch-media-player-card')
export class SketchMediaPlayerCard extends BaseSketchCard {
  static styles = [
    ...super.styles,
    css`
      .media-layout {
        display: flex;
        gap: 14px;
        align-items: center;
      }
      .media-artwork {
        width: 72px;
        height: 72px;
        border-radius: 2px;
        object-fit: cover;
        border: 2px solid var(--sketch-ink-light);
        flex-shrink: 0;
        rotate: 1deg;
      }
      .media-artwork-placeholder {
        width: 72px;
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px dashed var(--sketch-ink-light);
        border-radius: 2px;
        flex-shrink: 0;
      }
      .media-info {
        flex: 1;
        min-width: 0;
      }
      .media-title {
        font-family: var(--sketch-font);
        font-size: 1.2em;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .media-artist {
        font-family: var(--sketch-font);
        font-size: 0.95em;
        color: var(--sketch-ink-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .media-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 12px;
      }
      .media-ctrl-btn {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 1.5px solid var(--sketch-border);
        border-radius: 50%;
        cursor: pointer;
        color: var(--sketch-ink);
        transition: background 0.2s;
        padding: 0;
      }
      .media-ctrl-btn:hover { background: rgba(42, 42, 42, 0.06); }
      .media-ctrl-btn.play {
        width: 44px;
        height: 44px;
        border-width: 2px;
      }
      .media-ctrl-btn ha-icon { --mdc-icon-size: 20px; }
      .media-ctrl-btn.play ha-icon { --mdc-icon-size: 24px; }
      .volume-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 10px;
      }
      .volume-row ha-icon { --mdc-icon-size: 18px; color: var(--sketch-ink-muted); }
      .media-source {
        font-family: var(--sketch-font);
        font-size: 0.8em;
        color: var(--sketch-ink-muted);
        margin-top: 6px;
        font-style: italic;
      }
    `,
  ];

  setConfig(config: MediaPlayerCardConfig): void {
    if (!config.entity) throw new Error('Please define a media_player entity');
    super.setConfig(config);
  }

  static getStubConfig(hass: HomeAssistant) {
    const players = Object.keys(hass.states).filter((e) => e.startsWith('media_player.'));
    return { entity: players[0] || 'media_player.example' };
  }

  getCardSize() {
    return 4;
  }

  private get _mediaConfig(): MediaPlayerCardConfig {
    return this._config as MediaPlayerCardConfig;
  }

  private _callMediaService(service: string) {
    this.callService('media_player', service, { entity_id: this._config.entity });
  }

  private _setVolume(e: Event) {
    const value = parseFloat((e.target as HTMLInputElement).value);
    this.callService('media_player', 'volume_set', {
      entity_id: this._config.entity,
      volume_level: value / 100,
    });
  }

  render() {
    const entity = this.getEntity();
    if (!entity) {
      return html`<ha-card><div class="sketch-card-content"><p class="sketch-name">Media Player not found</p></div></ha-card>`;
    }

    const title = entity.attributes.media_title || 'Nothing playing';
    const artist = entity.attributes.media_artist || '';
    const artwork = entity.attributes.entity_picture;
    const isPlaying = entity.state === 'playing';
    const volume = Math.round((entity.attributes.volume_level || 0) * 100);
    const showArtwork = this._mediaConfig.show_artwork !== false;
    const showSource = this._mediaConfig.show_source !== false;
    const source = entity.attributes.source;

    return html`
      <ha-card>
        <div class="sketch-card-content">
          <p class="sketch-name">${this.getName()}</p>
          <div class="media-layout">
            ${showArtwork
              ? artwork
                ? html`<img class="media-artwork" src="${artwork}" alt="artwork" />`
                : html`
                    <div class="media-artwork-placeholder">
                      <ha-icon class="sketch-icon" icon="mdi:music-note"></ha-icon>
                    </div>
                  `
              : nothing}
            <div class="media-info">
              <div class="media-title">${title}</div>
              ${artist ? html`<div class="media-artist">${artist}</div>` : nothing}
            </div>
          </div>

          <div class="media-controls">
            <button class="media-ctrl-btn" @click=${() => this._callMediaService('media_previous_track')}>
              <ha-icon icon="mdi:skip-previous"></ha-icon>
            </button>
            <button class="media-ctrl-btn play" @click=${() => this._callMediaService('media_play_pause')}>
              <ha-icon icon=${isPlaying ? 'mdi:pause' : 'mdi:play'}></ha-icon>
            </button>
            <button class="media-ctrl-btn" @click=${() => this._callMediaService('media_next_track')}>
              <ha-icon icon="mdi:skip-next"></ha-icon>
            </button>
          </div>

          <div class="volume-row">
            <ha-icon icon=${volume === 0 ? 'mdi:volume-off' : 'mdi:volume-high'}></ha-icon>
            <input
              type="range"
              class="sketch-slider"
              min="0"
              max="100"
              .value=${String(volume)}
              @change=${this._setVolume}
            />
          </div>

          ${showSource && source
            ? html`<div class="media-source">Source: ${source}</div>`
            : nothing}
        </div>
      </ha-card>
    `;
  }
}
