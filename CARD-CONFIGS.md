# Ha-Sketch — Card Configuration Reference

All cards use `type: custom:sketch-*` prefix.

---

## Entity Card
```yaml
type: custom:sketch-entity-card
entity: light.living_room
name: Living Room        # optional, defaults to friendly_name
icon: mdi:lamp           # optional, auto-detected from domain
show_name: true          # optional
show_state: true         # optional
show_icon: true          # optional
tap_action:
  action: more-info      # toggle | call-service | navigate | more-info | none
```

## Button Card
```yaml
type: custom:sketch-button-card
entity: switch.porch_light
name: Porch Light
tap_action:
  action: toggle
```

## Light Card
```yaml
type: custom:sketch-light-card
entity: light.bedroom
show_brightness: true    # default: true (only shown when on)
show_color_temp: true    # default: true (only shown when supported)
```

## Thermostat Card
```yaml
type: custom:sketch-thermostat-card
entity: climate.living_room
name: Living Room
```

## Weather Card
```yaml
type: custom:sketch-weather-card
entity: weather.home
show_forecast: true      # default: true
num_forecasts: 5         # default: 5
```

## Sensor Card
```yaml
type: custom:sketch-sensor-card
entity: sensor.temperature
graph: true              # default: true (sparkline)
```

## Media Player Card
```yaml
type: custom:sketch-media-player-card
entity: media_player.living_room
show_artwork: true       # default: true
show_source: true        # default: true
```

## Cover Card
```yaml
type: custom:sketch-cover-card
entity: cover.garage_door
show_position: true      # default: true (if supported)
show_tilt: true          # default: true (if supported)
```

## Alarm Panel Card
```yaml
type: custom:sketch-alarm-panel-card
entity: alarm_control_panel.home
states:                  # default: [arm_home, arm_away, arm_night]
  - arm_home
  - arm_away
  - arm_night
```

## Clock Card
```yaml
type: custom:sketch-clock-card
mode: both               # analog | digital | both
show_date: true
show_seconds: true
name: My Clock           # optional label above clock
```

## Chip Card
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
  - type: template
    icon: mdi:thermometer
    content: "22°C"      # static text
```

## Person Card
```yaml
type: custom:sketch-person-card
entity: person.john
show_location: true      # default: true
show_battery: true       # default: true
battery_entity: sensor.johns_phone_battery  # optional
```

## Tile Card
```yaml
type: custom:sketch-tile-card
entity: switch.porch_light
hide_icon: false         # default: false
# Toggleable domains get inline switch: light, switch, fan, input_boolean,
# automation, script, cover, lock
# Other domains show state text instead
```

## Camera Card
```yaml
type: custom:sketch-camera-card
entity: camera.front_door
show_controls: true      # default: true (refresh + fullscreen buttons)
```

## Pop-up Card
```yaml
type: custom:sketch-popup-card
hash: kitchen            # REQUIRED — triggers on #kitchen in URL
name: Kitchen            # optional header title
icon: mdi:silverware-fork-knife  # optional header icon
auto_close: 30           # optional — seconds to auto-close (0 = disabled)
width: 90%               # optional — CSS width (max 500px)
cards:                   # child cards rendered inside the popup
  - type: custom:sketch-light-card
    entity: light.kitchen
  - type: custom:sketch-sensor-card
    entity: sensor.kitchen_temperature
  - type: custom:sketch-tile-card
    entity: switch.kitchen_fan
```
**Open popup**: Set `window.location.hash = 'kitchen'` or use chip/button with:
```yaml
tap_action:
  action: navigate
  navigation_path: "#kitchen"
```

## Horizontal Buttons Stack
```yaml
type: custom:sketch-horizontal-buttons-stack
style: fixed             # fixed (sticky footer) | inline (normal card)
buttons:
  - name: Home
    icon: mdi:home
    hash: home            # opens popup with this hash
  - name: Lights
    icon: mdi:lightbulb-group
    hash: lights
  - name: Climate
    icon: mdi:thermostat
    navigation_path: /lovelace/climate  # OR navigates to path
  - name: Security
    icon: mdi:shield-home
    hash: security
    entity: binary_sensor.motion_hallway  # optional: for auto-reorder
```

## Sub-Button Card
```yaml
type: custom:sketch-sub-button-card
entity: light.living_room
collapsible: true        # default: true — tap primary row to expand/collapse
columns: 3               # default: 3 — grid columns for sub-buttons
sub_buttons:
  - entity: light.lamp
    name: Lamp
    show_state: true     # optional — show entity state text
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

## Separator Card
```yaml
type: custom:sketch-separator-card
name: Lighting           # optional — centered label on the line
icon: mdi:lightbulb      # optional — icon before label
# No name/icon = plain wavy line
```

---

## Common Action Config

All cards with `tap_action` support:

```yaml
tap_action:
  action: toggle                    # Toggle entity on/off
  # OR
  action: more-info                 # Open HA more-info dialog (default)
  # OR
  action: call-service
  service: light.turn_on
  service_data:
    entity_id: light.example
    brightness: 255
  # OR
  action: navigate
  navigation_path: /lovelace/1      # Dashboard path or #hash
  # OR
  action: none                      # Disable tap
```
