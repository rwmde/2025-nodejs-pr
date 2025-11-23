const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const EventEmitter = require('events');
const Logger = require('./logger').getInstance();

class BackupService extends EventEmitter {
    #outputDir;
    #dataGenerator;
    #intervalId = null;
    #isPending = false;
    #pendingCount = 0;
    #interval;

    constructor(dataGenerator, interval = 10000, outputDir = 'backups') {
        super();
        this.#dataGenerator = dataGenerator;
        this.#interval = interval;
        this.#outputDir = path.join(process.cwd(), outputDir);

        if (!fsSync.existsSync(this.#outputDir)) {
            fsSync.mkdirSync(this.#outputDir, { recursive: true });
        }
    }

    start() {
        if (this.#intervalId) {
            Logger.warn('Backup service is already running');
            return;
        }

        this.#intervalId = setInterval(async () => {
            await this.#performBackup();
        }, this.#interval);

        Logger.log(`Backup service started. Interval: ${this.#interval}ms`);
    }

    stop() {
        if (this.#intervalId) {
            clearInterval(this.#intervalId);
            this.#intervalId = null;
            Logger.log('Backup service stopped');
        }
    }

    async #performBackup() {
        if (this.#isPending) {
            this.#pendingCount++;
            Logger.warn(`Backup operation is still pending. Count: ${this.#pendingCount}`);

            if (this.#pendingCount >= 3) {
                const error = new Error('Backup operation has been pending for 3 intervals in a row');
                this.emit('backup-error', error);
                Logger.error(`Backup service stopped with error:`, error);
                this.stop();
                throw error;
            }

            return;
        }

        try {
            this.#isPending = true;
            this.#pendingCount = 0;

            const data = await this.#dataGenerator();

            if(!data) {
                return;
            }

            const timestamp = Date.now();
            const fileName = `${timestamp}.backup.json`;
            const filePath = path.join(this.#outputDir, fileName);

            await fs.writeFile(filePath, JSON.stringify(data, null, 2));

            this.emit('backup-completed', { fileName, timestamp, filePath });
            Logger.log(`Backup completed:`, fileName);
        } catch (error) {
            this.emit('backup-error', error);
            Logger.error(`Backup failed:`, error);
        } finally {
            this.#isPending = false;
        }
    }
}

module.exports = BackupService;

