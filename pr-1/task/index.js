const path = require('path');
const Logger = require('./Logger');
const StudentManager = require('./StudentManager');

const { parseArgs } = require('./utils');
const { demo } = require('./demo')

const DATA_FILE = path.join(__dirname, 'students.json');

(function main() {
  const { verbose, quiet } = parseArgs();

  const logger = new Logger(verbose, quiet);
  const manager = new StudentManager(logger);

  logger.log('Loading student data...');
  manager.loadJSON(DATA_FILE);

  demo(manager, logger);

  logger.log('Saving data...');
  manager.saveToJSON(DATA_FILE);
  logger.log('Done.');
})()
