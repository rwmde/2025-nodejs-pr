const timestamp = require("./utils/timestamp");
const pretty = require("./utils/pretty");

/**
 * Форматирует обычный INFO лог.
 */
module.exports = function formatSimple(message, args) {
  const formattedArgs = args.map((a) => pretty(a)).join(" ");
  return `[${timestamp()}] INFO ${message}${
    formattedArgs ? " " + formattedArgs : ""
  }`;
};
