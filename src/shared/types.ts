export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService(domain: string, service: string, data?: Record<string, any>): Promise<void>;
  themes: { darkMode: boolean };
  language: string;
  localize(key: string, ...args: any[]): string;
  formatEntityState(entity: HassEntity): string;
  formatEntityAttributeValue(entity: HassEntity, attribute: string): string;
  connection: {
    subscribeMessage(callback: (msg: any) => void, msg: Record<string, any>): Promise<() => void>;
  };
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
  context: { id: string };
}

export interface CardConfig {
  type: string;
  entity?: string;
  name?: string;
  icon?: string;
  show_name?: boolean;
  show_state?: boolean;
  show_icon?: boolean;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export interface ActionConfig {
  action: 'toggle' | 'call-service' | 'navigate' | 'more-info' | 'none' | 'url';
  service?: string;
  service_data?: Record<string, any>;
  navigation_path?: string;
  url_path?: string;
}

export interface LightCardConfig extends CardConfig {
  show_brightness?: boolean;
  show_color_temp?: boolean;
}

export interface ThermostatCardConfig extends CardConfig {
  show_current_as_primary?: boolean;
}

export interface WeatherCardConfig extends CardConfig {
  show_forecast?: boolean;
  num_forecasts?: number;
}

export interface SensorCardConfig extends CardConfig {
  graph?: boolean;
  hours_to_show?: number;
  detail?: number;
}

export interface MediaPlayerCardConfig extends CardConfig {
  show_artwork?: boolean;
  show_source?: boolean;
}

export interface CoverCardConfig extends CardConfig {
  show_position?: boolean;
  show_tilt?: boolean;
}

export interface AlarmPanelCardConfig extends CardConfig {
  states?: string[];
}

export interface ClockCardConfig {
  type: string;
  name?: string;
  mode?: 'analog' | 'digital' | 'both';
  show_date?: boolean;
  show_seconds?: boolean;
  time_zone?: string;
}

export interface ChipCardConfig {
  type: string;
  chips: ChipConfig[];
}

export interface ChipConfig {
  type: 'entity' | 'action' | 'template';
  entity?: string;
  icon?: string;
  name?: string;
  content?: string;
  tap_action?: ActionConfig;
}

export interface PersonCardConfig extends CardConfig {
  show_location?: boolean;
  show_battery?: boolean;
  battery_entity?: string;
}

export interface TileCardConfig extends CardConfig {
  compact?: boolean;
  hide_icon?: boolean;
}

export interface CameraCardConfig extends CardConfig {
  camera_view?: 'auto' | 'live';
  show_controls?: boolean;
  aspect_ratio?: string;
}

export interface PopupCardConfig {
  type: string;
  hash: string;
  name?: string;
  icon?: string;
  auto_close?: number;
  width?: string;
  cards?: any[];
}

export interface HorizontalButtonsStackConfig {
  type: string;
  buttons: NavButton[];
  style?: 'fixed' | 'inline';
}

export interface NavButton {
  name: string;
  icon: string;
  hash?: string;
  navigation_path?: string;
  entity?: string;
}

export interface SubButtonCardConfig extends CardConfig {
  sub_buttons: SubButton[];
  columns?: number;
  collapsible?: boolean;
}

export interface SubButton {
  entity?: string;
  icon?: string;
  name?: string;
  show_state?: boolean;
  tap_action?: ActionConfig;
}

export interface SeparatorCardConfig {
  type: string;
  name?: string;
  icon?: string;
}
