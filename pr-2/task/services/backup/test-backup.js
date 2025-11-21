// Test script for backup functionality

const { addStudent, getAllStudents } = require('../../entities/students');

const { Logger } = require('../../utils/logger');
const { BackupManager } = require('./backup');

const logger = new Logger();

async function testBackup() {
  const backupManager = new BackupManager(getAllStudents, 5000, './backups');

  try {
    logger.log('Starting backup test...');

    await backupManager.start();

    addStudent('Test Student', 25, 4);
    logger.log('Added test student');

    await new Promise((resolve) => setTimeout(resolve, 16000)); // Wait 16 seconds for 3 backups

    backupManager.stop();
    logger.log('Backup test completed');

    process.exit(0);
  } catch (error) {
    logger.log('Error during backup test:', error.message);
    backupManager.stop();
    process.exit(1);
  }
}

testBackup();
