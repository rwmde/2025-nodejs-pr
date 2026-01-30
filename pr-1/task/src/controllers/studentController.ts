import { Request, Response } from 'express';
import { StudentManager } from '../StudentManager';
import { Logger } from '../Logger';


export class StudentController {
    studentManager: StudentManager;
    logger: Logger;

    constructor() {
        this.logger = new Logger();
        this.studentManager = new StudentManager(this.logger);
    }

    getAllStudents = async (req: Request, res: Response) => {
        try {
            const students = await this.studentManager.getAllStudents();
            res.json(students);
        } catch (error) {
            this.logger.error('Error fetching students:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    getStudentById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const student = await this.studentManager.getStudentById(id);

            if (!student) {
                res.status(404).json({ error: 'Student not found' });
                return;
            }

            res.json(student);
        } catch (error) {
            this.logger.error('Error fetching student:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    createStudent = async (req: Request, res: Response) => {
        try {
            const newStudent = await this.studentManager.addStudent(req.body);
            res.status(201).json(newStudent);
        } catch (error) {
            this.logger.error('Error creating student:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    updateStudent = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const student = await this.studentManager.updateStudent(id, req.body);

            if (!student) {
                res.status(404).json({ error: 'Student not found' });
                return;
            }

            res.json(student);
        } catch (error) {
            this.logger.error('Error updating student:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    deleteStudent = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const success = await this.studentManager.removeStudent(id);

            if (!success) {
                res.status(404).json({ error: 'Student not found' });
                return;
            }

            res.status(204).send();
        } catch (error) {
            this.logger.error('Error deleting student:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    replaceAllStudents = async (req: Request, res: Response) => {
        try {
            const students = await this.studentManager.replaceAllStudents(req.body);
            res.status(201).json(students);
        } catch (error) {
            this.logger.error('Error replacing students:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    getStudentsByGroup = async (req: Request, res: Response) => {
        try {
            const group = req.params.group as string;
            const students = await this.studentManager.getStudentsByGroup(group);
            res.json(students);
        } catch (error) {
            this.logger.error('Error fetching students by group:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    getAverageAge = async (req: Request, res: Response) => {
        try {
            const averageAge = await this.studentManager.calculateAverageAge();
            res.json({ averageAge });
        } catch (error) {
            this.logger.error('Error calculating average age:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}
