/**
 * Сервис: вычисляет средний возраст студентов.
 *
 * @param {StudentRepository} repo — хранилище
 * @param {Logger} logger — логгер
 *
 * @returns {number} средний возраст
 */

module.exports = function calculateAverageAge(repo, logger) {
  const avg = repo.getAverageAge();
  logger.log("Average age:", avg);
  return avg;
};
