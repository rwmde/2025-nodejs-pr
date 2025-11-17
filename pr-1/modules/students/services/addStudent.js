/**
 * Сервис: добавляет нового студента в репозиторий.
 *
 * @param {StudentRepository} repo — хранилище студентов
 * @param {Logger} logger — логгер
 * @param {string} name — имя студента
 * @param {number} age — возраст
 * @param {string|number} group — группа
 *
 * @returns {Student} созданный студент
 */

module.exports = function addStudent(repo, logger, name, age, group) {
  const student = repo.create(name, age, group);
  logger.log("Student created:", student);
  return student;
};
