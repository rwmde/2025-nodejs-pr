/**
 * Индексный модуль, объединяющий все сервисы для удобного импорта.
 */

module.exports = {
  addStudent: require("./addStudent"),
  removeStudent: require("./removeStudent"),
  getStudentById: require("./getStudentById"),
  getStudentsByGroup: require("./getStudentsByGroup"),
  getAllStudents: require("./getAllStudents"),
  calculateAverageAge: require("./calculateAverageAge"),
};
