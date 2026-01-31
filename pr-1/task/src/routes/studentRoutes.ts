import express from 'express';
import { StudentController } from '../controllers/studentController';
import { validateStudent, validateUpdateStudent } from '../middleware/validation';

const router = express.Router();
const studentController = new StudentController();

// GET /api/students/average-age - Calculate average age
router.get('/average-age', studentController.getAverageAge);

// GET /api/students/group/:group - Get students by group
router.get('/group/:group', studentController.getStudentsByGroup);

// GET /api/students - Get all students
router.get('/', studentController.getAllStudents);

// GET /api/students/:id - Get student by ID
router.get('/:id', studentController.getStudentById);

// POST /api/students - Create new student
router.post('/', validateStudent, studentController.createStudent);

// PUT /api/students/:id - Update student
router.put('/:id', validateUpdateStudent, studentController.updateStudent);

// PUT /api/students - Replace all students
router.put('/', studentController.replaceAllStudents);

// DELETE /api/students/:id - Delete student
router.delete('/:id', studentController.deleteStudent);

export default router;
