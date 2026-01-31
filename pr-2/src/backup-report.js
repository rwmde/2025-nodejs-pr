const BackupReporter = require('./backup-reporter');

(async () => {
    try {
        const reporter = new BackupReporter('backups');
        await reporter.generateReport();
    } catch (error) {
        console.error('Failed to run backup report:', error.message);
        process.exit(1);
    }
})();

