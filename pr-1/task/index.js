// index.js
const {
  addStudent,
  removeStudent,
  getStudentById,
  getStudentsByGroup,
  getAllStudents,
  calculateAverageAge,
  loadStudents,
  getPlainStudents
} = require('./services/studentService');

const Logger = require('./services/logger');
const { saveToJSON, loadJSON } = require('./services/storage');

// --- Parse CLI arguments ---
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const quiet = args.includes('--quiet');

const logger = new Logger({ verbose, quiet });

// --- Load students from JSON ---
const loaded = loadJSON();
loadStudents(loaded);
logger.log('Loaded students from JSON', { count: loaded.length });

// --- CLI commands ---
if (args.includes('--list')) {
  const all = getAllStudents();
  logger.log('All students:', all);
}

if (args.includes('--average')) {
  const avg = calculateAverageAge();
  logger.log(`Average age of students: ${avg}`);
}

const addIdx = args.indexOf('--add');
if (addIdx !== -1 && args[addIdx + 1]) {
  try {
    const obj = JSON.parse(args[addIdx + 1]);
    const student = addStudent(obj);
    saveToJSON(getPlainStudents());
    logger.log('Added new student:', student);
  } catch (err) {
    logger.log('Error parsing JSON for --add', { error: err.message });
  }
}

const removeIdx = args.indexOf('--remove');
if (removeIdx !== -1 && args[removeIdx + 1]) {
  const id = args[removeIdx + 1];
  const result = removeStudent(id);
  saveToJSON(getPlainStudents());
  logger.log(result ? `Removed student ${id}` : `Student ${id} not found`);
}


// Add a student:
// node index.js --add '{"name":"Anna","age":21,"group":"A1"}'

// List all students:
// node index.js --list

//  Show average age:
// node index.js --average

// Remove student by ID:
// node index.js --remove <id>

// Enable verbose logging:
// node index.js --verbose --list
