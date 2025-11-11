// Student Management System

const {
  Student,
  addStudent,
  removeStudent,
  getStudentById,
  getStudentsByGroup,
  getAllStudents,
  calculateAverageAge,
} = require("./student");
const { Logger } = require("./logger");
const { saveToJSON, loadJSON } = require("./file-utils");

// Main script logic will go here.
const isVerbose = process.argv.includes("--verbose");
const isQuiet = process.argv.includes("--quiet");

const logger = new Logger(isVerbose, isQuiet);

logger.log("Initial students:", getAllStudents());

addStudent("Bahdan", 23, 4);
logger.log("Students after adding Bahdan:", getAllStudents());

removeStudent("4");
logger.log('Students after removing student with id "4":', getAllStudents());

logger.log("Average student age:", calculateAverageAge());
