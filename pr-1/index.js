/**
 * Главная точка входа приложения.
 * Выполняет:
 *   - разбор CLI аргументов (--verbose / --quiet)
 *   - создание логгера
 *   - создание репозитория
 *   - загрузку данных из файла
 *   - выполнение сервисных операций
 *   - сохранение данных обратно в JSON
 */

const Logger = require("./modules/logger/logger");
const StudentRepository = require("./modules/students/StudentRepository");

const services = require("./modules/students/services");

const args = process.argv.slice(2);
const isVerbose = args.includes("--verbose");
const isQuiet = args.includes("--quiet");

const logger = new Logger(isVerbose, isQuiet);
const repo = new StudentRepository();

repo.loadFromFile("modules/testdata/students.json");
logger.log("Students loaded.");

services.addStudent(repo, logger, "Alice", 22, 4);
services.getAllStudents(repo, logger);
services.getStudentsByGroup(repo, logger, 2);
services.calculateAverageAge(repo, logger);

repo.saveToFile("modules/testdata/students.json");
logger.log("Students saved to file.");
