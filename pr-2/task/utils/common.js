const fs = require('fs/promises');
const { Logger } = require('./logger');
const { log } = require('console');

const logger = new Logger();

/**
 * Saves data to a JSON file.
 * @param {*} data - The data to be saved to the JSON file.
 * @param {string} filePath - The path where the JSON file will be saved.
 * @returns {Promise<void>}
 */
async function saveToJSON(data, filePath) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    logger.log(`Data saved to ${filePath}`);
  } catch (error) {
    logger.log(`Error saving data to ${filePath}: ${error.message}`);
    throw error;
  }
}

/**
 * Loads and parses a JSON file from the specified file path.
 * @param {string} filePath - The path to the JSON file to load
 * @returns {Promise<Object>} The parsed JSON object from the file
 */
async function loadJSON(filePath) {
  try {
    logger.log(`Loading data from ${filePath}`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      logger.log(`File not found: ${filePath}`);
    } else if (error instanceof SyntaxError) {
      logger.log(`Invalid JSON in file: ${filePath}`);
    } else {
      logger.log(`Error loading data from ${filePath}: ${error.message}`);
    }
    throw error;
  }
}

module.exports = {
  saveToJSON,
  loadJSON,
};
