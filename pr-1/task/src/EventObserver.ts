import { EVENTS } from './constants';
import { StudentManager } from './StudentManager';
import { BackupService } from './BackupService';
import { Logger } from './Logger';

export class EventObserver {
    studentManager: StudentManager;
    backupService: BackupService;
    logger: Logger;

    constructor(studentManager: StudentManager, backupService: BackupService, logger: Logger) {
        this.studentManager = studentManager;
        this.backupService = backupService;
        this.logger = logger;
        this.init();
    }

    init() {
        // StudentManager Events
        this.studentManager.on(EVENTS.STUDENT_ADDED, (student) => {
            this.logger.log('Event: Student added:', student);
        });

        this.studentManager.on(EVENTS.STUDENT_REMOVED, (id) => {
            this.logger.log('Event: Student removed:', id);
        });

        this.studentManager.on(EVENTS.DATA_LOADED, (filePath) => {
            this.logger.log(`Event: Data loaded from ${filePath}`);
        });

        this.studentManager.on(EVENTS.DATA_SAVED, (filePath) => {
            this.logger.log(`Event: Data saved to ${filePath}`);
        });

        // BackupService Events
        this.backupService.on(EVENTS.BACKUP_CREATED, (filename) => {
            this.logger.log(`Event: Backup created successfully: ${filename}`);
        });

        this.backupService.on(EVENTS.BACKUP_FAILED, (error) => {
            if (error instanceof Error) {
                this.logger.log('Event: Backup failed:', error.message);
            } else {
                this.logger.log('Event: Backup failed:', String(error));
            }
        });
    }
}
