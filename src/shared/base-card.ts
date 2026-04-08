import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { sharedStyles } from './styles';
import type { HomeAssistant, CardConfig } from './types';

export abstract class BaseSketchCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() protected _config!: CardConfig;

  static styles = [sharedStyles];

  setConfig(config: CardConfig): void {
    if (!config) throw new Error('Invalid configuration');
    this._config = { ...config };
  }

  getCardSize(): number {
    return 3;
  }

  protected getEntity() {
    if (!this._config?.entity || !this.hass) return undefined;
    return this.hass.states[this._config.entity];
  }

  protected getName(): string {
    if (this._config?.name) return this._config.name;
    const entity = this.getEntity();
    return entity?.attributes?.friendly_name || this._config?.entity || '';
  }

  protected getIcon(): string {
    if (this._config?.icon) return this._config.icon;
    const entity = this.getEntity();
    return entity?.attributes?.icon || 'mdi:help-circle-outline';
  }

  protected callService(domain: string, service: string, data?: Record<string, any>): void {
    this.hass.callService(domain, service, data);
  }

  protected toggleEntity(): void {
    if (!this._config?.entity) return;
    const [domain] = this._config.entity.split('.');
    this.callService(domain, 'toggle', { entity_id: this._config.entity });
  }

  protected fireEvent(type: string, detail?: any): void {
    this.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        composed: true,
        detail,
      })
    );
  }

  protected handleAction(): void {
    const action = this._config?.tap_action?.action || 'more-info';
    switch (action) {
      case 'toggle':
        this.toggleEntity();
        break;
      case 'call-service':
        if (this._config.tap_action?.service) {
          const [domain, service] = this._config.tap_action.service.split('.');
          this.callService(domain, service, this._config.tap_action.service_data);
        }
        break;
      case 'navigate':
        if (this._config.tap_action?.navigation_path) {
          window.history.pushState(null, '', this._config.tap_action.navigation_path);
          this.fireEvent('location-changed');
        }
        break;
      case 'more-info':
      default:
        this.fireEvent('hass-more-info', { entityId: this._config?.entity });
        break;
    }
  }
}
