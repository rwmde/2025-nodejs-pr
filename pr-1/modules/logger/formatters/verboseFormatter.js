/**
 * Форматирует расширенный (VERBOSE) лог.
 * Добавляет системную информацию в структурированном виде.
 *
 * @param {string} message — сообщение
 * @param {Array<any>} args — данные для вывода
 *
 * @returns {{logLine: string, systemBlock: string}}
 */

const timestamp = require("./utils/timestamp");
const pretty = require("./utils/pretty");
const getSystemInfo = require("./utils/systemInfo");

module.exports = function formatVerbose(message, args) {
  const formattedArgs = args.map((a) => pretty(a)).join(" ");

  const sys = getSystemInfo();

  const systemBlock =
    `SYSTEM:\n` +
    `   platform: ${sys.platform}\n` +
    `   cpu: ${sys.cpu}\n` +
    `   totalMem: ${sys.totalMem}\n` +
    `   freeMem: ${sys.freeMem}`;

  const logLine = `[${timestamp()}][VERBOSE] ${message}${
    formattedArgs ? " " + formattedArgs : ""
  }`;

  return { logLine, systemBlock };
};
