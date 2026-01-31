// services/logger.js
const os = require('os');

/**
 * Logger class supports verbose and quiet modes
 */
class Logger {
    #verbose = false;
    #quiet = false;

    /**
     * @param {Object} options
     * @param {boolean} options.verbose
     * @param {boolean} options.quiet
     */
    constructor({ verbose = false, quiet = false } = {}) {
        this.#verbose = verbose;
        this.#quiet = quiet;
    }

    /**
     * Log messages to console
     * @param {string} message
     * @param {Object} meta
     */
    log(message, meta = {}) {
        if (this.#quiet) return;

        const timestamp = new Date().toISOString();

        if (this.#verbose) {
            const systemInfo = {
                platform: os.platform(),
                release: os.release(),
                arch: os.arch(),
                cpus: os.cpus().map(cpu => cpu.model),
                totalMemory: os.totalmem(),
                freeMemory: os.freemem()
            };
            console.log(`[${timestamp}] ${message}`, { ...meta, system: systemInfo });
        } else {
            console.log(`[${timestamp}] ${message}`, meta);
        }
    }
}

module.exports = Logger;
