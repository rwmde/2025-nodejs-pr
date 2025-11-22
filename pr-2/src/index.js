const Logger = require('./logger').getInstance();
const argv = process.argv.slice(2);

Logger.setVerboseModeEnabled(argv.includes('--verbose') || argv.includes('-v'));
Logger.setQuietModeEnabled(argv.includes('--quiet') || argv.includes('-q'));

(() => {
    const student = require('./student');
    const repo = new student.repository();

    repo.addStudent(1, "Vlad", 22, 'LR-2022-JS2');
    repo.addStudent(2, "Kirill", 666, 'LR-2022-JS2');
    repo.addStudent(3, "Daria", 333, 'LR-2022-JS2');
    repo.addStudent(4, "Lena", 19, '634352');

    Logger.log(`Students found: `, repo.getAllStudents());

    repo.removeStudent(3);

    Logger.log(`Students found: `, repo.getAllStudents());
    Logger.log(`Average age: `, repo.calculateAverageAge());
    Logger.log(`Kirill with ID=2: `, repo.getStudentById(2));
    Logger.log(`Students for group [LR-2022-JS2]: `, repo.getStudentsByGroup('LR-2022-JS2'));
})();
