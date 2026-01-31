class Logger {
    constructor({ verbose = false, quiet = false } = {}) {
        this.verbose = verbose;
        this.quiet = quiet;
    }

    log(message) {
        if (this.quiet) return;
        console.log(`[${new Date().toISOString()}] ${message}`);
    }
}

module.exports = Logger;
