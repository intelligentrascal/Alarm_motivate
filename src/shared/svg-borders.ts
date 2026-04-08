/**
 * SVG rough border generators for the sketch aesthetic.
 * These produce inline SVG data URIs used as border-image or background-image.
 */

/** Generate a rough rectangle SVG border */
export function roughRect(
  width: number,
  height: number,
  stroke = '#2a2a2a',
  strokeWidth = 2
): string {
  // Create a hand-drawn looking rectangle with slight wobble
  const w = width;
  const h = height;
  const sw = strokeWidth;
  const offset = 1.5; // wobble amount

  const path = [
    `M ${sw + offset} ${sw}`,
    `L ${w - sw - offset} ${sw + offset * 0.5}`,
    `Q ${w - sw} ${sw} ${w - sw} ${sw + offset}`,
    `L ${w - sw + offset * 0.3} ${h - sw - offset}`,
    `Q ${w - sw} ${h - sw} ${w - sw - offset} ${h - sw}`,
    `L ${sw + offset * 0.5} ${h - sw + offset * 0.3}`,
    `Q ${sw} ${h - sw} ${sw} ${h - sw - offset}`,
    `L ${sw - offset * 0.3} ${sw + offset}`,
    `Q ${sw} ${sw} ${sw + offset} ${sw}`,
  ].join(' ');

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      `<path d="${path}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `</svg>`
  )}`;
}

/** Generate a rough circle SVG */
export function roughCircle(
  size: number,
  stroke = '#2a2a2a',
  strokeWidth = 2
): string {
  const r = size / 2 - strokeWidth;
  const cx = size / 2;
  const cy = size / 2;
  const wobble = 1.2;

  // Approximate circle with 8 bezier curves with slight wobble
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const rr = r + (Math.sin(i * 3.7) * wobble);
    points.push({
      x: cx + Math.cos(angle) * rr,
      y: cy + Math.sin(angle) * rr,
    });
  }

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length; i++) {
    const next = points[(i + 1) % points.length];
    const cp1x = points[i].x + (next.x - points[i].x) * 0.5 + Math.sin(i) * wobble;
    const cp1y = points[i].y + (next.y - points[i].y) * 0.5 + Math.cos(i) * wobble;
    path += ` Q ${cp1x} ${cp1y} ${next.x} ${next.y}`;
  }
  path += ' Z';

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<path d="${path}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"/>` +
      `</svg>`
  )}`;
}

/** Generate a hand-drawn underline SVG */
export function roughUnderline(width: number, stroke = '#2a2a2a'): string {
  const y = 4;
  const path = `M 0 ${y} Q ${width * 0.25} ${y - 1.5} ${width * 0.5} ${y + 0.5} Q ${width * 0.75} ${y + 2} ${width} ${y - 0.5}`;

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="8">` +
      `<path d="${path}" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round"/>` +
      `</svg>`
  )}`;
}
