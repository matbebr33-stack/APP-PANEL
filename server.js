const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const root = path.resolve(__dirname);
const dataFile = path.join(root, 'data.json');
const port = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
};

function send(res, code, body, type) {
  res.writeHead(code, {
    'Content-Type': type,
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function serveFile(req, res, filePath) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      send(res, 404, 'Not found', 'text/plain; charset=utf-8');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    send(res, 200, content, mimeType);
  });
}

function handleApi(req, res) {
  if (req.method === 'GET') {
    fs.readFile(dataFile, 'utf8', (err, content) => {
      if (err) return send(res, 500, JSON.stringify({ error: 'Cannot read data file' }), 'application/json; charset=utf-8');
      send(res, 200, content, 'application/json; charset=utf-8');
    });
    return;
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        fs.writeFile(dataFile, JSON.stringify(payload, null, 2), 'utf8', err => {
          if (err) return send(res, 500, JSON.stringify({ error: 'Cannot save data file' }), 'application/json; charset=utf-8');
          send(res, 200, JSON.stringify(payload), 'application/json; charset=utf-8');
        });
      } catch (error) {
        send(res, 400, JSON.stringify({ error: 'Invalid JSON payload' }), 'application/json; charset=utf-8');
      }
    });
    return;
  }

  send(res, 405, JSON.stringify({ error: 'Method not allowed' }), 'application/json; charset=utf-8');
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/api/data') {
    handleApi(req, res);
    return;
  }

  let filePath = path.join(root, pathname === '/' ? 'index.html' : pathname);
  if (!path.extname(filePath)) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!filePath.startsWith(root)) {
    send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
    return;
  }

  fs.access(filePath, fs.constants.R_OK, err => {
    if (err) {
      send(res, 404, 'Not found', 'text/plain; charset=utf-8');
      return;
    }
    serveFile(req, res, filePath);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
