/**
 * Сервис: получает студентов по номеру группы.
 *
 * @param {StudentRepository} repo
 * @param {Logger} logger
 * @param {string|number} group
 *
 * @returns {Student[]}
 */

module.exports = function getStudentsByGroup(repo, logger, group) {
  const list = repo.findByGroup(group);
  logger.log(`Group ${group}:`, list);
  return list;
};
