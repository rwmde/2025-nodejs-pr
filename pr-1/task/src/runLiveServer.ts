import { LiveServer } from './LiveServer';
import path from 'path';

const targetRelPath = process.argv[2] || 'target';
const port = parseInt(process.argv[3] || '3000', 10);

const targetDir = path.resolve(process.cwd(), targetRelPath);

const liveServer = new LiveServer(targetDir, port);
liveServer.start();
