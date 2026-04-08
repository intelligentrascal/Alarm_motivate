import { css } from 'lit';

export const sharedStyles = css`
  :host {
    --sketch-bg: var(--ha-card-background, #faf7f0);
    --sketch-ink: var(--primary-text-color, #2a2a2a);
    --sketch-ink-muted: var(--secondary-text-color, rgba(42, 42, 42, 0.5));
    --sketch-ink-light: #e8e0d0;
    --sketch-primary: var(--primary-color, #4a6fa5);
    --sketch-success: #4caf50;
    --sketch-warning: #ff9800;
    --sketch-danger: #f44336;
    --sketch-border: var(--divider-color, #2a2a2a);
    --sketch-font: 'Caveat', cursive;
    --sketch-font-body: 'Patrick Hand', 'Caveat', cursive, var(--paper-font-body1_-_font-family, sans-serif);
    --sketch-radius: 2px;
    --sketch-shadow: drop-shadow(3px 4px 0px rgba(0, 0, 0, 0.12))
      drop-shadow(5px 7px 8px rgba(0, 0, 0, 0.08));
    --sketch-shadow-hover: drop-shadow(4px 5px 0px rgba(0, 0, 0, 0.15))
      drop-shadow(6px 8px 10px rgba(0, 0, 0, 0.1));

    display: block;
    font-family: var(--sketch-font-body);
  }

  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap');

  ha-card {
    background: var(--sketch-bg);
    color: var(--sketch-ink);
    border-radius: var(--sketch-radius);
    rotate: -0.5deg;
    filter: var(--sketch-shadow);
    transition: transform 0.3s ease, filter 0.3s ease;
    overflow: visible;
    border: 2px solid var(--sketch-border);
    border-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect x='2' y='2' width='96' height='96' fill='none' stroke='%232a2a2a' stroke-width='2' stroke-dasharray='8 3 2 3' stroke-linecap='round'/%3E%3C/svg%3E") 10 stretch;
    position: relative;
  }

  ha-card:hover {
    transform: translate(-1px, -1px) rotate(-0.8deg);
    filter: var(--sketch-shadow-hover);
  }

  .sketch-card-content {
    padding: 16px;
    position: relative;
  }

  /* Sketch decorative corner marks */
  .sketch-card-content::before,
  .sketch-card-content::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border-color: var(--sketch-ink-muted);
    border-style: solid;
    opacity: 0.3;
  }
  .sketch-card-content::before {
    top: 4px;
    left: 4px;
    border-width: 2px 0 0 2px;
  }
  .sketch-card-content::after {
    bottom: 4px;
    right: 4px;
    border-width: 0 2px 2px 0;
  }

  .sketch-name {
    font-family: var(--sketch-font);
    font-size: 1.4em;
    font-weight: 600;
    color: var(--sketch-ink);
    margin: 0;
    line-height: 1.2;
  }

  .sketch-state {
    font-family: var(--sketch-font);
    font-size: 1.1em;
    color: var(--sketch-ink-muted);
    margin: 4px 0 0;
  }

  .sketch-icon {
    --mdc-icon-size: 28px;
    color: var(--sketch-primary);
  }

  .sketch-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sketch-col {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .sketch-btn {
    font-family: var(--sketch-font);
    font-size: 1em;
    background: transparent;
    border: 2px solid var(--sketch-border);
    border-radius: var(--sketch-radius);
    color: var(--sketch-ink);
    padding: 6px 14px;
    cursor: pointer;
    rotate: -0.3deg;
    transition: transform 0.2s ease, background 0.2s ease;
    border-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='1' y='1' width='58' height='28' fill='none' stroke='%232a2a2a' stroke-width='1.5' stroke-dasharray='6 2 1 2' stroke-linecap='round'/%3E%3C/svg%3E") 6 stretch;
  }

  .sketch-btn:hover {
    background: rgba(42, 42, 42, 0.06);
    transform: translate(-1px, -1px);
  }

  .sketch-btn:active {
    transform: translate(0, 0);
  }

  .sketch-btn.active {
    background: var(--sketch-primary);
    color: #fff;
    border-color: var(--sketch-primary);
  }

  .sketch-slider-container {
    width: 100%;
    margin: 8px 0;
  }

  .sketch-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    background: var(--sketch-ink-light);
    border-radius: 2px;
    outline: none;
  }

  .sketch-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: var(--sketch-primary);
    border: 2px solid var(--sketch-ink);
    border-radius: 50%;
    cursor: pointer;
  }

  .sketch-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: var(--sketch-primary);
    border: 2px solid var(--sketch-ink);
    border-radius: 50%;
    cursor: pointer;
  }

  .sketch-label {
    font-family: var(--sketch-font);
    font-size: 0.9em;
    color: var(--sketch-ink-muted);
    display: block;
    margin-bottom: 4px;
  }

  .sketch-value {
    font-family: var(--sketch-font);
    font-size: 2em;
    font-weight: 700;
    color: var(--sketch-ink);
    line-height: 1;
  }

  .sketch-unit {
    font-size: 0.5em;
    font-weight: 400;
    color: var(--sketch-ink-muted);
    margin-left: 2px;
  }

  .sketch-divider {
    border: none;
    border-top: 1.5px dashed var(--sketch-ink-light);
    margin: 10px 0;
    opacity: 0.6;
  }

  .sketch-grid {
    display: grid;
    gap: 8px;
  }

  .sketch-badge {
    display: inline-block;
    font-family: var(--sketch-font);
    font-size: 0.8em;
    padding: 2px 8px;
    border: 1.5px solid var(--sketch-border);
    border-radius: 2px;
    rotate: -0.5deg;
  }

  .sketch-badge.on {
    background: var(--sketch-success);
    color: #fff;
    border-color: var(--sketch-success);
  }

  .sketch-badge.off {
    background: transparent;
    color: var(--sketch-ink-muted);
  }

  @media (prefers-reduced-motion: reduce) {
    ha-card,
    .sketch-btn {
      transition: none;
    }
    ha-card {
      rotate: 0deg;
    }
  }
`;

export const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap';
if (!document.head.querySelector('link[href*="Caveat"]')) {
  document.head.appendChild(fontLink);
}
