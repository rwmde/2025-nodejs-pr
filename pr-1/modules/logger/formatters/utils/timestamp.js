/**
 * Возвращает строку timestamp в формате YYYY-MM-DD HH:mm:ss.
 * Используется для всех типов логов.
 */

module.exports = function timestamp() {
  return new Date().toISOString().replace("T", " ").split(".")[0];
};
