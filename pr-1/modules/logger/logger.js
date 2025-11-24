/**
 * Основной логгер системы.
 * Поддерживает 3 режима:
 *  - обычный (INFO)
 *  - verbose (детальный)
 *  - quiet (лог отключён)
 *
 * @method log(message, ...args) — вывод сообщения
 */

const formatSimple = require("./formatters/simpleFormatter");
const formatVerbose = require("./formatters/verboseFormatter");
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
