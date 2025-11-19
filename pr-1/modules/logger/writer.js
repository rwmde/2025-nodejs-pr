/**
 * Небольшая обёртка над console.log.
 * Изолирует вывод, чтобы логи можно было перенаправить при необходимости.
 */

module.exports.write = function (message) {
  console.log(message);
};
