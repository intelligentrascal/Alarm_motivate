/* HA Sketchbook Cards - Hand-drawn custom cards for Home Assistant */

import './cards/sketch-entity-card';
import './cards/sketch-button-card';
import './cards/sketch-light-card';
import './cards/sketch-thermostat-card';
import './cards/sketch-weather-card';
import './cards/sketch-sensor-card';
import './cards/sketch-media-player-card';
import './cards/sketch-cover-card';
import './cards/sketch-alarm-panel-card';
import './cards/sketch-clock-card';

declare global {
  interface Window {
    customCards: Array<{ type: string; name: string; description: string; preview?: boolean }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push(
  {
    type: 'sketch-entity-card',
    name: 'Sketch Entity Card',
    description: 'Hand-drawn style entity state display with icon, name, and state badge',
    preview: true,
  },
  {
    type: 'sketch-button-card',
    name: 'Sketch Button Card',
    description: 'Sketchbook-style button for toggling entities or triggering actions',
    preview: true,
  },
  {
    type: 'sketch-light-card',
    name: 'Sketch Light Card',
    description: 'Light control card with brightness slider in hand-drawn aesthetic',
    preview: true,
  },
  {
    type: 'sketch-thermostat-card',
    name: 'Sketch Thermostat Card',
    description: 'Climate control card with temperature display and HVAC mode selection',
    preview: true,
  },
  {
    type: 'sketch-weather-card',
    name: 'Sketch Weather Card',
    description: 'Current weather conditions and forecast in sketchbook style',
    preview: true,
  },
  {
    type: 'sketch-sensor-card',
    name: 'Sketch Sensor Card',
    description: 'Sensor value display with sparkline graph in hand-drawn look',
    preview: true,
  },
  {
    type: 'sketch-media-player-card',
    name: 'Sketch Media Player Card',
    description: 'Media player controls with artwork display in sketch aesthetic',
    preview: true,
  },
  {
    type: 'sketch-cover-card',
    name: 'Sketch Cover Card',
    description: 'Blinds/cover control with position slider in hand-drawn style',
    preview: true,
  },
  {
    type: 'sketch-alarm-panel-card',
    name: 'Sketch Alarm Panel Card',
    description: 'Alarm system keypad with arm/disarm controls in sketchbook design',
    preview: true,
  },
  {
    type: 'sketch-clock-card',
    name: 'Sketch Clock Card',
    description: 'Analog and digital clock with date display (no entity required)',
    preview: true,
  }
);

const VERSION = '1.0.0';
console.info(
  `%c SKETCH-CARDS %c v${VERSION} `,
  'background:#faf7f0;color:#2a2a2a;font-weight:bold;font-family:cursive;padding:2px 6px;border:1px solid #2a2a2a;border-radius:2px;',
  'background:#2a2a2a;color:#faf7f0;font-weight:bold;padding:2px 6px;border-radius:2px;'
);
