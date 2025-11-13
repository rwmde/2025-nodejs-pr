const Logger = require("./modules/logger/logger");
const StudentRepository = require("./modules/students/StudentRepository");

const addStudent = require("./modules/students/services/addStudent");
const removeStudent = require("./modules/students/services/removeStudent");
const getStudentById = require("./modules/students/services/getStudentById");
const getStudentsByGroup = require("./modules/students/services/getStudentsByGroup");
const getAllStudents = require("./modules/students/services/getAllStudents");
const calculateAverageAge = require("./modules/students/services/calculateAverageAge");

const args = process.argv.slice(2);
const isVerbose = args.includes("--verbose");
const isQuiet = args.includes("--quiet");

const logger = new Logger(isVerbose, isQuiet);
const repo = new StudentRepository();

repo.loadFromFile("modules/testdata/students.json");
logger.log("Students loaded.");

addStudent(repo, logger, "Alice", 22, 4);
getAllStudents(repo, logger);
getStudentsByGroup(repo, logger, 2);
calculateAverageAge(repo, logger);

repo.saveToFile("modules/testdata/students.json");
logger.log("Students saved to file.");
