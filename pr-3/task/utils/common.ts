import fs from 'fs/promises';
import { Logger } from './logger';

const logger = new Logger();

/**
 * Saves data to a JSON file.
 * @param {*} data - The data to be saved to the JSON file.
 * @param {string} filePath - The path where the JSON file will be saved.
 * @returns {Promise<void>}
 */
export async function saveToJSON<T>(data: T, filePath: string): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    logger.log(`Data saved to ${filePath}`);
  } catch (error: unknown) {
    logger.log(`Error saving data to ${filePath}: ${error}`);
    throw error;
  }
}

/**
 * Loads and parses a JSON file from the specified file path.
 * @param {string} filePath - The path to the JSON file to load
 * @returns {Promise<Object>} The parsed JSON object from the file
 */
export async function loadJSON(filePath: string): Promise<any> {
  try {
    logger.log(`Loading data from ${filePath}`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
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
