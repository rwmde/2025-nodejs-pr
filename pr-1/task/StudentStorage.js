const { Student } = require('./Student');

class StudentsStorage{
  #students = [
    new Student("1", "John Doe", 21, 2),
    new Student("2", "Jane Doe", 25, 3),
    new Student("3", "Andrei Ramanenka", 24, 3),
  ];

  #getLastId() {
    if (this.#students.length === 0) return 0;

    const lastId = this.#students[this.#students.length-1].id;

    return Number(lastId);
  }

  addStudent(name, age, group) {
    const lastId = this.#getLastId();
    const newId = String(lastId + 1);

    this.#students.push(new Student(newId, name, age, group));
  }

  removeStudent(id) {
    const student = this.#students.find(student => student.id === id);

    if (!student) {
        throw new Error(`Student with id ${id} not found`);
    }

    this.#students = this.#students.filter(student => student.id !== id);
  }

  getStudentById(id) {
    return this.#students.find(s => s.id === id) || null;
  }

  getStudentsByGroup(group) {
    return this.#students.filter(s => s.group === group);
  }

  getAllStudents() {
    return this.#students;
  }

  calculateAverageAge() {
    if (this.#students.length === 0) return 0;
    return this.#students.reduce((acc, student) => acc + student.age, 0) / this.#students.length;
  }
}

module.exports = {StudentsStorage}