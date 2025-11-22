const os = require('os');
const util = require('util');

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const FG_GRAY = '\x1b[90m';
const FG_YELLOW = '\x1b[33m';
const FG_MAGIC = '\x1b[94m';
const FG_RED = '\x1b[31m';

class Logger {
    static #instance = null;
    #isVerboseModeEnabled = false;
    #isQuietModeEnabled = false;

    constructor(verbose = false, quiet = false) {
        if (Logger.#instance) {
            return Logger.#instance;
        }
        this.#isVerboseModeEnabled = verbose;
        this.#isQuietModeEnabled = quiet;
        Logger.#instance = this;
    }

    static getInstance() {
        if (Logger.#instance) {
            return Logger.#instance;
        }
        return new Logger();
    }

    log(...args) {
        this.#print('', 'INFO', ...args);
    }

    warn(...args) {
        this.#print(FG_YELLOW, 'WARN', ...args);
    }

    lyrics(...args) {
        this.#print(FG_MAGIC, 'vtihomirov', ...args);
    }

    error(...args) {
        this.#print(FG_RED, 'ERROR', ...args);
    }

    #print(color, severity, ...data) {
        if (this.#isQuietModeEnabled) {
            return;
        }

        const timestamp = new Date().toISOString();

        const formattedPayload = data.map((item) => {
            if (typeof item === 'string') {
                return item;
            }
            return util.inspect(item, { colors: true, depth: null, maxArrayLength: 100 });
        }).join(' ');

        if (this.#isVerboseModeEnabled) {
            const platform = os.platform();
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const cpuModel = Array.isArray(os.cpus()) && os.cpus().length > 0 ? os.cpus()[0].model : 'unknown';
            const sysInfo = `platform=${platform}, totalMem=${totalMem}, freeMem=${freeMem}, cpu="${cpuModel}"`;

            console.log(
                `${FG_GRAY}[${timestamp}]${RESET} ${BOLD}${color}[${severity}] ${formattedPayload} ${DIM}\n(${sysInfo})${RESET}`
            );
            return;
        }

        console.log(
            `${FG_GRAY}[${timestamp}]${RESET} ${BOLD}${color}[${severity}] ${formattedPayload}${RESET}`
        );
    }

    setVerboseModeEnabled(enabled) {
        this.#isVerboseModeEnabled = Boolean(enabled);
    }

    setQuietModeEnabled(enabled) {
        this.#isQuietModeEnabled = Boolean(enabled);
    }
}

module.exports = Logger;
