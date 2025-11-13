const timestamp = require("./utils/timestamp");
const pretty = require("./utils/pretty");
const getSystemInfo = require("./utils/systemInfo");

/**
 * Форматирует VERBOSE лог со структурированным выводом.
 */
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
