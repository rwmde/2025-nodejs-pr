const path = require('path');
const StudentManager = require('./StudentManager');
const Logger = require('./Logger');
const demo = require('./demo');
const { parseArgs, delay } = require('./utils');
const EventObserver = require('./EventObserver');
const BackupService = require('./BackupService');
const BackupReporter = require('./BackupReporter');

const DATA_FILE = path.join(__dirname, 'students.json');
const BACKUP_DIR = path.join(__dirname, 'backups');

(async function main() {
  const { verbose, quiet } = parseArgs();

  const logger = new Logger(verbose, quiet);
  const manager = new StudentManager(logger);
  const backupService = new BackupService(manager, logger);

  new EventObserver(manager, backupService, logger);

  logger.log('Loading student data...');
  await manager.loadJSON(DATA_FILE);

  backupService.start();

  demo(manager, logger);

  // Keep process alive to demonstrate backup (e.g., 6 seconds for a 5s interval)
  logger.log('Waiting for backup service...');
  await delay(6000);

  // Stop backup service
  backupService.stop();

  logger.log('Saving data...');
  await manager.saveToJSON(DATA_FILE);

  const reporter = new BackupReporter(BACKUP_DIR, logger);
  await reporter.generateReport();

  logger.log('Done.');
})()
