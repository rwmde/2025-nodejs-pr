/**
 * Сервис: удаляет студента по ID.
 *
 * @param {StudentRepository} repo
 * @param {Logger} logger
 * @param {string} id — идентификатор студента
 *
 * @returns {boolean} true если студент удалён, иначе false
 */

module.exports = function removeStudent(repo, logger, id) {
  const removed = repo.delete(id);
  logger.log(removed ? `Student ${id} removed` : `Student ${id} not found`);
  return removed;
};
