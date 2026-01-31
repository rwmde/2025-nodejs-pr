/**
 * Форматирует объект в красиво отформатированный JSON (2 пробела).
 * Используется для вывода данных в логах.
 */

module.exports = function pretty(obj) {
  return JSON.stringify(obj, null, 2);
};
