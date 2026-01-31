/**
 * Утилита для преобразования относительных путей в абсолютные.
 * Используется для корректного поиска файлов независимо от директории запуска.
 *
 * @param {string} relativePath — относительный путь
 */

const path = require("path");

function resolvePath(relativePath) {
  return path.resolve(process.cwd(), relativePath);
}

module.exports = { resolvePath };
