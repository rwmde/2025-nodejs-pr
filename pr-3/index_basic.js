const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const publicDir = path.join(__dirname, 'public');

function sendFile(res, filePath, contentType = 'text/html') {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/') {
    return sendFile(res, path.join(publicDir, 'index.html'));
  }

  if (url === '/hello') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end('<h1>Hello World</h1>');
  }

  if (url === '/request') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const headers = Object.entries(req.headers).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('');
    const html = `
      <h1>Request Info</h1>
      <ul>
        <li><strong>Method:</strong> ${req.method}</li>
        <li><strong>URL:</strong> ${req.url}</li>
        <li><strong>HTTP Version:</strong> ${req.httpVersion}</li>
      </ul>
      <h2>Headers</h2>
      <ul>${headers}</ul>
    `;
    return res.end(html);
  }

  const staticPath = path.join(publicDir, url);
  if (staticPath.indexOf(publicDir) === 0 && fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
    const ext = path.extname(staticPath).toLowerCase();
    const map = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.ico': 'image/x-icon',
      '.json': 'application/json'
    };
    const contentType = map[ext] || 'application/octet-stream';
    return sendFile(res, staticPath, contentType);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Basic HTTP server listening on http://localhost:${PORT}`);
  console.log('Routes: / (page), /hello (Hello World), /request (request info)');
});
