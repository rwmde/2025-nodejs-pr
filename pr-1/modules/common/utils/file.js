/**
 * Утилиты для работы с JSON-файлами.
 * readJSON — читает файл и парсит JSON.
 * writeJSON — записывает объект/массив в JSON-файл.
 *
 * @param {string} filePath — путь к файлу
 */

const fs = require("fs");

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

module.exports = { readJSON, writeJSON };
