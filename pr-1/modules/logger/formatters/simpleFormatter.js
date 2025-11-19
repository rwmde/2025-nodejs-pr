/**
 * Форматирует простой лог (INFO).
 *
 * @param {string} message — текст сообщения
 * @param {Array<any>} args — дополнительные данные
 *
 * @returns {string} строка для вывода в лог
 */

const timestamp = require("./utils/timestamp");
const pretty = require("./utils/pretty");

module.exports = function formatSimple(message, args) {
  const formattedArgs = args.map((a) => pretty(a)).join(" ");
  return `[${timestamp()}] INFO ${message}${
    formattedArgs ? " " + formattedArgs : ""
  }`;
};
