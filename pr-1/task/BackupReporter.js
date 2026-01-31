const fs = require('fs');
const path = require('path');

class BackupReporter {
    constructor(backupDir, logger) {
        this.backupDir = backupDir;
        this.logger = logger;
    }

    async generateReport() {
        try {
            const files = await this.getBackupFiles();

            if (files.length === 0) {
                this.logger.log('No backup files found.');
                return;
            }

            const stats = await this.analyzeBackups(files);
            this.formatReport(stats, files);
        } catch (error) {
            this.logger.log('Error generating backup report:', error.message);
        }
    }

    async getBackupFiles() {
        const files = await fs.promises.readdir(this.backupDir);
        return files.filter(file => file.endsWith('.backup.json'));
    }

    parseTimestampFromFilename(filename) {
        // Extract timestamp from filename
        const match = filename.match(/students_(.+)\.backup\.json/);
        if (match) {
            // Convert back from filename format to ISO format
            const timestamp = match[1].replace(/-/g, (match, offset, string) => {
                if (offset < 10) return '-'; // Date part
                if (offset === 10) return 'T'; // T separator
                if (offset === 13 || offset === 16) return ':'; // Time colons
                if (offset === 19) return '.'; // Milliseconds separator
                return match;
            });
            return new Date(timestamp);
        }
        return null;
    }

    getLatestBackup(files) {
        let latest = null;
        let latestDate = null;

        for (const file of files) {
            const date = this.parseTimestampFromFilename(file);
            if (date && (!latestDate || date > latestDate)) {
                latestDate = date;
                latest = file;
            }
        }

        return { filename: latest, date: latestDate };
    }

    async analyzeBackups(files) {
        const studentCounts = {};
        let totalStudents = 0;

        for (const file of files) {
            const filePath = path.join(this.backupDir, file);
            const data = await fs.promises.readFile(filePath, 'utf8');
            const students = JSON.parse(data);

            totalStudents += students.length;

            for (const student of students) {
                if (!studentCounts[student.id]) {
                    studentCounts[student.id] = 0;
                }
                studentCounts[student.id]++;
            }
        }

        const studentStats = Object.entries(studentCounts).map(([id, amount]) => ({
            id,
            amount
        }));

        const averageStudents = files.length > 0 ? totalStudents / files.length : 0;

        return {
            studentStats,
            averageStudents
        };
    }

    formatReport(stats, files) {
        this.logger.log('\n=== Backup Report ===');
        this.logger.log(`Amount of backup files: ${files.length}`);

        const latest = this.getLatestBackup(files);
        if (latest.filename) {
            this.logger.log(`Latest backup: ${latest.filename}`);
            this.logger.log(`Created at: ${latest.date.toLocaleString()}`);
        }

        this.logger.log('\nStudent occurrences by ID:');
        this.logger.log(JSON.stringify(stats.studentStats, null, 2));

        this.logger.log(`\nAverage number of students per backup: ${stats.averageStudents.toFixed(2)}`);
        this.logger.log('===================\n');
    }
}

module.exports = BackupReporter;
