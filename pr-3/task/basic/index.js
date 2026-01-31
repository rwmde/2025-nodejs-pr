import { createServer } from 'http';

const PORT = 3000;

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(
    `
      <h1>Hello World</h1>
      <p><strong>HTTP Method:</strong> ${req.method}</p>
      <p><strong>URL:</strong> ${req.url}</p>
      <p><strong>HTTP Version:</strong> ${req.httpVersion}</p>
      <h2>Request Headers:</h2>
      <ul>
        ${Object.entries(req.headers)
          .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
          .join('')}
      </ul>
    `
  );
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
