import { writeFile } from 'node:fs/promises';
import {
  createBrainGeometry,
  projectBrain,
  edgeOpacity,
  palette,
  orbit,
  orbitDots,
  orbitLabels,
} from '../brain-model.js';

// A static rendering of the same 3D mesh used by network.js.
const geometry = createBrainGeometry();
const points = projectBrain(geometry.points);
const n = (value) => Number(value.toFixed(2));
const escapeText = (value) => String(value).replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]);
const batches = new Map();
for (const [from, to] of geometry.edges) {
  const a = points[from],
    b = points[to];
  const alpha = Math.round(edgeOpacity(a, b) * 100) / 100;
  const key = `${a.color}:${alpha}`;
  if (!batches.has(key)) batches.set(key, { color: a.color, alpha, paths: [] });
  batches.get(key).paths.push(`M${n(a.x)} ${n(a.y)}L${n(b.x)} ${n(b.y)}`);
}
const edges = [...batches.values()].map(
  (batch) =>
    `<path d="${batch.paths.join('')}" stroke="rgb(${palette[batch.color]})" opacity="${batch.alpha}"/>`,
);
const nodes = points
  .sort((a, b) => a.z - b.z)
  .map(
    (p) =>
      `${p.glow ? `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${n(p.radius * 3.2)}" fill="#34A1D0" opacity=".08"/>` : ''}<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${n(p.radius)}" fill="rgb(${palette[p.color]})" opacity="${n(p.alpha)}"/>`,
  );
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="480" viewBox="0 0 600 480" fill="none">
  <defs><radialGradient id="halo"><stop stop-color="#CAE7F7" stop-opacity=".42"/><stop offset=".65" stop-color="#E0F2FB" stop-opacity=".18"/><stop offset="1" stop-color="#F0F8FD" stop-opacity="0"/></radialGradient></defs>
  <circle cx="300" cy="230" r="248" fill="url(#halo)"/>
  <g transform="rotate(${n((orbit.angle * 180) / Math.PI)} ${orbit.x} ${orbit.y})" stroke="#4D91B9" stroke-width=".7" opacity=".18">
    <ellipse cx="${orbit.x}" cy="${orbit.y}" rx="${orbit.rx}" ry="${orbit.ry}"/>
    <ellipse cx="${orbit.x}" cy="${orbit.y}" rx="${orbit.rx + 16}" ry="${orbit.ry + 14}" stroke-dasharray="2 7"/>
  </g>
  <g stroke-width=".65">${edges.join('\n')}</g>
  ${nodes.join('\n')}
  ${orbitDots()
    .map(
      (p) =>
        `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${p.radius}" fill="#52A5CF"/><circle cx="${n(p.x)}" cy="${n(p.y)}" r="7" stroke="#BDDDEA" stroke-width=".7"/>`,
    )
    .join('\n')}
  <g font-family="Manrope, Arial, sans-serif" font-size="16" font-weight="500" text-anchor="middle" dominant-baseline="central" stroke="white" stroke-width="5" stroke-linejoin="round" paint-order="stroke fill" fill="#266892">
    ${orbitLabels()
      .map((label) => `<text x="${n(label.x)}" y="${n(label.y)}">${escapeText(label.text)}</text>`)
      .join('\n')}
  </g>
</svg>
`;
await writeFile(new URL('../images/neural-brain.svg', import.meta.url), svg);
console.log(`Generated neural brain: ${points.length} nodes, ${geometry.edges.length} connections.`);
