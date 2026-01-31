const { EventEmitter } = require('events');
const {
  addStudent,
  removeStudent,
  getAllStudents,
  calculateAverageAge,
  loadStudents,
  getPlainStudents
} = require('./services/studentService');

const Logger = require('./services/logger');
const { saveToJSON, loadJSON } = require('./services/storage');
const BackupService = require('./services/backupService');
const { reportBackupStats } = require('./services/backupReporter');

// --- Parse CLI arguments ---
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const quiet = args.includes('--quiet');

const logger = new Logger({ verbose, quiet });

// --- EventEmitter instance ---
const events = new EventEmitter();

// --- Event listeners ---
events.on('student:loaded', (count) => logger.log(`Loaded ${count} students from JSON`));
events.on('student:added', (student) => logger.log('Student added:', student));
events.on('student:removed', (id) => logger.log(`Student removed: ${id}`));
events.on('backup:success', (filename) => logger.log(`Backup successfully saved: ${filename}`));
events.on('backup:failed', (error) => logger.log(`Backup failed: ${error}`));
events.on('backup:info', (msg) => logger.log(msg));

// --- Async wrapper ---
(async () => {
  try {
    const loaded = await loadJSON();
    loadStudents(loaded);
    events.emit('student:loaded', loaded.length);

    // --- Start backup service ---
    const backupService = new BackupService(getPlainStudents, {
      intervalMs: 5000,
      backupDir: 'backups',
      logger: (msg, type = 'success') => {
        if (type === 'success') events.emit('backup:success', msg);
        else if (type === 'failed') events.emit('backup:failed', msg);
        else if (type === 'info') events.emit('backup:info', msg);
      }
    });
    backupService.start();

    // --- CLI commands ---
    if (args.includes('--list')) {
      const all = getAllStudents();
      logger.log('All students:', all);
    }

    if (args.includes('--average')) {
      const avg = calculateAverageAge();
      logger.log(`Average age of students: ${avg}`);
    }

    const addIdx = args.indexOf('--add');
    if (addIdx !== -1 && args[addIdx + 1]) {
      try {
        const obj = JSON.parse(args[addIdx + 1]);
        const student = addStudent(obj);
        await saveToJSON(getPlainStudents());
        events.emit('student:added', student);
      } catch (err) {
        logger.log('Error parsing JSON for --add', { error: err.message });
      }
    }

    const removeIdx = args.indexOf('--remove');
    if (removeIdx !== -1 && args[removeIdx + 1]) {
      const id = args[removeIdx + 1];
      const result = removeStudent(id);
      await saveToJSON(getPlainStudents());
      if (result) events.emit('student:removed', id);
      else logger.log(`Student ${id} not found`);
    }

    // --- Generate backup report ---
    if (args.includes('--report')) {
      await reportBackupStats('backups');
    }

    // --- Graceful shutdown ---
    process.on('SIGINT', () => {
      backupService.stop();
      process.exit();
    });

  } catch (err) {
    logger.log('Unexpected error', { error: err.message });
  }
})();
