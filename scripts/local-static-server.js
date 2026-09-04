const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2] || '.');
const port = Number(process.argv[3] || 4189);
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf', '.ico': 'image/x-icon', '.webp': 'image/webp'
};
const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const candidate = path.resolve(root, `.${requestPath === '/' ? '/index.html' : requestPath}`);
  if (!candidate.startsWith(root + path.sep) && candidate !== path.join(root, 'index.html')) { res.statusCode = 403; return res.end(); }
  fs.stat(candidate, (error, stat) => {
    if (error || !stat.isFile()) { res.statusCode = 404; return res.end('Not found'); }
    res.setHeader('Content-Type', mime[path.extname(candidate).toLowerCase()] || 'application/octet-stream');
    fs.createReadStream(candidate).pipe(res);
  });
});
server.listen(port, '127.0.0.1', () => console.log(`static server ${root} http://127.0.0.1:${port}`));
