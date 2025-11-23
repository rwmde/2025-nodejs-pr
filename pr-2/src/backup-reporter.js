const fs = require('fs').promises;
const path = require('path');
const Logger = require('./logger').getInstance();

class BackupReporter {
    #backupDir;

    constructor(backupDir = 'backups') {
        this.#backupDir = path.join(process.cwd(), backupDir);
    }

    async generateReport() {
        try {
            const files = await fs.readdir(this.#backupDir);
            const backupFiles = files.filter(file => file.endsWith('.backup.json'));

            if (backupFiles.length === 0) {
                Logger.log('No backup files found.');
                return null;
            }

            const backupCount = backupFiles.length;

            const sortedFiles = backupFiles.sort((a, b) => {
                const timestampA = parseInt(a.split('.')[0]);
                const timestampB = parseInt(b.split('.')[0]);
                return timestampB - timestampA;
            });
            const latestFile = sortedFiles[0];
            const latestTimestamp = parseInt(latestFile.split('.')[0]);
            const latestDate = new Date(latestTimestamp);

            const studentCountById = {};
            let totalStudents = 0;

            await Promise.all(backupFiles.map(async (file) => {
                const filePath = path.join(this.#backupDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                const students = JSON.parse(content);

                if (Array.isArray(students)) {
                    totalStudents += students.length;
                    students.forEach(student => {
                        if (student.id) {
                            studentCountById[student.id] = (studentCountById[student.id] || 0) + 1;
                        }
                    });
                }
            }));

            const studentStats = Object.keys(studentCountById).map(id => `#${id}: ${studentCountById[id]}`).join(', ');

            const averageStudents = totalStudents / backupCount;

            const report = {
                backupFilesCount: backupCount,
                latestBackup: {
                    fileName: latestFile,
                    timestamp: latestTimestamp,
                    dateTime: latestDate.toISOString(),
                    readableDate: latestDate.toLocaleString()
                },
                studentsByIdStatistics: studentStats,
                averageStudentsPerBackup: parseFloat(averageStudents.toFixed(2))
            };

            this.#displayReport(report);

            return report;
        } catch (error) {
            Logger.error(`Failed to generate backup report: ${error.message}`);
            throw error;
        }
    }

    #displayReport(report) {
        Logger.warn('=========== BACKUP REPORT ===========');
        Logger.log(`Amount of backup files: ${report.backupFilesCount}`);
        Logger.log(`Latest backup file: ${report.latestBackup.fileName}`);
        Logger.log(`Timestamp: ${report.latestBackup.timestamp}`);
        Logger.log(`Date & Time: ${report.latestBackup.readableDate}`);
        Logger.log(`Students by ID (total occurrences across all backups): ${report.studentsByIdStatistics}`);
        Logger.log(`Average amount of students per backup: ${report.averageStudentsPerBackup}`);
        Logger.warn('=====================================');
    }
}

module.exports = BackupReporter;
