const fs = require('fs').promises;
const path = require('path');

const defaultFile = path.join(__dirname, '..', 'data', 'students.json');

async function saveToJSON(data, filePath = defaultFile) {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

async function loadJSON(filePath = defaultFile) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(content);
        return Array.isArray(data) ? data : [];
    } catch (err) {
        return [];
    }
}


module.exports = { saveToJSON, loadJSON };
