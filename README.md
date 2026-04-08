# HA Sketchbook Cards

Hand-drawn, sketchbook-style custom cards for Home Assistant dashboards. Inspired by [sketchbook-ui](https://github.com/SarthakRawat-1/sketchbook-ui).

## Cards Included

| Card | Tag | Description |
|------|-----|-------------|
| Entity Card | `sketch-entity-card` | Generic entity state display with icon, name, and state badge |
| Button Card | `sketch-button-card` | Toggle/script/scene activation with tap actions |
| Light Card | `sketch-light-card` | Light on/off with brightness and color temp sliders |
| Thermostat Card | `sketch-thermostat-card` | Climate control with temperature and HVAC mode |
| Weather Card | `sketch-weather-card` | Current conditions and 5-day forecast |
| Sensor Card | `sketch-sensor-card` | Sensor value with sparkline graph |
| Media Player Card | `sketch-media-player-card` | Play/pause/volume with artwork display |
| Cover Card | `sketch-cover-card` | Blinds/cover controls with position slider |
| Alarm Panel Card | `sketch-alarm-panel-card` | Alarm keypad with arm/disarm controls |
| Clock Card | `sketch-clock-card` | Analog/digital clock with date (no entity required) |
| **Chip Card** | `sketch-chip-card` | Compact pills for quick actions and status (mobile top bar) |
| **Person Card** | `sketch-person-card` | Presence card with avatar, location, and device battery |
| **Tile Card** | `sketch-tile-card` | Ultra-compact single-line entity with toggle (mobile-first) |
| **Camera Card** | `sketch-camera-card` | Camera snapshot with refresh and fullscreen controls |
| **Pop-up Card** | `sketch-popup-card` | Hash-triggered slide-up modal for organizing cards |
| **Horizontal Buttons Stack** | `sketch-horizontal-buttons-stack` | Sticky footer nav bar with room buttons |
| **Sub-Button Card** | `sketch-sub-button-card` | Entity card with expandable action button grid |
| **Separator Card** | `sketch-separator-card` | Hand-drawn wavy line divider with optional label |

## Design

All cards feature the sketchbook-ui aesthetic:
- Caveat handwriting font
- Cream paper background (`#faf7f0`)
- Subtle rotation and stacked drop-shadows
- Hand-drawn SVG borders with dashed strokes
- Decorative corner marks
- Smooth hover lift animations
- Respects HA theme variables (`--ha-card-background`, `--primary-text-color`, etc.)

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant
2. Go to **Frontend** > **Custom repositories**
3. Add this repository URL and select **Lovelace** category
4. Click **Install**
5. Refresh your browser

### Manual

1. Download `ha-sketchbook-cards.js` from the [latest release](../../releases/latest)
2. Copy to your `config/www/` directory
3. Add the resource in **Settings > Dashboards > Resources**:
   ```
   URL: /local/ha-sketchbook-cards.js
   Type: JavaScript Module
   ```

## Usage

Add cards to your dashboard via YAML or the visual editor:

### Entity Card
```yaml
type: custom:sketch-entity-card
entity: light.living_room
name: Living Room
icon: mdi:lamp
```

### Button Card
```yaml
type: custom:sketch-button-card
entity: switch.porch_light
name: Porch Light
tap_action:
  action: toggle
```

### Light Card
```yaml
type: custom:sketch-light-card
entity: light.bedroom
show_brightness: true
show_color_temp: true
```

### Thermostat Card
```yaml
type: custom:sketch-thermostat-card
entity: climate.living_room
name: Living Room
```

### Weather Card
```yaml
type: custom:sketch-weather-card
entity: weather.home
show_forecast: true
num_forecasts: 5
```

### Sensor Card
```yaml
type: custom:sketch-sensor-card
entity: sensor.temperature
graph: true
```

### Media Player Card
```yaml
type: custom:sketch-media-player-card
entity: media_player.living_room
show_artwork: true
show_source: true
```

### Cover Card
```yaml
type: custom:sketch-cover-card
entity: cover.garage_door
show_position: true
```

### Alarm Panel Card
```yaml
type: custom:sketch-alarm-panel-card
entity: alarm_control_panel.home
states:
  - arm_home
  - arm_away
  - arm_night
```

### Clock Card
```yaml
type: custom:sketch-clock-card
mode: both
show_date: true
show_seconds: true
name: My Clock
```

### Chip Card (Mobile Top Bar)
```yaml
type: custom:sketch-chip-card
chips:
  - type: entity
    entity: light.living_room
    tap_action:
      action: toggle
  - type: entity
    entity: alarm_control_panel.home
  - type: action
    icon: mdi:home
    name: Home
    tap_action:
      action: navigate
      navigation_path: /lovelace/0
```

### Person Card
```yaml
type: custom:sketch-person-card
entity: person.john
show_location: true
show_battery: true
battery_entity: sensor.johns_phone_battery
```

### Tile Card (Compact)
```yaml
type: custom:sketch-tile-card
entity: switch.porch_light
```

### Camera Card
```yaml
type: custom:sketch-camera-card
entity: camera.front_door
show_controls: true
```

### Pop-up Card (Bubble-style Modal)
```yaml
type: custom:sketch-popup-card
hash: kitchen
name: Kitchen
icon: mdi:silverware-fork-knife
auto_close: 30
cards:
  - type: custom:sketch-light-card
    entity: light.kitchen
  - type: custom:sketch-sensor-card
    entity: sensor.kitchen_temperature
  - type: custom:sketch-tile-card
    entity: switch.kitchen_fan
```
Open with `#kitchen` in URL or via navigate action from any card/chip.

### Horizontal Buttons Stack (Footer Nav)
```yaml
type: custom:sketch-horizontal-buttons-stack
style: fixed
buttons:
  - name: Home
    icon: mdi:home
    hash: home
  - name: Lights
    icon: mdi:lightbulb-group
    hash: lights
  - name: Climate
    icon: mdi:thermostat
    hash: climate
  - name: Security
    icon: mdi:shield-home
    hash: security
  - name: Media
    icon: mdi:speaker
    hash: media
```

### Sub-Button Card (Expandable Actions)
```yaml
type: custom:sketch-sub-button-card
entity: light.living_room
collapsible: true
columns: 3
sub_buttons:
  - entity: light.lamp
    name: Lamp
  - icon: mdi:movie
    name: Movie Mode
    tap_action:
      action: call-service
      service: scene.turn_on
      service_data:
        entity_id: scene.movie
  - icon: mdi:power
    name: All Off
    tap_action:
      action: call-service
      service: light.turn_off
      service_data:
        entity_id: all
```

### Separator Card
```yaml
type: custom:sketch-separator-card
name: Lighting
icon: mdi:lightbulb
```

## Configuration Options

### Common Options (all cards except Clock)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | **required** | Entity ID |
| `name` | string | entity friendly name | Display name |
| `icon` | string | auto-detected | MDI icon override |
| `show_name` | boolean | `true` | Show entity name |
| `show_state` | boolean | `true` | Show entity state |
| `show_icon` | boolean | `true` | Show icon |
| `tap_action` | object | `more-info` | Action on tap |

### Clock Card Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | string | `both` | `analog`, `digital`, or `both` |
| `show_date` | boolean | `true` | Show date below clock |
| `show_seconds` | boolean | `true` | Show seconds hand/digits |
| `name` | string | none | Optional label above clock |

## Development

```bash
npm install
npm run dev    # Watch mode
npm run build  # Production build
```

## License

MIT
