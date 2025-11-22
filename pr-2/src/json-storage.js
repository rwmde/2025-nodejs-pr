const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

class JsonStorage {
    #filePath = path.join(process.cwd(), 'storage.json');

    constructor(filePath) {
        this.#filePath = filePath;
    }

    async load() {
        try {
            if (!fsSync.existsSync(this.#filePath)) {
                return null;
            }
            const data = await fs.readFile(this.#filePath, { encoding: 'utf8', flag: 'r' });
            return JSON.parse(data);
        } catch (error) {
            throw new Error(`Failed to load data from ${this.#filePath}: ${error.message}`);
        }
    }

    async save(contents) {
        try {
            const dir = path.dirname(this.#filePath);
            if (!fsSync.existsSync(dir)) {
                await fs.mkdir(dir, { recursive: true });
            }
            await fs.writeFile(this.#filePath, JSON.stringify(contents, null, 2));
        } catch (error) {
            throw new Error(`Failed to save data to ${this.#filePath}: ${error.message}`);
        }
    }
}


module.exports = JsonStorage;
