/**
 * Сервис: ищет студента по ID.
 *
 * @param {StudentRepository} repo
 * @param {Logger} logger
 * @param {string} id — ID студента
 *
 * @returns {Student|null}
 */

module.exports = function getStudentById(repo, logger, id) {
  const student = repo.findById(id);
  logger.log("Student:", student);
  return student;
};
