import type { HassEntity } from './types';

export function stateIcon(entity: HassEntity): string {
  if (entity.attributes.icon) return entity.attributes.icon;
  const domain = entity.entity_id.split('.')[0];
  const state = entity.state;

  const iconMap: Record<string, string> = {
    light: state === 'on' ? 'mdi:lightbulb' : 'mdi:lightbulb-outline',
    switch: state === 'on' ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off',
    fan: 'mdi:fan',
    climate: 'mdi:thermostat',
    weather: weatherIcon(state),
    sensor: sensorIcon(entity),
    binary_sensor: state === 'on' ? 'mdi:checkbox-marked-circle' : 'mdi:checkbox-blank-circle-outline',
    cover: state === 'open' ? 'mdi:window-open' : 'mdi:window-closed',
    lock: state === 'locked' ? 'mdi:lock' : 'mdi:lock-open',
    media_player: state === 'playing' ? 'mdi:play-circle' : 'mdi:play-circle-outline',
    alarm_control_panel: alarmIcon(state),
    camera: 'mdi:video',
    automation: 'mdi:robot',
    script: 'mdi:script-text',
    scene: 'mdi:palette',
    input_boolean: state === 'on' ? 'mdi:check-circle' : 'mdi:close-circle',
    person: 'mdi:account',
    device_tracker: 'mdi:crosshairs-gps',
    vacuum: 'mdi:robot-vacuum',
    input_number: 'mdi:ray-vertex',
    input_select: 'mdi:format-list-bulleted',
    timer: 'mdi:timer-outline',
    counter: 'mdi:counter',
    sun: state === 'above_horizon' ? 'mdi:white-balance-sunny' : 'mdi:weather-night',
  };

  return iconMap[domain] || 'mdi:help-circle-outline';
}

function weatherIcon(state: string): string {
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
  return map[state] || 'mdi:weather-cloudy';
}

function sensorIcon(entity: HassEntity): string {
  const dc = entity.attributes.device_class;
  const map: Record<string, string> = {
    temperature: 'mdi:thermometer',
    humidity: 'mdi:water-percent',
    pressure: 'mdi:gauge',
    power: 'mdi:flash',
    energy: 'mdi:lightning-bolt',
    battery: 'mdi:battery',
    illuminance: 'mdi:brightness-6',
    carbon_dioxide: 'mdi:molecule-co2',
    carbon_monoxide: 'mdi:molecule-co',
    gas: 'mdi:gas-cylinder',
    moisture: 'mdi:water',
    signal_strength: 'mdi:wifi',
    voltage: 'mdi:sine-wave',
    current: 'mdi:current-ac',
  };
  return map[dc] || 'mdi:eye';
}

function alarmIcon(state: string): string {
  const map: Record<string, string> = {
    armed_home: 'mdi:shield-home',
    armed_away: 'mdi:shield-lock',
    armed_night: 'mdi:shield-moon',
    armed_vacation: 'mdi:shield-airplane',
    armed_custom_bypass: 'mdi:shield-star',
    disarmed: 'mdi:shield-off',
    triggered: 'mdi:bell-ring',
    pending: 'mdi:shield-alert',
    arming: 'mdi:shield-outline',
  };
  return map[state] || 'mdi:shield';
}

export function formatState(entity: HassEntity): string {
  const state = entity.state;
  const unit = entity.attributes.unit_of_measurement;
  if (unit) return `${state} ${unit}`;
  return state;
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
