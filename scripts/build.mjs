import { spawnSync } from 'node:child_process';
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
export const root = fileURLToPath(new URL('../', import.meta.url));
export function build() {
  const result = spawnSync(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.build.json'], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) throw new Error('TypeScript build failed');
  mkdirSync(resolve(root, 'dist'), { recursive: true });
  copyFileSync(resolve(root, 'src/style.css'), resolve(root, 'dist/src/style.css'));
  copyFileSync(resolve(root, 'public/icon.svg'), resolve(root, 'dist/icon.svg'));
  writeFileSync(resolve(root, 'dist/index.html'), readFileSync(resolve(root, 'index.html'), 'utf8').replace('/src/main.ts', './src/main.js'));
  // A dependency-free offline edition. Module names are deliberately unique in this small app.
  const script = ['game', 'save', 'art', 'skins', 'main'].map(name => readFileSync(resolve(root, `dist/src/${name}.js`), 'utf8').replace(/^import .+;\r?$/gm, '').replace(/^export /gm, '')).join('\n');
  const standalone = readFileSync(resolve(root, 'index.html'), 'utf8')
    .replace('<link rel="stylesheet" href="./src/style.css" />', () => `<style>${readFileSync(resolve(root, 'src/style.css'), 'utf8')}</style>`)
    .replace('href="./icon.svg"', () => `href="data:image/svg+xml;base64,${readFileSync(resolve(root, 'public/icon.svg')).toString('base64')}"`)
    // A function replacement preserves literal $& sequences in JavaScript (e.g. regex escaping).
    .replace('<script type="module" src="/src/main.ts"></script>', () => `<script type="module">${script.replaceAll('</script', '<\\/script')}</script>`);
  writeFileSync(resolve(root, 'dist/inkbound.html'), standalone);
  console.log('Built dist/ (portable ES modules, no native tools).');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) build();
