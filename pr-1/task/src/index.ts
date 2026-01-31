import path from 'path';
import { StudentManager } from './StudentManager';
import { Logger } from './Logger';
import { demo } from './demo';
import { parseArgs, delay } from './utils';
import { EventObserver } from './EventObserver';
import { BackupService } from './BackupService';
import { BackupReporter } from './BackupReporter';

const DATA_FILE = path.join(__dirname, '..', 'students.json');
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

(async function main() {
  const { verbose, quiet } = parseArgs();

  const logger = new Logger(verbose, quiet);
  const manager = new StudentManager(logger);
  const backupService = new BackupService(manager, logger);

  new EventObserver(manager, backupService, logger);

  logger.log('Loading student data...');
  await manager.loadJSON(DATA_FILE);

  backupService.start();

  await demo(manager, logger);

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
