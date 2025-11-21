const fs = require('fs/promises');
const path = require('path');
const { Logger } = require('./logger');

const logger = new Logger();

class BackupReporter {
  /**
   * Creates a new BackupReporter instance
   * @param {string} backupDir - Directory where backups are stored
   */
  constructor(backupDir = './backups') {
    this.backupDir = backupDir;
  }

  /**
   * Reads all backup files from the backup directory
   * @returns {Promise<Array<{filename: string, data: Array}>>}
   */
  async readAllBackupFiles() {
    try {
      const files = await fs.readdir(this.backupDir);
      const backupFiles = files.filter((file) => file.endsWith('.backup.json'));

      const backupData = [];
      for (const file of backupFiles) {
        const filepath = path.join(this.backupDir, file);
        const content = await fs.readFile(filepath, 'utf-8');
        const data = JSON.parse(content);
        backupData.push({ filename: file, data });
      }

      return backupData;
    } catch (error) {
      logger.log(`Error reading backup files: ${error.message}`);
      throw error;
    }
  }

  /**
   * Parses timestamp from filename
   * @param {string} filename - Backup filename
   * @returns {Date}
   */
  parseTimestamp(filename) {
    const match = filename.match(/students_(.+)\.backup\.json/);
    if (match) {
      const timestampStr = match[1];

      const isoStr = timestampStr.replace(
        /(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/,
        '$1-$2-$3T$4:$5:$6.$7Z'
      );

      return new Date(isoStr);
    }
    return null;
  }

  /**
   * Gets the amount of backup files
   * @param {Array} backupFiles - Array of backup file data
   * @returns {number}
   */
  getBackupFilesCount(backupFiles) {
    return backupFiles.length;
  }

  /**
   * Gets the latest created backup file with readable timestamp
   * @param {Array} backupFiles - Array of backup file data
   * @returns {Object}
   */
  getLatestBackup(backupFiles) {
    if (backupFiles.length === 0) {
      return null;
    }

    let latestFile = null;
    let latestDate = null;

    for (const backup of backupFiles) {
      const date = this.parseTimestamp(backup.filename);
      if (date && (!latestDate || date > latestDate)) {
        latestDate = date;
        latestFile = backup.filename;
      }
    }

    return {
      filename: latestFile,
      timestamp: latestDate,
      readableTimestamp: latestDate
        ? latestDate.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
          })
        : 'Unknown',
    };
  }

  /**
   * Groups students by ID and counts their occurrences across all backup files
   * @param {Array} backupFiles - Array of backup file data
   * @returns {Array<{id: string, amount: number}>}
   */
  groupStudentsByIdWithCount(backupFiles) {
    const studentCounts = {};

    for (const backup of backupFiles) {
      for (const student of backup.data) {
        if (studentCounts[student.id]) {
          studentCounts[student.id].amount++;
        } else {
          studentCounts[student.id] = {
            id: student.id,
            name: student.name,
            amount: 1,
          };
        }
      }
    }

    return Object.values(studentCounts).sort((a, b) =>
      a.id.localeCompare(b.id)
    );
  }

  /**
   * Calculates the average amount of students across all backup files
   * @param {Array} backupFiles - Array of backup file data
   * @returns {number}
   */
  calculateAverageStudentsCount(backupFiles) {
    if (backupFiles.length === 0) {
      return 0;
    }

    const totalStudents = backupFiles.reduce(
      (sum, backup) => sum + backup.data.length,
      0
    );

    return totalStudents / backupFiles.length;
  }

  /**
   * Generates a comprehensive report of all backup files
   * @returns {Promise<Object>}
   */
  async generateReport() {
    try {
      logger.log('Generating backup report...\n');

      const backupFiles = await this.readAllBackupFiles();

      const report = {
        totalBackupFiles: this.getBackupFilesCount(backupFiles),
        latestBackup: this.getLatestBackup(backupFiles),
        studentOccurrences: this.groupStudentsByIdWithCount(backupFiles),
        averageStudentsPerFile: this.calculateAverageStudentsCount(backupFiles),
      };

      return report;
    } catch (error) {
      logger.log(`Error generating report: ${error.message}`);
      throw error;
    }
  }

  /**
   * Prints a formatted report to the console
   */
  async printReport() {
    try {
      const report = await this.generateReport();

      logger.log('='.repeat(60));
      logger.log('BACKUP REPORT');
      logger.log('='.repeat(60));
      logger.log('');

      logger.log(`1. Total Backup Files: ${report.totalBackupFiles}`);
      logger.log('');

      if (report.latestBackup) {
        logger.log('2. Latest Backup:');
        logger.log(`   Filename: ${report.latestBackup.filename}`);
        logger.log(`   Timestamp: ${report.latestBackup.readableTimestamp}`);
      } else {
        logger.log('2. Latest Backup: No backups found');
      }
      logger.log('');

      logger.log('3. Student Occurrences Across All Backups:');
      if (report.studentOccurrences.length > 0) {
        logger.log(
          JSON.stringify(
            report.studentOccurrences.map((s) => ({
              id: s.id,
              name: s.name,
              amount: s.amount,
            })),
            null,
            2
          )
        );
      } else {
        logger.log('   No students found in backups');
      }
      logger.log('');

      logger.log(
        `4. Average Students Per File: ${report.averageStudentsPerFile.toFixed(
          2
        )}`
      );
      logger.log('');

      logger.log('='.repeat(60));

      return report;
    } catch (error) {
      logger.log(`Failed to print report: ${error.message}`);
      throw error;
    }
  }
}

module.exports = { BackupReporter };
