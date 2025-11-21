const fs = require('fs/promises');
const path = require('path');
const { EventEmitter } = require('events');
const { Logger } = require('../../utils/logger');

const logger = new Logger();

class BackupManager extends EventEmitter {
  /**
   * Creates a new BackupManager instance
   * @param {Function} getDataCallback - Function that returns the data to backup
   * @param {number} intervalMs - Backup interval in milliseconds
   * @param {string} backupDir - Directory where backups will be stored
   */
  constructor(getDataCallback, intervalMs = 60000, backupDir = './backups') {
    super();
    this.getDataCallback = getDataCallback;
    this.intervalMs = intervalMs;
    this.backupDir = backupDir;
    this.intervalId = null;
    this.isRunning = false;
    this.isBackupInProgress = false;
    this.skippedIntervals = 0;
    this.maxSkippedIntervals = 3;
  }

  /**
   * Starts the periodic backup process
   */
  async start() {
    if (this.isRunning) {
      logger.log('Backup process is already running');
      return;
    }

    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      logger.log(`Backup directory created/verified: ${this.backupDir}`);

      this.isRunning = true;

      await this.performBackup();

      this.intervalId = setInterval(async () => {
        await this.performBackup();
      }, this.intervalMs);

      logger.log(`Backup process started with interval: ${this.intervalMs}ms`);
      this.emit('backup:started', {
        intervalMs: this.intervalMs,
        backupDir: this.backupDir,
      });
    } catch (error) {
      logger.log(`Failed to start backup process: ${error.message}`);
      this.emit('backup:error', { error: error.message, phase: 'start' });
      throw error;
    }
  }

  /**
   * Stops the backup process
   */
  stop() {
    if (!this.isRunning) {
      logger.log('Backup process is not running');
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    logger.log('Backup process stopped');
    this.emit('backup:stopped');

    // Force clear any pending timers
    if (global.gc) {
      global.gc();
    }
  }

  /**
   * Performs a single backup operation
   */
  async performBackup() {
    if (this.isBackupInProgress) {
      this.skippedIntervals++;
      logger.log(
        `Backup is already in progress. Skipped interval ${this.skippedIntervals}/${this.maxSkippedIntervals}`
      );
      this.emit('backup:skipped', {
        skippedIntervals: this.skippedIntervals,
        maxSkippedIntervals: this.maxSkippedIntervals,
      });

      if (this.skippedIntervals >= this.maxSkippedIntervals) {
        const error = new Error(
          `Backup operation has been pending for ${this.maxSkippedIntervals} intervals. This may indicate a problem with the I/O operation.`
        );
        logger.log(`ERROR: ${error.message}`);
        this.emit('backup:error', {
          error: error.message,
          phase: 'performBackup',
          skippedIntervals: this.skippedIntervals,
        });
        this.stop();
        throw error;
      }

      return;
    }

    try {
      this.isBackupInProgress = true;
      this.skippedIntervals = 0;

      const data = this.getDataCallback();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `students_${timestamp}.backup.json`;
      const filepath = path.join(this.backupDir, filename);

      this.emit('backup:started-operation', { filename });
      await fs.writeFile(filepath, JSON.stringify(data, null, 2));
      logger.log(`Backup completed successfully: ${filename}`);
      this.emit('backup:completed', {
        filename,
        filepath,
        dataCount: data.length,
        timestamp,
      });
    } catch (error) {
      logger.log(`Backup failed: ${error.message}`);
      this.emit('backup:error', { error: error.message, phase: 'writeFile' });
      throw error;
    } finally {
      this.isBackupInProgress = false;
    }
  }
}

module.exports = { BackupManager };
