// services/storage.js
const fs = require('fs').promises;
const path = require('path');

const defaultFile = path.join(__dirname, '..', 'data', 'students.json');

/**
 * Save data to JSON file asynchronously
 * @param {Array|Object} data
 * @param {string} filePath
 */
async function saveToJSON(data, filePath = defaultFile) {
    try {
        const dir = path.dirname(filePath);
        // Создать папку, если нет
        await fs.mkdir(dir, { recursive: true });
        // Записать файл
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        throw new Error(`Failed to save JSON: ${err.message}`);
    }
}

/**
 * Load data from JSON file asynchronously
 * @param {string} filePath
 * @returns {Promise<Array|Object>}
 */
async function loadJSON(filePath = defaultFile) {
    try {
        await fs.access(filePath); // проверка, существует ли файл
    } catch {
        return []; // если нет файла, вернуть пустой массив
    }

    try {
        const content = await fs.readFile(filePath, 'utf8');
        return JSON.parse(content);
    } catch (err) {
        throw new Error(`Failed to load JSON from ${filePath}: ${err.message}`);
    }
}

module.exports = { saveToJSON, loadJSON };
