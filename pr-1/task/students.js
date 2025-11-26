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
    Student.students.push(
      new Student((Student.students.length + 1).toString(), name, age, grade)
    );
  }

  static removeStudent(id) {
    Student.students = Student.students.filter((student) => student.id !== id);
  }

  static getStudentById(id) {
    return Student.students.find((student) => student.id === id);
  }

  static getStudentsByGroup(group) {
    return Student.students.filter((student) => student.group === group);
  }

  static getAllStudents() {
    return Student.students;
  }

  static calculateAverageAge() {
    return (
      Student.students.reduce((sum, student) => sum + student.age, 0) /
      Student.students.length
    );
  }
}

module.exports = {
  Student,
};
