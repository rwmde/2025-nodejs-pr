const {
  studentEvents,
  addStudent,
  calculateAverageAge,
  getAllStudents,
  getStudentById,
  getStudentsByGroup,
  removeStudent,
} = require('./entities/students');

const { Logger } = require('./utils/logger');

const { loadJSON, saveToJSON } = require('./utils/common');

const { BackupManager } = require('./services/backup/backup');

const logger = new Logger();

studentEvents.on('student:added', (data) => {
  logger.log(
    `Event: Student added - ${data.student.name} (Total students: ${data.totalStudents})`
  );
});

studentEvents.on('student:removed', (data) => {
  logger.log(
    `Event: Student removed - ${data.student.name} (Total students: ${data.totalStudents})`
  );
});

studentEvents.on('student:retrieved', (data) => {
  logger.log(
    `Event: Student retrieved by ID ${data.id} - ${
      data.found ? 'Found' : 'Not found'
    }`
  );
});

studentEvents.on('students:filteredByGroup', (data) => {
  logger.log(
    `Event: Students filtered by group ${data.group} - ${data.count} students found`
  );
});

studentEvents.on('students:retrieved', (data) => {
  logger.log(`Event: All students retrieved - ${data.count} students`);
});

studentEvents.on('students:averageCalculated', (data) => {
  logger.log(
    `Event: Average age calculated - ${data.average.toFixed(2)} (from ${
      data.totalStudents
    } students)`
  );
});

const interval = 2 * 60 * 60 * 1000; // 2 hours

// Create backup manager with 2 hours interval
const backupManager = new BackupManager(getAllStudents, interval, './backups');

backupManager.on('backup:started', (data) => {
  logger.log(
    `Event: Backup process started - Interval: ${data.intervalMs}ms, Directory: ${data.backupDir}`
  );
});

backupManager.on('backup:completed', (data) => {
  logger.log(
    `Event: Backup completed - File: ${data.filename}, Records: ${data.dataCount}`
  );
});

backupManager.on('backup:skipped', (data) => {
  logger.log(
    `Event: Backup skipped - ${data.skippedIntervals}/${data.maxSkippedIntervals} intervals`
  );
});

backupManager.on('backup:error', (data) => {
  logger.log(
    `Event: Backup error - Phase: ${data.phase}, Error: ${data.error}`
  );
});

backupManager.on('backup:stopped', () => {
  logger.log('Event: Backup process stopped');
});

backupManager.on('backup:started-operation', (data) => {
  logger.log(`Event: Starting backup operation - ${data.filename}`);
});

// Handle graceful shutdown - register handlers BEFORE starting
process.on('SIGINT', () => {
  logger.log('\nReceived SIGINT, stopping backup process...');
  backupManager.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.log('\nReceived SIGTERM, stopping backup process...');
  backupManager.stop();
  process.exit(0);
});

async function main() {
  try {
    // Start the backup process
    await backupManager.start();

    addStudent('Alice Brown', 22, 3);
    logger.log('Average Age:', calculateAverageAge());
    logger.log('Student with ID 2:', getStudentById('2'));
    logger.log('Students in Group 2:', getStudentsByGroup(2));
    removeStudent('1');
    logger.log('All Students after removal:', getAllStudents());

    const AllStudents = getAllStudents();
    await saveToJSON(AllStudents, './students.json');
    const loadedStudents = await loadJSON('./students.json');
    logger.log('All Students:', loadedStudents);

    // Keep the process running to demonstrate periodic backups
    logger.log('Backup process is running. Press Ctrl+C to stop...');
  } catch (error) {
    logger.log('An error occurred in the main function:', error.message);
    backupManager.stop();
    throw error;
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  backupManager.stop();
  process.exit(1);
});
