// Student Management System

const { Student } = require('./students');

const { Logger } = require('./logger');

const { loadJSON, saveToJSON } = require('./utils');

const logger = new Logger();

addStudent('Alice Brown', 22, 3);
logger.log('Average Age:', Student.calculateAverageAge());
logger.log('Student with ID 2:', Student.getStudentById('2'));
logger.log('Students in Group 2:', Student.getStudentsByGroup(2));
Student.removeStudent('1');
logger.log('All Students after removal:', Student.getAllStudents());

const AllStudents = Student.getAllStudents();
saveToJSON(AllStudents, './students.json');
const loadedStudents = loadJSON('./students.json');
logger.log('All Students:', loadedStudents);
