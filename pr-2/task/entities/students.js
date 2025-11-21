const { EventEmitter } = require('events');

class StudentEventEmitter extends EventEmitter {}
const studentEvents = new StudentEventEmitter();

class Student {
  static students = [
    new Student('1', 'John Doe', 20, 2),
    new Student('2', 'Jane Smith', 23, 3),
    new Student('3', 'Mike Johnson', 18, 2),
  ];

  /**
   * @param {string} id
   * @param {stirng} name
   * @param {number} age
   * @param {string} group
   */
  constructor(id, name, age, group) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.group = group;
  }

  static addStudent(name, age, grade) {
    const newStudent = new Student(
      (Student.students.length + 1).toString(),
      name,
      age,
      grade
    );
    Student.students.push(newStudent);
    studentEvents.emit('student:added', {
      student: newStudent,
      totalStudents: Student.students.length,
    });
  }

  static removeStudent(id) {
    const studentToRemove = Student.students.find(
      (student) => student.id === id
    );
    Student.students = Student.students.filter((student) => student.id !== id);
    if (studentToRemove) {
      studentEvents.emit('student:removed', {
        student: studentToRemove,
        totalStudents: Student.students.length,
      });
    }
  }

  static getStudentById(id) {
    const student = Student.students.find((student) => student.id === id);
    studentEvents.emit('student:retrieved', { id, found: !!student });
    return student;
  }

  static getStudentsByGroup(group) {
    const students = Student.students.filter(
      (student) => student.group === group
    );
    studentEvents.emit('students:filteredByGroup', {
      group,
      count: students.length,
    });
    return students;
  }

  static getAllStudents() {
    studentEvents.emit('students:retrieved', {
      count: Student.students.length,
    });
    return Student.students;
  }

  static calculateAverageAge() {
    const average =
      Student.students.reduce((sum, student) => sum + student.age, 0) /
      Student.students.length;
    studentEvents.emit('students:averageCalculated', {
      average,
      totalStudents: Student.students.length,
    });
    return average;
  }
}

module.exports = {
  Student,
  studentEvents,
  students: Student.students,
  addStudent: Student.addStudent,
  removeStudent: Student.removeStudent,
  getStudentById: Student.getStudentById,
  getStudentsByGroup: Student.getStudentsByGroup,
  getAllStudents: Student.getAllStudents,
  calculateAverageAge: Student.calculateAverageAge,
};
