import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.gif':'image/gif','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
export function createSiteServer() {
  return http.createServer((req, res) => {
    try {
      const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const relative = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '');
      if (relative.split('/').some(segment => segment.startsWith('.')) || relative.startsWith('tools/')) { res.writeHead(404).end(); return; }
      const file = path.resolve(root, relative);
      if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
      // Windows is case-insensitive; enforce production casing during preview.
      let cursor = root;
      for (const segment of relative.split('/')) {
        if (!fs.readdirSync(cursor).includes(segment)) { res.writeHead(404).end(); return; }
        cursor = path.join(cursor, segment);
      }
      if (!fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
      res.writeHead(200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store'});
      fs.createReadStream(file).pipe(res);
    } catch { res.writeHead(404).end(); }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createSiteServer();
  const port = Number(process.env.PORT || 4173);
  server.listen(port, '127.0.0.1', () => console.log(`Hyena Design: http://127.0.0.1:${port}`));
}
