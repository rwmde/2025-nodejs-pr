const http = require('http');
const path = require('path');
const fs = require('fs');
const { WebSocketServer } = require('ws');
const { HtmlInjectTransform } = require('./transform');

const PORT = 3000;
const WS_PORT = 3001;
const TARGET_DIR = path.join(__dirname, '..', 'target');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

const clients = new Set();

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function send404(res) {
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 - File Not Found</h1>');
}

function send500(res, error) {
  res.writeHead(500, { 'Content-Type': 'text/html' });
  res.end(`<h1>500 - Internal Server Error</h1><p>${error.message}</p>`);
}

function handleRequest(req, res) {
  let urlPath = req.url;

  if (urlPath === '/' || urlPath === '') {
    urlPath = '/index.html';
  }

  urlPath = urlPath.split('?')[0];

  const filePath = path.join(TARGET_DIR, urlPath);

  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith(TARGET_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 - Forbidden</h1>');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.log(`[404] File not found: ${filePath}`);
      send404(res);
      return;
    }

    if (stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      serveFile(indexPath, res);
      return;
    }

    serveFile(filePath, res);
  });
}

function serveFile(filePath, res) {
  const mimeType = getMimeType(filePath);
  const isHtml = mimeType === 'text/html';

  const readStream = fs.createReadStream(filePath);

  readStream.on('error', (error) => {
    if (error.code === 'ENOENT') {
      send404(res);
    } else {
      send500(res, error);
    }
  });

  res.writeHead(200, { 'Content-Type': mimeType });

  if (isHtml) {
    const injectTransform = new HtmlInjectTransform(WS_PORT);
    readStream.pipe(injectTransform).pipe(res);
  } else {
    readStream.pipe(res);
  }

  console.log(`[200] Served: ${filePath}`);
}

function watchDirectory() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
    console.log(`Created target directory: ${TARGET_DIR}`);
  }

  fs.watch(TARGET_DIR, { recursive: true }, (eventType, filename) => {
    if (filename) {
      console.log(`[Watch] ${eventType}: ${filename}`);

      notifyClients('reload');
    }
  });

  console.log(`Watching for changes in: ${TARGET_DIR}`);
}

function notifyClients(message) {
  clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
  console.log(`[WS] Notified ${clients.size} client(s) to reload`);
}

function startWebSocketServer() {
  const wss = new WebSocketServer({ port: WS_PORT });

  wss.on('connection', (ws) => {
    console.log('[WS] Client connected');
    clients.add(ws);

    ws.on('close', () => {
      console.log('[WS] Client disconnected');
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('[WS] Error:', error.message);
      clients.delete(ws);
    });
  });

  console.log(`WebSocket server running on ws://localhost:${WS_PORT}`);
}

function startHttpServer() {
  const server = http.createServer(handleRequest);

  server.listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(
        `Port ${PORT} is already in use. Please use a different port.`,
      );
    } else {
      console.error('Server error:', error);
    }
    process.exit(1);
  });
}

function main() {
  console.log('Live Server Starting...');

  startWebSocketServer();
  startHttpServer();
  watchDirectory();
}

main();
