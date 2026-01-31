const fs = require('fs').promises;
const path = require('path');

class BackupService {
    constructor(getStudentsCallback, { intervalMs = 10000, backupDir = 'backups', logger = console.log } = {}) {
        this.getStudents = getStudentsCallback;
        this.intervalMs = intervalMs;
        this.backupDir = backupDir;
        this.logger = logger;
        this.intervalId = null;
        this.isWriting = false;
        this.pendingIntervals = 0;
    }

    async _backup() {
        if (this.isWriting) {
            this.pendingIntervals++;
            this.logger(`Backup skipped, previous pending (${this.pendingIntervals})`);
            if (this.pendingIntervals >= 3) throw new Error('Backup stalled!');
            return;
        }

        this.isWriting = true;
        try {
            const students = this.getStudents();
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            const filename = path.join(this.backupDir, `${timestamp}.backup.json`);
            await fs.mkdir(this.backupDir, { recursive: true });
            await fs.writeFile(filename, JSON.stringify(students, null, 2), 'utf8');
            this.logger(`Backup saved: ${filename}`);
            this.pendingIntervals = 0;
        } catch (err) {
            this.logger(err.message);
        } finally {
            this.isWriting = false;
        }
    }

    start() {
        if (this.intervalId) return;
        this.intervalId = setInterval(() => this._backup(), this.intervalMs);
        this.logger(`Backup started, interval: ${this.intervalMs}ms`);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.logger('Backup stopped');
        }
    }
}

module.exports = BackupService;
