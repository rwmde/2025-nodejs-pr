import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import statusMonitor from 'express-status-monitor';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger/swaggerSpec';
import { saveToJSON, loadJSON } from './utils/common';
import { BackupManager } from './shared/backup';
import { StudentsService } from './useCases/students/services/students-service';
import { DatabaseService } from './shared/db-service';
import {
  CreateStudentSchema,
  UpdateStudentSchema,
  ReplaceStudentsSchema,
  GroupIdParamSchema,
  StudentIdParamSchema,
} from './useCases/students/models';
import { validate } from './useCases/students/middleware/validateStudent';
import { UserService } from './useCases/user-flow/user.service';
import { User } from './shared/types';
import {
  LoginSchema,
  UserRegistrationSchema,
} from './useCases/user-flow/models';
import {
  authenticate,
  requireRole,
} from './useCases/user-flow/middleware/auth';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(compression());

app.use('/status', authenticate, requireRole(['admin', 'moderator']));
app.use(statusMonitor());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

const router = express.Router();

const studentsService = new StudentsService(new DatabaseService());
const userService = new UserService(new DatabaseService());

const backupManager = new BackupManager(
  () => {
    let students: any[] = [];
    studentsService
      .getAllStudents()
      .then((result) => {
        students = result || [];
      })
      .catch(() => {
        students = [];
      });
    return students;
  },
  60000, // 1 minute interval
  './backups',
);

/**
 * GET /students - Retrieve all students
 */
router.get(
  '/students',
  authenticate,
  requireRole(['student']),
  async (req, res) => {
    try {
      const students = await studentsService.getAllStudents();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
);

/**
 * POST /students - Create a new student
 */
router.post(
  '/students',
  authenticate,
  requireRole(['teacher', 'admin']),
  validate(CreateStudentSchema, 'body'),
  async (req, res) => {
    try {
      const { studentName, age, groupNumber } = req.body;
      const success = await studentsService.addStudent({
        age,
        studentName,
        groupNumber,
      });
      if (success) {
        res.status(201).json({ message: 'Student created successfully' });
      }
      return;
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
);

/**
 * PUT /students - Replace all students with provided data
 */

router.put(
  '/students',
  authenticate,
  requireRole(['admin']),
  validate(ReplaceStudentsSchema, 'body'),
  async (req, res) => {
    try {
      const students = req.body;
      const newStudents = await studentsService.replaceAllStudents(students);
      res.status(200).json(newStudents);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
);

/**
 * GET /students/average-age - Calculate and return the average age of all students
 */
router.get(
  '/students/average-age',
  authenticate,
  requireRole(['teacher', 'admin']),
  async (req, res) => {
    try {
      const averageAge = await studentsService.calculateAverageAge();
      res.status(200).json({ averageAge });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
);

/**
 * GET /students/group/:id - Retrieve students by group ID
 */
router.get(
  '/students/group/:id',
  authenticate,
  requireRole(['teacher', 'admin']),
  validate(GroupIdParamSchema, 'params'),
  async (req, res) => {
    try {
      const students = await studentsService.getStudentsByGroup(+req.params.id);
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
);

/**
 * GET /students/:id - Retrieve a specific student by ID
 */
router.get(
  '/students/:id',
  authenticate,
  requireRole(['teacher', 'admin', 'student']),
  validate(StudentIdParamSchema, 'params'),
  async (req, res) => {
    try {
      const student = await studentsService.getStudentById(req.params.id);
      if (student) {
        res.status(200).json(student);
      } else {
        res.status(404).json({ message: 'Student not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
);

/**
 * PUT /students/:id - Update a specific student by ID
 */
router.put(
  '/students/:id',
  authenticate,
  requireRole(['teacher', 'admin']),
  validate(StudentIdParamSchema, 'params'),
  validate(UpdateStudentSchema, 'body'),
  async (req, res) => {
    try {
      const { studentName, age, groupNumber } = req.body;
      const updatedStudent = await studentsService.updateStudent(
        req.params.id,
        { studentName, age, groupNumber },
      );

      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.status(200).json(updatedStudent);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
);

/**
 * DELETE /students/:id - Delete a specific student by ID
 */
router.delete(
  '/students/:id',
  authenticate,
  requireRole(['admin']),
  validate(StudentIdParamSchema, 'params'),
  async (req, res) => {
    try {
      const success = await studentsService.removeStudent(req.params.id);
      if (success) {
        res.status(204).json({ message: 'Student deleted successfully' });
      } else {
        res.status(404).json({ message: 'Student not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
);

/**
 * POST /students/save - Save all students to JSON file
 */
router.post(
  '/students/save',
  authenticate,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const students = await studentsService.getAllStudents();
      await saveToJSON(students, './students.json');
      res.status(201).json({ message: 'Students saved to file' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
);

/**
 * GET /students/load - Load students from JSON file
 */
router.post(
  '/students/load',
  authenticate,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const students = await loadJSON('./students.json');
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
);

/**
 * POST /backup/start - Start the backup mechanism
 */
router.post(
  '/backup/start',
  authenticate,
  requireRole(['admin']),
  async (req, res) => {
    try {
      if (backupManager.isRunning) {
        return res.status(400).json({ message: 'Backup is already running' });
      }
      await backupManager.start();
      res.status(200).json({ message: 'Backup started successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to start backup', error });
    }
  },
);

/**
 * POST /backup/stop - Stop the backup mechanism
 */
router.post(
  '/backup/stop',
  authenticate,
  requireRole(['admin']),
  async (req, res) => {
    try {
      if (!backupManager.isRunning) {
        return res.status(400).json({ message: 'Backup is not running' });
      }
      backupManager.stop();
      res.status(200).json({ message: 'Backup stopped successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to stop backup', error });
    }
  },
);

/**
 * GET /backup/status - Get the current status of the backup mechanism
 */
router.get(
  '/backup/status',
  authenticate,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const status = backupManager.isBackupInProgress ? 'running' : 'stopped';
      res.status(200).json({ status });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get backup status', error });
    }
  },
);

router.post(
  '/user/registration',
  validate(UserRegistrationSchema, 'body'),
  async (req, res) => {
    try {
      const { name, surname, email, password } = req.body ?? {};

      const success = await userService.registerUser({
        name,
        surname,
        email,
        password,
      } as User);

      if (success) {
        res.status(201).json({ message: 'User registered successfully' });
      } else {
        res.status(400).json({ message: 'User registration failed' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  },
);

router.post('/user/login', authenticate, async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    const result = await userService.loginUser({ email, password });

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ message: 'User login failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

app.use('/api', router);

export { app };

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\nServer is running on http://localhost:${PORT}`);
    console.log(
      `Monitoring dashboard available at http://localhost:${PORT}/status`,
    );
    console.log(
      `API documentation available at http://localhost:${PORT}/api-docs\n`,
    );
  });
}
