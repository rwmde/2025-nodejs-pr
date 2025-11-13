const { formatSimple, formatVerbose } = require("./formatter");
const writer = require("./writer");

class Logger {
  constructor(verbose = false, quiet = false) {
    this.verbose = verbose;
    this.quiet = quiet;
  }

  log(message, ...args) {
    if (this.quiet) return;

    if (this.verbose) {
      const { logLine, systemBlock } = formatVerbose(message, args);
      writer.write(logLine);
      writer.write(systemBlock);
      return;
    }

    const line = formatSimple(message, args);
    writer.write(line);
  }
}

module.exports = Logger;
