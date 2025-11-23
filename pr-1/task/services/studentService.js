// services/studentService.js
const Student = require('../models/Student');

// Array to store all student instances
const students = [];

/**
 * Add a new student
 * @param {{name: string, age: number, group: string|number}} studentData
 * @returns {Student}
 */
function addStudent({ name, age, group }) {
    const id = Date.now().toString(); // simple unique ID
    const student = new Student(id, name, age, group);
    students.push(student);
    return student;
}

/**
 * Remove a student by ID
 * @param {string} id
 * @returns {boolean} true if removed, false if not found
 */
function removeStudent(id) {
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) return false;
    students.splice(idx, 1);
    return true;
}

/**
 * Get a student by ID
 * @param {string} id
 * @returns {Student|null}
 */
function getStudentById(id) {
    return students.find(s => s.id === id) || null;
}

/**
 * Get all students from a specific group
 * @param {string|number} group
 * @returns {Student[]}
 */
function getStudentsByGroup(group) {
    return students.filter(s => s.group === group);
}

/**
 * Get all students
 * @returns {Student[]}
 */
function getAllStudents() {
    return students;
}

/**
 * Calculate average age of all students
 * @returns {number}
 */
function calculateAverageAge() {
    if (students.length === 0) return 0;
    const total = students.reduce((sum, s) => sum + s.age, 0);
    return total / students.length;
}

/**
 * Load students from plain object array
 * @param {Array} array
 */
function loadStudents(array) {
    students.length = 0; // clear existing
    array.forEach(obj => {
        students.push(new Student(obj.id, obj.name, obj.age, obj.group));
    });
}

/**
 * Convert all students to plain objects for JSON storage
 * @returns {Array}
 */
function getPlainStudents() {
    return students.map(s => ({
        id: s.id,
        name: s.name,
        age: s.age,
        group: s.group
    }));
}

module.exports = {
    students,
    addStudent,
    removeStudent,
    getStudentById,
    getStudentsByGroup,
    getAllStudents,
    calculateAverageAge,
    loadStudents,
    getPlainStudents
};
