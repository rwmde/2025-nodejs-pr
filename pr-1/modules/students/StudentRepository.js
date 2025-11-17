/**
 * Репозиторий студентов — слой доступа к данным.
 * Отвечает за:
 *  - загрузку данных из JSON-файла
 *  - сохранение данных
 *  - операции поиска, фильтрации и создания студентов
 *
 * Использует:
 *   readJSON, writeJSON  — для работы с файлами
 *   resolvePath          — для корректного пути
 *   generateId           — для генерации ID
 *
 * Является единственным источником данных (SRP).
 */

const { readJSON, writeJSON } = require("../common/utils/file");
const { resolvePath } = require("../common/utils/pathResolver");
const { generateId } = require("../common/utils/idGenerator");
const Student = require(resolvePath("modules/common/entities/student.js"));

class StudentRepository {
  constructor() {
    this.students = [];
  }

  loadFromFile(relativePath) {
    const file = resolvePath(relativePath);
    const rawData = readJSON(file);

    if (!rawData) {
      this.students = [];
      return;
    }

    this.students = rawData.map(
      (s) => new Student(s.id, s.name, s.age, s.group)
    );
  }

  saveToFile(relativePath) {
    const file = resolvePath(relativePath);
    writeJSON(file, this.students);
  }

  create(name, age, group) {
    const newStudent = new Student(generateId(), name, age, group);
    this.students.push(newStudent);
    return newStudent;
  }

  delete(id) {
    const prev = this.students.length;
    this.students = this.students.filter((s) => s.id !== id);
    return this.students.length !== prev;
  }

  findById(id) {
    return this.students.find((s) => s.id === id);
  }

  findByGroup(group) {
    return this.students.filter((s) => s.group === group);
  }

  findAll() {
    return [...this.students];
  }

  getAverageAge() {
    if (this.students.length === 0) return 0;
    const sum = this.students.reduce((acc, s) => acc + s.age, 0);
    return sum / this.students.length;
  }
}

module.exports = StudentRepository;
