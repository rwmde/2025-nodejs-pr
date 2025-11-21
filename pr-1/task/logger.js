const os = require('os');

class Logger {
  #isVerboseModeEnabled = false;
  #isQuietModeEnabled = false;

  constructor(verbose = false, quiet = false) {
    const args = process.argv.slice(2);
    this.#isVerboseModeEnabled = verbose || args.includes('--verbose');
    this.#isQuietModeEnabled = quiet || args.includes('--quiet');
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
        cpuModel: os.cpus()[0].model,
      };
      console.log('System Data:', systemData);
    }

    console.log(...data);
  }
}

module.exports = {
  Logger,
};
