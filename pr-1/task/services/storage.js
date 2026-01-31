// services/storage.js
const fs = require('fs');
const path = require('path');

// Default JSON file path
const defaultFile = path.join(__dirname, '..', 'data', 'students.json');

/**
 * Save data to JSON file
 * @param {Array|Object} data
 * @param {string} filePath
 */
function saveToJSON(data, filePath = defaultFile) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Load data from JSON file
 * @param {string} filePath
 * @returns {Array|Object}
 */
function loadJSON(filePath = defaultFile) {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    try {
        return JSON.parse(content);
    } catch (err) {
        throw new Error(`Invalid JSON in ${filePath}: ${err.message}`);
    }
}

module.exports = { saveToJSON, loadJSON };
