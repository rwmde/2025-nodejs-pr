
const Student = require('../models/Student');

const students = [];

/**
 * Add a new student
 */
function addStudent({ name, age, group }) {
    const id = Date.now().toString();
    const student = new Student(id, name, age, group);
    students.push(student);
    return student;
}

/**
 * Get all students
 */
function getAllStudents() {
    return students;
}

/**
 * Load students from array of objects
 */
function loadStudents(array) {
    if (!Array.isArray(array)) return;
    students.length = 0;
    array.forEach(obj => {
        students.push(new Student(obj.id, obj.name, obj.age, obj.group));
    });
}

/**
 * Get student by ID
 */
function getStudentById(id) {
    return students.find(s => s.id === id) || null;
}

/**
 * Remove student by ID
 */
function removeStudent(id) {
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) return false;
    students.splice(idx, 1);
    return true;
}

/**
 * Convert all students to plain objects for JSON
 */
function getPlainStudents() {
    return students.map(s => ({ id: s.id, name: s.name, age: s.age, group: s.group }));
}

module.exports = {
    addStudent,
    getAllStudents,
    loadStudents,
    getPlainStudents,
    getStudentById,
    removeStudent
};
