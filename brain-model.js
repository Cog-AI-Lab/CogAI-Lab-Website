// Shared geometry for the animated canvas and its static SVG fallback.
// These surfaces are a decorative interpretation of a brain, not measured anatomy.
export const palette = ['12,112,169', '33,144,185', '24,126,172'];
export const orbit = { x: 300, y: 239, rx: 249, ry: 167, angle: -0.2 };
export const orbitWords = ['Cognition', 'Language', 'Empathy', 'Learning'];

const cerebral = [
  [128, 301],
  [99, 299, 80, 280, 84, 255],
  [66, 238, 71, 209, 89, 195],
  [78, 171, 94, 144, 117, 137],
  [113, 113, 138, 92, 162, 94],
  [177, 69, 205, 70, 225, 80],
  [248, 57, 283, 62, 302, 77],
  [329, 62, 361, 71, 376, 91],
  [408, 82, 436, 99, 442, 122],
  [470, 122, 488, 145, 486, 169],
  [511, 181, 518, 207, 503, 227],
  [516, 255, 502, 278, 479, 286],
  [476, 307, 451, 320, 427, 311],
  [412, 334, 380, 335, 361, 318],
  [339, 337, 312, 328, 304, 306],
  [279, 314, 258, 307, 251, 287],
  [232, 307, 203, 315, 184, 300],
  [167, 319, 143, 317, 128, 301],
];
const cerebellum = [
  [149, 289],
  [121, 295, 108, 319, 117, 344],
  [124, 372, 158, 389, 187, 381],
  [222, 388, 254, 371, 267, 343],
  [270, 318, 251, 298, 225, 295],
  [201, 286, 176, 285, 149, 289],
];
const stem = [
  [258, 287],
  [265, 317, 281, 338, 294, 357],
  [301, 374, 300, 398, 313, 414],
  [321, 424, 335, 420, 343, 409],
  [330, 395, 322, 373, 322, 350],
  [327, 327, 327, 310, 313, 292],
  [294, 283, 276, 282, 258, 287],
];

function sampleOutline(curves) {
  const points = [];
  let [x, y] = curves[0];
  for (const [x1, y1, x2, y2, x3, y3] of curves.slice(1)) {
    for (let step = 0; step < 32; step++) {
      const t = step / 32;
      const u = 1 - t;
      points.push({
        x: u ** 3 * x + 3 * u ** 2 * t * x1 + 3 * u * t ** 2 * x2 + t ** 3 * x3,
        y: u ** 3 * y + 3 * u ** 2 * t * y1 + 3 * u * t ** 2 * y2 + t ** 3 * y3,
      });
    }
    x = x3;
    y = y3;
  }
  return points;
}

// Intersect a ray with the outline to preserve the silhouette at the surface rim.
function radialBoundary(outline, cx, cy, angle) {
  const dx = Math.cos(angle),
    dy = Math.sin(angle);
  let distance = Infinity;
  for (let i = 0; i < outline.length; i++) {
    const a = outline[i],
      b = outline[(i + 1) % outline.length];
    const ex = b.x - a.x,
      ey = b.y - a.y;
    const divisor = dx * ey - dy * ex;
    if (Math.abs(divisor) < 1e-8) continue;
    const px = a.x - cx,
      py = a.y - cy;
    const t = (px * ey - py * ex) / divisor;
    const u = (px * dy - py * dx) / divisor;
    if (t > 0 && u >= 0 && u <= 1) distance = Math.min(distance, t);
  }
  if (!Number.isFinite(distance)) distance = 1;
  return { x: cx + dx * distance, y: cy + dy * distance };
}

