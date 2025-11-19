const fs = require('fs');
const path = require('path');

class JsonStorage {
    #filePath = path.join(process.cwd(), 'storage.json');

    constructor(filePath) {
        this.#filePath = filePath;
    }

    load() {
        if (!fs.existsSync(this.#filePath)) {
            return null;
        }
        return JSON.parse(fs.readFileSync(this.#filePath, { encoding: 'utf8', flag: 'r' }));
    }

    save(contents) {
        if (!fs.existsSync(path.dirname(this.#filePath))) {
            fs.mkdirSync(path.dirname(this.#filePath));
        }
        fs.writeFileSync(this.#filePath, JSON.stringify(contents, null, 2));
    }
}


module.exports = JsonStorage;
