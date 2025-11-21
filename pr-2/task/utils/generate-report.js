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

// Show usage if --help is passed
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node generate-report.js [backup-directory]

Arguments:
  backup-directory    Optional. Directory containing backup files. 
                      Default: ./backups

Examples:
  node generate-report.js
  node generate-report.js ./backups
  node generate-report.js ./custom-backups

Description:
  Analyzes all backup files in the specified directory and generates
  a comprehensive report including:
  - Total number of backup files
  - Latest backup file with timestamp
  - Student occurrences across all backups
  - Average number of students per backup file
`);
  process.exit(0);
}

main();
