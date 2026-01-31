import fs from 'fs/promises';
import path from 'path';

type Logger = (msg: string, type?: 'info' | 'success' | 'failed') => void;

interface BackupServiceOptions {
  intervalMs?: number;
  backupDir?: string;
  logger?: Logger;
}

export default class BackupService {
  private getStudents: () => any[];
  private intervalMs: number;
  private backupDir: string;
  private logger: Logger;

  private intervalId: NodeJS.Timeout | null = null;
  private isWriting: boolean = false;
  private pendingIntervals: number = 0;

  constructor(getStudentsCallback: () => any[], options: BackupServiceOptions = {}) {
    this.getStudents = getStudentsCallback;
    this.intervalMs = options.intervalMs ?? 60000;
    this.backupDir = options.backupDir ?? 'backups';
    this.logger = options.logger ?? ((msg) => console.log(msg));
  }

  private async _backup() {
    if (this.isWriting) {
      this.pendingIntervals++;
      this.logger(`Backup skipped, previous operation still pending (${this.pendingIntervals})`, 'failed');
      if (this.pendingIntervals >= 3) throw new Error('Backup stalled: previous I/O operations exceeded 3 intervals in a row');
      return;
    }

    this.isWriting = true;
    try {
      const students = this.getStudents();
      const timestamp = new Date().toISOString().replace(/[:]/g, '-');
      const filename = path.join(this.backupDir, `${timestamp}.backup.json`);

      await fs.mkdir(this.backupDir, { recursive: true });
      await fs.writeFile(filename, JSON.stringify(students, null, 2), 'utf8');

      this.logger(`Backup saved: ${filename}`, 'success');
      this.pendingIntervals = 0;
    } catch (err: any) {
      this.logger(err.message, 'failed');
    } finally {
      this.isWriting = false;
    }
  }

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this._backup(), this.intervalMs);
    this.logger(`Backup started. Interval: ${this.intervalMs} ms`, 'info');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.logger('Backup stopped', 'info');
    }
  }

  status() {
    return {
      running: !!this.intervalId,
      pendingIntervals: this.pendingIntervals
    };
  }
}
