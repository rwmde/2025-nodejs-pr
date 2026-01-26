import { DatabaseService } from '../../../shared/db-service';
import { Student } from '../../../shared/types';
import { Logger } from '../../../utils/logger';
const logger = new Logger();

export class StudentsService {
  constructor(private dbService: DatabaseService) {
    this.dbService.onModuleInit();
  }

  async getAllStudents(): Promise<Student[] | void> {
    try {
      const query = 'SELECT * FROM students';
      return this.dbService.query<Student>(query);
    } catch (error) {
      logger.log('Failed to retrieve students:', error);
    }
  }

  async addStudent(student: Student): Promise<boolean | void> {
    try {
      const { studentName, age, groupNumber } = student;
      const query = `
        INSERT INTO students (studentName, age, groupNumber)
        VALUES ('${studentName}', ${age}, ${groupNumber})
    `;
      await this.dbService.query(query);
      return true;
    } catch (error) {
      logger.log('Failed to add student:', error);
    }
  }

  async removeStudent(studentId: string): Promise<boolean | void> {
    try {
      const query = `DELETE FROM students WHERE studentId = ${studentId}`;
      await this.dbService.query(query);
      return true;
    } catch (error) {
      logger.log('Failed to remove student:', error);
    }
  }

  async getStudentById(studentId: string): Promise<Student | void> {
    try {
      const query = `SELECT * FROM students WHERE studentId = ${studentId}`;
      const results = await this.dbService.query<Student>(query);
      return results[0];
    } catch (error) {
      logger.log('Failed to retrieve student:', error);
    }
  }

  async getStudentsByGroup(groupNumber: number): Promise<Student[] | void> {
    try {
      const query = `SELECT * FROM students WHERE groupNumber = ${groupNumber}`;
      return this.dbService.query<Student>(query);
    } catch (error) {
      logger.log('Failed to retrieve students by group:', error);
    }
  }

  async updateStudent(
    studentId: string,
    student: Student
  ): Promise<Student | void> {
    try {
      const query = `
        UPDATE students
        SET studentName = '${student.studentName}', age = ${student.age}, groupNumber = ${student.groupNumber}
        WHERE studentId = ${studentId}
      `;
      await this.dbService.query(query);
      return this.getStudentById(studentId);
    } catch (error) {
      logger.log('Failed to update student:', error);
    }
  }

  async replaceAllStudents(students: Student[]): Promise<Student[] | void> {
    try {
      const deleteQuery = 'DELETE FROM students';
      await this.dbService.query(deleteQuery);

      for (const student of students) {
        await this.addStudent(student);
      }
      const allStudents = await this.getAllStudents();
      return allStudents;
    } catch (error) {
      logger.log('Failed to replace all students:', error);
    }
  }

  async calculateAverageAge(): Promise<number | void> {
    try {
      const query = 'SELECT AVG(age) as averageAge FROM students';
      const results = await this.dbService.query<{ averageAge: number }>(query);
      return results[0]?.averageAge;
    } catch (error) {
      logger.log('Failed to calculate average age:', error);
    }
  }
}
