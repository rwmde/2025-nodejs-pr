import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import { EVENTS } from './constants';
import { StudentManager } from './StudentManager';
import { Logger } from './Logger';

export class BackupService extends EventEmitter {
    studentManager: StudentManager;
    logger: Logger;
    backupInterval: number;
    intervalId: NodeJS.Timeout | null;
    backupDir: string;
    isBackupInProgress: boolean;
    skippedIntervals: number;

    constructor(studentManager: StudentManager, logger: Logger, backupInterval = 5000) {
        super();
        this.studentManager = studentManager;
        this.logger = logger;
        this.backupInterval = backupInterval;
        this.intervalId = null;
        this.backupDir = path.join(__dirname, '..', '..', 'backups'); // Adjust path as src is nested
        this.isBackupInProgress = false;
        this.skippedIntervals = 0;
    }

    start() {
        if (this.intervalId) {
            this.logger.log('Backup service is already running.');
            return;
        }

        this.logger.log(`Starting backup service (Interval: ${this.backupInterval}ms)...`);
        this.intervalId = setInterval(() => {
            if (this.isBackupInProgress) {
                this.skippedIntervals++;
                this.logger.log(`Backup in progress. Skipping interval. (Skipped: ${this.skippedIntervals})`);

                if (this.skippedIntervals >= 3) {
                    this.stop(); // Stop the service to prevent further errors/logs
                    throw new Error('Backup service failed: I/O operation pending for 3 consecutive intervals.');
                }
                return;
            }

            this.skippedIntervals = 0;
            this.backupData();
        }, this.backupInterval);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.logger.log('Backup service stopped.');
        }
    }

    async backupData() {
        this.isBackupInProgress = true;
        try {
            // Ensure backup directory exists
            await fs.promises.mkdir(this.backupDir, { recursive: true });

            const students = await this.studentManager.getAllStudents();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `students_${timestamp}.backup.json`;
            const filePath = path.join(this.backupDir, filename);

            const data = JSON.stringify(students, null, 2);
            await fs.promises.writeFile(filePath, data, 'utf8');

            this.emit(EVENTS.BACKUP_CREATED, filename);
        } catch (error) {
            this.emit(EVENTS.BACKUP_FAILED, error);
        } finally {
            this.isBackupInProgress = false;
        }
    }
}
