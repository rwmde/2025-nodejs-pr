const Student = require('./Student');

function demo(manager, logger) {
    //adding a new student
    const newStudent = new Student('4', 'Alice Wonderland', 19, 1);
    logger.log('Adding new student:', newStudent);
    manager.addStudent(newStudent);

    logger.log('All Students:', manager.getAllStudents());

    logger.log('Average Age:', manager.calculateAverageAge());

    const studentId = '1';
    const student = manager.getStudentById(studentId);
    if (student) {
        logger.log(`Student with ID ${studentId}:`, student);
    } else {
        logger.log(`Student with ID ${studentId} not found.`);
    }

    const group = 2;
    const studentsInGroup = manager.getStudentsByGroup(group);
    logger.log(`Students in group ${group}:`, studentsInGroup);
}

module.exports = demo 