const os = require('os');

class Logger {
    #isVerboseModeEnabled = false;
    #isQuietModeEnabled = false;

    constructor(verbose = false, quiet = false) {
        this.#isVerboseModeEnabled = verbose;
        this.#isQuietModeEnabled = quiet;
    }

    log(...data) {
        if (this.#isQuietModeEnabled) {
            return;
        }

        if (this.#isVerboseModeEnabled) {
            const systemData = {
                timestamp: new Date().toISOString(),
                platform: os.platform(),
                totalMemory: os.totalmem(),
                freeMemory: os.freemem(),
                cpuModel: os.cpus()[0]?.model || 'Unknown',
            };
            console.log('--- SYSTEM DATA ---');
            console.log(systemData);
            console.log('--- MESSAGE ---');
        }

        console.log(...data);
    }
}

module.exports = Logger;
