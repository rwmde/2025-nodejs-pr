import { StudentManager } from './StudentManager';
import { Logger } from './Logger';
import Student from './models/Student';

export async function demo(manager: StudentManager, logger: Logger) {
    //adding a new student
    const newStudentData = { name: 'Alice Wonderland', age: 19, group: '1' };
    logger.log('Adding new student:', newStudentData);
    await manager.addStudent(newStudentData);

    logger.log('All Students:', await manager.getAllStudents());

    logger.log('Average Age:', await manager.calculateAverageAge());

    const studentId = 1;
    const student = await manager.getStudentById(studentId);
    if (student) {
        logger.log(`Student with ID ${studentId}:`, student);
    } else {
        logger.log(`Student with ID ${studentId} not found.`);
    }

    const group = '2';
    const studentsInGroup = await manager.getStudentsByGroup(group);
    logger.log(`Students in group ${group}:`, studentsInGroup);
}