export function createBrainGeometry() {
  const points = [],
    edges = [];
  const surfaces = [
    { curves: cerebral, cx: 290, cy: 196, depth: 88, z: 0, rows: 34, columns: 88, color: 0 },
    { curves: cerebellum, cx: 190, cy: 338, depth: 44, z: -24, rows: 17, columns: 44, color: 1 },
    { curves: stem, cx: 305, cy: 350, depth: 19, z: -6, rows: 18, columns: 26, color: 2 },
  ];
  for (const surface of surfaces) {
    const outline = sampleOutline(surface.curves);
    let previous = null;
    for (let row = 0; row <= surface.rows; row++) {
      const latitude = (row / surface.rows) * Math.PI;
      const radius = Math.sin(latitude);
      const count = row === 0 || row === surface.rows ? 1 : Math.max(8, Math.round(surface.columns * radius));
      const ring = [];
      for (let column = 0; column < count; column++) {
        const longitude = (column / count) * Math.PI * 2;
        const boundary = radialBoundary(outline, surface.cx, surface.cy, longitude);
        const x = surface.cx + (boundary.x - surface.cx) * radius;
        const y = surface.cy + (boundary.y - surface.cy) * radius;
        const folds =
          surface.color === 0
            ? 6 * Math.sin(x * 0.065 + Math.sin(y * 0.048) * 1.6) + 3 * Math.sin(y * 0.105 + x * 0.023)
            : 2 * Math.sin(y * 0.21 + longitude);
        const z = surface.z + Math.cos(latitude) * (surface.depth + folds * radius);
        ring.push(points.length);
        points.push({
          x: x - 300,
          y: y - 240,
          z,
          color: surface.color,
          bright: (row * 7 + column * 11) % 47 === 0,
        });
      }
      if (count > 1) ring.forEach((index, j) => edges.push([index, ring[(j + 1) % count]]));
      if (previous) {
        const larger = ring.length >= previous.length ? ring : previous;
        const smaller = larger === ring ? previous : ring;
        larger.forEach((index, j) => {
          const k = Math.round((j / larger.length) * smaller.length) % smaller.length;
          edges.push([index, smaller[k]]);
          if (smaller.length > 1 && j % 3 === 0) edges.push([index, smaller[(k + 1) % smaller.length]]);
        });
      }
      previous = ring;
    }
  }
  return { points, edges };
}

export function projectBrain(points, phase = 0) {
  const yaw = -0.24 + Math.sin(phase) * 0.14;
  const pitch = -0.08 + Math.sin(phase * 0.7) * 0.045;
  const roll = -0.035 + Math.sin(phase * 0.6) * 0.012;
  const breath = 1 + Math.sin(phase * 2.7) * 0.008;
  const float = Math.sin(phase * 1.3) * 2;
  const cy = Math.cos(yaw),
    sy = Math.sin(yaw),
    cp = Math.cos(pitch),
    sp = Math.sin(pitch);
  const cr = Math.cos(roll),
    sr = Math.sin(roll);
  return points.map((point) => {
    const x = point.x * cy - point.z * sy;
    const z = point.x * sy + point.z * cy;
    const y = point.y * cp - z * sp;
    const depth = point.y * sp + z * cp;
    const perspective = 720 / (720 - depth);
    const near = Math.max(0, Math.min(1, (depth + 135) / 270));
    return {
      x: 300 + (x * cr - y * sr) * perspective * breath,
      y: 240 + (x * sr + y * cr) * perspective * breath + float,
      z: depth,
      color: point.color,
      near,
      alpha: 0.12 + near * 0.72,
      radius: point.bright ? 1.85 : 0.55 + near * 0.8,
      glow: point.bright && depth > 20,
    };
  });
}

export function edgeOpacity(a, b) {
  return 0.025 + ((a.near + b.near) / 2) ** 1.5 * 0.27;
}

function orbitPosition(angle, rx = orbit.rx, ry = orbit.ry) {
  const x = rx * Math.cos(angle),
    y = ry * Math.sin(angle);
  return {
    x: orbit.x + x * Math.cos(orbit.angle) - y * Math.sin(orbit.angle),
    y: orbit.y + x * Math.sin(orbit.angle) + y * Math.cos(orbit.angle),
  };
}

export function orbitDots(phase = 0) {
  return [3.65, 0.4, 2.05].map((angle, index) => ({
    ...orbitPosition(angle + phase * 0.52),
    radius: index === 1 ? 3 : 2,
  }));
}

export function orbitLabels(phase = 0) {
  return orbitWords.map((text, index) => {
    const angle = -Math.PI / 2 + (index / orbitWords.length) * Math.PI * 2 + phase * 0.52;
    return {
      text,
      ...orbitPosition(angle, orbit.rx + 8, orbit.ry + 22),
      depth: (Math.sin(angle) + 1) / 2,
    };
  });
}
