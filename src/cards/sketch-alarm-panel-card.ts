import { html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseSketchCard } from '../shared/base-card';
import { stateIcon } from '../shared/utils';
import type { HomeAssistant, AlarmPanelCardConfig } from '../shared/types';

@customElement('sketch-alarm-panel-card')
export class SketchAlarmPanelCard extends BaseSketchCard {
  @state() private _code = '';

  static styles = [
    ...super.styles,
    css`
      .alarm-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .alarm-icon-wrap {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--sketch-border);
        border-radius: 50%;
        flex-shrink: 0;
      }
      .alarm-icon-wrap.armed {
        border-color: var(--sketch-danger);
        background: rgba(244, 67, 54, 0.1);
      }
      .alarm-icon-wrap.armed ha-icon { color: var(--sketch-danger); }
      .alarm-icon-wrap.disarmed {
        border-color: var(--sketch-success);
        background: rgba(76, 175, 80, 0.1);
      }
      .alarm-icon-wrap.disarmed ha-icon { color: var(--sketch-success); }
      .alarm-icon-wrap.triggered {
        border-color: var(--sketch-danger);
        background: var(--sketch-danger);
        animation: pulse-alarm 0.5s ease-in-out infinite alternate;
      }
      .alarm-icon-wrap.triggered ha-icon { color: #fff; }
      @keyframes pulse-alarm {
        from { opacity: 0.7; }
        to { opacity: 1; }
      }
      .code-display {
        font-family: var(--sketch-font);
        font-size: 1.8em;
        text-align: center;
        letter-spacing: 8px;
        padding: 8px;
        margin: 12px 0 8px;
        min-height: 1.8em;
        border-bottom: 2px dashed var(--sketch-ink-light);
      }
      .keypad {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin: 12px 0;
        max-width: 240px;
        margin-left: auto;
        margin-right: auto;
      }
      .key-btn {
        font-family: var(--sketch-font);
        font-size: 1.4em;
        font-weight: 600;
        padding: 10px;
        background: transparent;
        border: 2px solid var(--sketch-border);
        border-radius: 2px;
        cursor: pointer;
        color: var(--sketch-ink);
        transition: background 0.15s;
        aspect-ratio: 1.5;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .key-btn:hover { background: rgba(42, 42, 42, 0.06); }
      .key-btn:active { background: rgba(42, 42, 42, 0.12); }
      .key-btn.clear {
        font-size: 0.9em;
        color: var(--sketch-ink-muted);
      }
      .action-row {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 8px;
      }
      .arm-btn {
        font-size: 0.85em;
        padding: 8px 12px;
      }
      .arm-btn.disarm {
        border-color: var(--sketch-success);
        color: var(--sketch-success);
      }
      .arm-btn.arm {
        border-color: var(--sketch-danger);
        color: var(--sketch-danger);
      }
    `,
  ];

  setConfig(config: AlarmPanelCardConfig): void {
    if (!config.entity) throw new Error('Please define an alarm_control_panel entity');
    super.setConfig(config);
  }

  static getStubConfig(hass: HomeAssistant) {
    const alarms = Object.keys(hass.states).filter((e) => e.startsWith('alarm_control_panel.'));
    return { entity: alarms[0] || 'alarm_control_panel.example' };
  }

  getCardSize() {
    return 6;
  }

  private get _alarmConfig(): AlarmPanelCardConfig {
    return this._config as AlarmPanelCardConfig;
  }

  private _appendKey(key: string) {
    if (this._code.length < 10) this._code += key;
  }

  private _clearCode() {
    this._code = '';
  }

  private _armAlarm(mode: string) {
    this.callService('alarm_control_panel', `alarm_${mode}`, {
      entity_id: this._config.entity,
      code: this._code || undefined,
    });
    this._code = '';
  }

  render() {
    const entity = this.getEntity();
    if (!entity) {
      return html`<ha-card><div class="sketch-card-content"><p class="sketch-name">Alarm not found</p></div></ha-card>`;
    }

    const alarmState = entity.state;
    const isArmed = alarmState.startsWith('armed');
    const isDisarmed = alarmState === 'disarmed';
    const isTriggered = alarmState === 'triggered';
    const icon = stateIcon(entity);
    const codeRequired = entity.attributes.code_arm_required || entity.attributes.code_format;

    let iconClass = '';
    if (isArmed) iconClass = 'armed';
    else if (isDisarmed) iconClass = 'disarmed';
    else if (isTriggered) iconClass = 'triggered';

    const states = this._alarmConfig.states || ['arm_home', 'arm_away', 'arm_night'];

    return html`
      <ha-card>
        <div class="sketch-card-content">
          <div class="alarm-header">
            <div class="alarm-icon-wrap ${iconClass}">
              <ha-icon class="sketch-icon" .icon=${icon}></ha-icon>
            </div>
            <div class="sketch-col">
              <p class="sketch-name">${this.getName()}</p>
              <p class="sketch-state">${alarmState.replace(/_/g, ' ')}</p>
            </div>
          </div>

          ${codeRequired
            ? html`
                <div class="code-display">${'\u2022'.repeat(this._code.length)}</div>
                <div class="keypad">
                  ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                    (n) => html`<button class="key-btn" @click=${() => this._appendKey(String(n))}>${n}</button>`
                  )}
                  <button class="key-btn clear" @click=${this._clearCode}>CLR</button>
                  <button class="key-btn" @click=${() => this._appendKey('0')}>0</button>
                  <button class="key-btn clear" @click=${() => { this._code = this._code.slice(0, -1); }}>
                    <ha-icon icon="mdi:backspace-outline" style="--mdc-icon-size:20px"></ha-icon>
                  </button>
                </div>
              `
            : nothing}

          <div class="action-row">
            ${isArmed || isTriggered
              ? html`<button class="sketch-btn arm-btn disarm" @click=${() => this._armAlarm('disarm')}>Disarm</button>`
              : nothing}
            ${isDisarmed
              ? states.map(
                  (s: string) => html`
                    <button class="sketch-btn arm-btn arm" @click=${() => this._armAlarm(s)}>
                      ${s.replace('arm_', '').replace(/_/g, ' ')}
                    </button>
                  `
                )
              : nothing}
          </div>
        </div>
      </ha-card>
    `;
  }
}
