// Student Management System

const {
  Student,
  addStudent,
  calculateAverageAge,
  getAllStudents,
  getStudentById,
  getStudentsByGroup,
  removeStudent,
} = require('./students');

const { Logger } = require('./logger');

const { loadJSON, saveToJSON } = require('./utils');

const logger = new Logger();

addStudent('Alice Brown', 22, 3);
logger.log('Average Age:', calculateAverageAge());
logger.log('Student with ID 2:', getStudentById('2'));
logger.log('Students in Group 2:', getStudentsByGroup(2));
removeStudent('1');
logger.log('All Students after removal:', getAllStudents());

const AllStudents = getAllStudents();
saveToJSON(AllStudents, './students.json');
const loadedStudents = loadJSON('./students.json');
logger.log('All Students:', loadedStudents);
