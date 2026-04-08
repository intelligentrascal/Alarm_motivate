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
import './cards/sketch-chip-card';
import './cards/sketch-person-card';
import './cards/sketch-tile-card';
import './cards/sketch-camera-card';
import './cards/sketch-popup-card';
import './cards/sketch-horizontal-buttons-stack';
import './cards/sketch-sub-button-card';
import './cards/sketch-separator-card';

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
  },
  {
    type: 'sketch-chip-card',
    name: 'Sketch Chip Card',
    description: 'Compact pills for quick actions, scene triggers, and status indicators',
    preview: true,
  },
  {
    type: 'sketch-person-card',
    name: 'Sketch Person Card',
    description: 'Person presence card with avatar, location, and device battery',
    preview: true,
  },
  {
    type: 'sketch-tile-card',
    name: 'Sketch Tile Card',
    description: 'Ultra-compact single-line entity row with toggle for maximum density',
    preview: true,
  },
  {
    type: 'sketch-camera-card',
    name: 'Sketch Camera Card',
    description: 'Camera snapshot display with refresh and fullscreen controls',
    preview: true,
  },
  {
    type: 'sketch-popup-card',
    name: 'Sketch Pop-up Card',
    description: 'Hash-triggered modal overlay for organizing cards in slide-up panels',
    preview: false,
  },
  {
    type: 'sketch-horizontal-buttons-stack',
    name: 'Sketch Horizontal Buttons Stack',
    description: 'Sticky footer navigation bar with scrollable room/view buttons',
    preview: true,
  },
  {
    type: 'sketch-sub-button-card',
    name: 'Sketch Sub-Button Card',
    description: 'Entity card with expandable secondary action button grid',
    preview: true,
  },
  {
    type: 'sketch-separator-card',
    name: 'Sketch Separator Card',
    description: 'Hand-drawn wavy line divider with optional label for organizing cards',
    preview: true,
  }
);

const VERSION = '1.2.0';
console.info(
  `%c SKETCH-CARDS %c v${VERSION} `,
  'background:#faf7f0;color:#2a2a2a;font-weight:bold;font-family:cursive;padding:2px 6px;border:1px solid #2a2a2a;border-radius:2px;',
  'background:#2a2a2a;color:#faf7f0;font-weight:bold;padding:2px 6px;border-radius:2px;'
);
