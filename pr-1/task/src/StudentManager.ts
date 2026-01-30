import fs from 'fs';
import { EventEmitter } from 'events';
import Student from './models/Student';
import { EVENTS } from './constants';
import { Logger } from './Logger';

export class StudentManager extends EventEmitter {
    logger: Logger;

    constructor(logger: Logger) {
        super();
        this.logger = logger;
    }

    async addStudent(studentData: any) {
        try {
            const student = await Student.create(studentData);
            this.emit(EVENTS.STUDENT_ADDED, student);
            return student;
        } catch (error: any) {
            this.logger.log('Error adding student:', error.message);
            throw error;
        }
    }

    async removeStudent(id: string) {
        try {
            const student = await Student.findByPk(id);
            if (student) {
                await student.destroy();
                this.emit(EVENTS.STUDENT_REMOVED, id);
                return true;
            }
            return false;
        } catch (error: any) {
            this.logger.log('Error removing student:', error.message);
            throw error;
        }
    }

    async getStudentById(id: string) {
        return await Student.findByPk(id);
    }

    async getStudentsByGroup(group: string) {
        return await Student.findAll({ where: { group } });
    }

    async getAllStudents() {
        return await Student.findAll();
    }

    async calculateAverageAge() {
        const students = await Student.findAll();
        if (students.length === 0) return 0;
        const totalAge = students.reduce((sum, student) => sum + student.age, 0);
        return totalAge / students.length;
    }

    async updateStudent(id: string, updateData: any) {
        try {
            const student = await Student.findByPk(id);
            if (student) {
                await student.update(updateData);
                return student;
            }
            return null;
        } catch (error: any) {
            this.logger.log('Error updating student:', error.message);
            throw error;
        }
    }

    async saveToJSON(filePath: string) {
        const students = await this.getAllStudents();
        const data = JSON.stringify(students, null, 2);
        await fs.promises.writeFile(filePath, data, 'utf8');
        this.emit(EVENTS.DATA_SAVED, filePath);
    }

    async loadJSON(filePath: string) {
        try {
            const data = await fs.promises.readFile(filePath, 'utf8');
            const parsedData = JSON.parse(data);

            for (const s of parsedData) {
                await Student.upsert(s);
            }

            this.emit(EVENTS.DATA_LOADED, filePath);
        } catch (error: any) {
            if (error.code !== 'ENOENT') { // Ignore missing file error
                if (this.logger) {
                    this.logger.log(`Error loading data from ${filePath}:`, error.message);
                }
            }
            // Do not reset to empty list, as we are in DB mode
        }
    }
    async replaceAllStudents(students: any[]) {
        try {
            await Student.destroy({ truncate: true, cascade: true, restartIdentity: true });
            const createdStudents = await Student.bulkCreate(students);
            this.emit(EVENTS.DATA_LOADED, 'API Bulk Replace'); // Using DATA_LOADED as a proxy for "mass update"
            return createdStudents;
        } catch (error: any) {
            this.logger.log('Error replacing all students:', error.message);
            throw error;
        }
    }
}
