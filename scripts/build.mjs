import { cp, mkdir, writeFile } from 'node:fs/promises';
import { pages } from './pages.mjs';
import './brain-artwork.mjs';

await mkdir('dist', { recursive: true });
for (const file of [
  ...pages.map(([slug]) => `${slug}.html`),
  'styles.css',
  'app.js',
  'content.js',
  'brain-model.js',
  'network.js',
  'images',
  'member_pics',
  'fonts',
]) {
  await cp(file, `dist/${file}`, { recursive: true });
}
await writeFile('dist/.nojekyll', '');
console.log('Static website built in dist/.');
