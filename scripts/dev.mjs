import { createServer } from 'node:http';
import { readFileSync, watch, existsSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { build, root } from './build.mjs';
const preview = process.argv.includes('--preview');
if (!preview) build();
const dist = resolve(root, 'dist');
if (!existsSync(resolve(dist, 'index.html'))) throw new Error('Run npm run build first.');
const clients = new Set();
let timer;
if (!preview) for (const target of ['src', 'index.html']) watch(resolve(root, target), { recursive: true }, () => {
  clearTimeout(timer); timer = setTimeout(() => {
    try { build(); for (const client of clients) client.write('data: reload\n\n'); } catch { console.error('Fix the error above; watching for changes.'); }
  }, 150);
});
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  if (!preview && req.url === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write(': connected\n\n'); clients.add(res); req.on('close', () => clients.delete(res)); return;
  }
  try {
    const url = new URL(req.url, 'http://localhost');
    const path = resolve(dist, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!path.startsWith(dist + sep)) { res.writeHead(403); res.end(); return; }
    let data = readFileSync(path);
    if (!preview && extname(path) === '.html') data = Buffer.from(data.toString().replace('</body>', '<script>new EventSource("/__reload").onmessage=()=>location.reload()</script></body>'));
    res.writeHead(200, { 'Content-Type': mime[extname(path)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(Number(process.env.PORT ?? 5173), '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${server.address().port}/`));
