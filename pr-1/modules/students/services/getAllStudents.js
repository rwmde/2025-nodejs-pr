/**
 * Сервис: получает полный список студентов.
 *
 * @param {StudentRepository} repo
 * @param {Logger} logger
 *
 * @returns {Student[]} список всех студентов
 */

module.exports = function getAllStudents(repo, logger) {
  const list = repo.findAll();
  logger.log("All students:", list);
  return list;
};
