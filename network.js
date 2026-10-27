import {
  createBrainGeometry,
  projectBrain,
  edgeOpacity,
  palette,
  orbit,
  orbitDots,
  orbitLabels,
} from './brain-model.js';

const canvas = document.getElementById('neural-network');
if (canvas) initialize(canvas);

function initialize(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const geometry = createBrainGeometry();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const signals = geometry.edges
    .filter(([from, to], index) => {
      const a = geometry.points[from],
        b = geometry.points[to];
      const length = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
      return index % 67 === 0 && a.z > 45 && b.z > 45 && length > 8 && length < 28;
    })
    .slice(0, 12);
  let width = 0,
    height = 0,
    frame = null,
    visible = true,
    phase = 0,
    previous = null;

  function draw() {
    if (!width || !height) return;
    const projected = projectBrain(geometry.points, phase);
    const scale = Math.min(width / 600, height / 480);
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate((width - 600 * scale) / 2, (height - 480 * scale) / 2);
    ctx.scale(scale, scale);

    const halo = ctx.createRadialGradient(300, 230, 5, 300, 230, 248);
    halo.addColorStop(0, 'rgba(202,231,247,.42)');
    halo.addColorStop(0.65, 'rgba(224,242,251,.18)');
    halo.addColorStop(1, 'rgba(240,248,253,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 600, 480);

    ctx.strokeStyle = 'rgba(77,145,185,.18)';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.ellipse(orbit.x, orbit.y, orbit.rx, orbit.ry, orbit.angle, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([2, 7]);
    ctx.beginPath();
    ctx.ellipse(orbit.x, orbit.y, orbit.rx + 16, orbit.ry + 14, orbit.angle, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.lineWidth = 0.65;
    for (const [from, to] of geometry.edges) {
      const a = projected[from],
        b = projected[to];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(${palette[a.color]},${edgeOpacity(a, b)})`;
      ctx.stroke();
    }
    // Small pulses travel along real mesh edges rather than flashing the whole drawing.
    if (!reducedMotion.matches) {
      signals.forEach(([from, to], index) => {
        const a = projected[from],
          b = projected[to];
        const progress = (phase * 1.6 + index * 0.618) % 1;
        const tail = Math.max(0, progress - 0.3);
        const alpha = (Math.sin(progress * Math.PI) * (a.near + b.near)) / 2;
        const x = a.x + (b.x - a.x) * progress;
        const y = a.y + (b.y - a.y) * progress;
        ctx.beginPath();
        ctx.moveTo(a.x + (b.x - a.x) * tail, a.y + (b.y - a.y) * tail);
        ctx.lineTo(x, y);
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = `rgba(20,144,204,${alpha * 0.65})`;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,176,225,${alpha * 0.12})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(12,135,194,${alpha})`;
        ctx.fill();
      });
    }
    projected
      .sort((a, b) => a.z - b.z)
      .forEach((point) => {
        if (point.glow) {
          const pulse = reducedMotion.matches
            ? 0.5
            : 0.5 + Math.sin(phase * 6 + point.x * 0.025 + point.y * 0.018) * 0.5;
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.radius * (2.5 + pulse * 1.8), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(52,161,208,${0.045 + pulse * 0.09})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${palette[point.color]},${point.alpha})`;
        ctx.fill();
      });
    orbitDots(phase).forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#52a5cf';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = '#bdddea';
      ctx.stroke();
    });
    // Move the labels around the ellipse while keeping the text upright and readable.
    const fontSize = Math.max(16, 11 / scale);
    ctx.font = `500 ${fontSize}px Manrope, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    orbitLabels(phase).forEach((label) => {
      const halfWidth = ctx.measureText(label.text).width / 2;
      const x = Math.max(halfWidth + 8, Math.min(600 - halfWidth - 8, label.x));
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(255,255,255,.95)';
      ctx.strokeText(label.text, x, label.y);
      ctx.fillStyle = `rgba(38,104,146,${0.72 + label.depth * 0.28})`;
      ctx.fillText(label.text, x, label.y);
    });
    ctx.restore();
    canvas.parentElement.classList.add('network-ready');
  }

  function resize() {
    const box = canvas.getBoundingClientRect();
    width = box.width;
    height = box.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function animate(time) {
    frame = null;
    if (!visible || document.hidden || reducedMotion.matches) return;
    if (previous === null) previous = time;
    if (time - previous >= 33) {
      phase += Math.min(time - previous, 100) * 0.00035;
      draw();
      previous = time;
    }
    frame = requestAnimationFrame(animate);
  }

  function syncAnimation() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previous = null;
    if (reducedMotion.matches) phase = 0;
    draw();
    if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(animate);
  }

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncAnimation();
  }).observe(canvas);
  reducedMotion.addEventListener('change', syncAnimation);
  document.addEventListener('visibilitychange', syncAnimation);
  document.fonts.ready.then(draw);
  resize();
}
