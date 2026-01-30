import http from 'http';
import fs from 'fs';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { Transform } from 'stream';

export class LiveServer {
    private server: http.Server;
    private wss: WebSocketServer;
    private targetDir: string;
    private port: number;

    constructor(targetDir: string, port: number = 3000) {
        this.targetDir = path.resolve(targetDir);
        this.port = port;
        this.server = http.createServer(this.requestHandler.bind(this));
        this.wss = new WebSocketServer({ server: this.server });

        this.initializeWebSocket();
        this.initializeFileWatcher();
    }

    public start() {
        this.server.listen(this.port, () => {
            console.log(`Live Server running at http://localhost:${this.port}`);
            console.log(`Watching directory: ${this.targetDir}`);
        });
    }

    private requestHandler(req: http.IncomingMessage, res: http.ServerResponse) {
        const url = req.url === '/' ? '/index.html' : req.url || '/index.html';
        const filePath = path.join(this.targetDir, url);

        if (!filePath.startsWith(this.targetDir)) {
            res.writeHead(403);
            res.end('Access denied');
            return;
        }

        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }

            const ext = path.extname(filePath).toLowerCase();
            const contentType = this.getContentType(ext);

            res.writeHead(200, { 'Content-Type': contentType });

            const readStream = fs.createReadStream(filePath);

            if (ext === '.html') {
                const injectScriptStream = new Transform({
                    transform(chunk, encoding, callback) {
                        const chunkString = chunk.toString();
                        const script = `
              <script>
                const ws = new WebSocket('ws://' + window.location.host);
                ws.onmessage = (event) => {
                  if (event.data === 'reload') {
                    window.location.reload();
                  }
                };
                console.log('Live Server connected');
              </script>
            `;

                        if (chunkString.includes('</body>')) {
                            this.push(chunkString.replace('</body>', script + '</body>'));
                        } else {
                            this.push(chunkString + script);
                        }
                        callback();
                    }
                });

                readStream.pipe(injectScriptStream).pipe(res);
            } else {
                readStream.pipe(res);
            }
        });
    }

    private getContentType(ext: string): string {
        const types: Record<string, string> = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
        };
        return types[ext] || 'application/octet-stream';
    }

    private initializeWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log('Client connected');
            ws.send('connected');
        });
    }

    private initializeFileWatcher() {
        let debounceTimer: NodeJS.Timeout;

        fs.watch(this.targetDir, { recursive: true }, (_, filename) => {
            if (filename) {
                // Debounce to avoid multiple reloads for a single save
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    console.log(`File changed: ${filename}`);
                    this.broadcastReload();
                }, 100);
            }
        });
    }

    private broadcastReload() {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('reload');
            }
        });
    }
}
