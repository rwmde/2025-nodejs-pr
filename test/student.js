class Student {
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
}

const { saveToJSON, loadJSON } = require("./file-utils");
const STUDENTS_FILE_PATH = "students.json";

let students = [];

/**
 * Loads students from the JSON file and transforms them into Student objects.
 */
function loadStudents() {
  try {
    const studentsData = loadJSON(STUDENTS_FILE_PATH);
    if (Array.isArray(studentsData)) {
      students = studentsData.map(
        (s) => new Student(s.id, s.name, s.age, s.group)
      );
    } else {
      // If the file contains an object or is otherwise malformed, default to an empty array.
      students = [];
    }
  } catch (error) {
    // If the file doesn't exist, start with an empty array.
    if (error.code === "ENOENT") {
      students = [];
    } else {
      throw error;
    }
  }
}

/**
 * Saves the current list of students to the JSON file.
 */
function saveStudents() {
  saveToJSON(students, STUDENTS_FILE_PATH);
}

function addStudent(name, age, group) {
  const id = (students.length + 1).toString();
  const student = new Student(id, name, age, group);
  students.push(student);
  saveStudents();
  return student;
}

function removeStudent(id) {
  const index = students.findIndex((s) => s.id === id);
  if (index !== -1) {
    const removed = students.splice(index, 1)[0];
    saveStudents();
    return removed;
  }
  return null;
}

function getStudentById(id) {
  return students.find((s) => s.id === id);
}

function getStudentsByGroup(group) {
  return students.filter((s) => s.group === group);
}

function getAllStudents() {
  return students;
}

function calculateAverageAge() {
  if (students.length === 0) {
    return 0;
  }
  const totalAge = students.reduce((sum, s) => sum + s.age, 0);
  return totalAge / students.length;
}

// Load students at startup
loadStudents();

module.exports = {
  Student,
  addStudent,
  removeStudent,
  getStudentById,
  getStudentsByGroup,
  getAllStudents,
  calculateAverageAge,
  loadStudents,
  saveStudents,
};
