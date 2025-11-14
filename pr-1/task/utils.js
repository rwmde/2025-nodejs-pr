const fs = require('fs');
const { Logger } = require('./logger');
const { log } = require('console');

const logger = new Logger();

/**
 * Saves data to a JSON file.
 * @param {*} data - The data to be saved to the JSON file.
 * @param {string} filePath - The path where the JSON file will be saved.
 */
function saveToJSON(data, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  logger.log(`Data saved to ${filePath}`);
}

/**
 * Loads and parses a JSON file from the specified file path.
 * @param {string} filePath - The path to the JSON file to load
 * @returns {Object} The parsed JSON object from the file
 */
function loadJSON(filePath) {
  logger.log(`Loading data from ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

module.exports = {
  saveToJSON,
  loadJSON,
};
