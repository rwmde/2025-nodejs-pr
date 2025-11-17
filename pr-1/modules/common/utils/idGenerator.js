/**
 * Генератор уникальных ID для студентов.
 * Возвращает строку на основе текущего timestamp.
 */

module.exports.generateId = function () {
  return String(Date.now());
};
