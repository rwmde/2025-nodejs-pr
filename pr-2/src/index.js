const Logger = require('./logger').getInstance();
const argv = process.argv.slice(2);
const student = require('./student');
const BackupService = require('./backup-service');

Logger.setVerboseModeEnabled(argv.includes('--verbose') || argv.includes('-v'));
Logger.setQuietModeEnabled(argv.includes('--quiet') || argv.includes('-q'));

async function main() {
    try {
        const studentRepository = new student.repository();
        studentRepository.on('add', (student) => Logger.log(`Added student ${student.name}: `, student));
        studentRepository.on('remove', (student) => Logger.log(`Removed student "${student.name}" with ID ${student.id}`));

        const backupService = new BackupService(async () => await studentRepository.getAllStudents(), 5000, 'backups');
        backupService.start();
        backupService.on('backup-completed', () => Logger.log(`We got the event 'backup-completed' *_*`));
        backupService.on('backup-error', () => Logger.log(`We got the event 'backup-error' *_*`));

        await studentRepository.addStudent(1, "Vlad", 22, 'LR-2022-JS2');
        await studentRepository.addStudent(2, "Kirill", 666, 'LR-2022-JS2');
        await studentRepository.addStudent(3, "Daria", 333, 'LR-2022-JS2');
        await studentRepository.addStudent(4, "Lena", 19, '634352');

        Logger.log(`Students found: `, await studentRepository.getAllStudents());

        await studentRepository.removeStudent(3);

        Logger.log(`Students found: `, await studentRepository.getAllStudents());
        Logger.log(`Average age: `, await studentRepository.calculateAverageAge());
        Logger.log(`Kirill with ID=2: `, await studentRepository.getStudentById(2));
        Logger.log(`Students for group [LR-2022-JS2]: `, await studentRepository.getStudentsByGroup('LR-2022-JS2'));

        setTimeout(async () => {
            await studentRepository.addStudent(5, "Anna", 25, 'LR-2022-JS2');
            Logger.log('Added Anna during runtime');
        }, 7000);

        setTimeout(async () => {
            await studentRepository.addStudent(6, "Peter", 30, '634352');
            Logger.log('Added Peter during runtime');
        }, 15000);

        setTimeout(async () => {
            backupService.stop();

            Logger.lyrics('Now it\'s stopped. Oh my lord');
            process.exit(0);
        }, 30000);

    } catch (error) {
        Logger.error('Error occurred:', error);
        process.exit(1);
    }
}

main().then(() => {
    Logger.lyrics("Thanks for checking my program ;)");
    setTimeout( () => Logger.lyrics("But wait, why it is not finished ?!??!?!?"), 2000);
    setTimeout( () => Logger.lyrics("Oh, tasks are still in the queue ^_^"), 7100);
    setTimeout( () => Logger.lyrics("And why it is not stopping now !??!?!?!"), 15800);
    setTimeout( () => Logger.lyrics("..."), 16000);
    setTimeout( () => Logger.lyrics(".............."), 17000);
    setTimeout( () => Logger.lyrics("Loading"), 17000);
    setTimeout( () => Logger.lyrics("?_?"), 18000);
    setTimeout( () => Logger.lyrics("0_0"), 19000);
    setTimeout( () => Logger.lyrics("Oh, backup interval is still working:))))"), 20100);
}).catch(() => {
    Logger.lyrics("Oops, that was not planned ^_^\nForgive me 9_0");
});
