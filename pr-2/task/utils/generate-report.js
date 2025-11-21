// CLI tool for generating backup reports

const { BackupReporter } = require('./reporter');
const { Logger } = require('./logger');

const logger = new Logger();

async function main() {
  const args = process.argv.slice(2);
  const backupDir = args[0] || './backups';

  try {
    logger.log(`Analyzing backups in directory: ${backupDir}\n`);

    const reporter = new BackupReporter(backupDir);
    await reporter.printReport();

    process.exit(0);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: Backup directory '${backupDir}' not found.`);
      console.error('Please make sure you have created backups first.');
    } else {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

main();
