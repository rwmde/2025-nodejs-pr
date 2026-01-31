import express from 'express';
import { Student } from '../entities/students.js';
import { saveToJSON, loadJSON } from '../utils/common';
import { BackupManager } from '../services/backup.js';

const app = express();
const PORT = 3000;

app.use(express.json());

const router = express.Router();

const backupManager = new BackupManager(
  () => Student.getAllStudents(),
  60000, // 1 minute interval
  './backups'
);

/**
 * GET /students - Retrieve all students
 */
router.get('/students', async (req, res) => {
  try {
    const students = Student.getAllStudents();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

/**
 * POST /students - Create a new student
 */
router.post('/students', async (req, res) => {
  try {
    const { name, age, group } = req.body;
    const newStudent = Student.addStudent(name, age, group);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

/**
 * PUT /students - Replace all students with provided data
 */
router.put('/students', async (req, res) => {
  try {
    const students = req.body;
    Student.students = students;
    res.status(200).json(Student.getAllStudents());
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

/**
 * GET /students/average-age - Calculate and return the average age of all students
 */
router.get('/students/average-age', async (req, res) => {
  try {
    const averageAge = Student.calculateAverageAge();
    res.status(200).json({ averageAge });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

/**
 * GET /students/group/:id - Retrieve students by group ID
 */
router.get('/students/group/:id', async (req, res) => {
  try {
    const students = Student.getStudentsByGroup(+req.params.id);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

/**
 * GET /students/:id - Retrieve a specific student by ID
 */
router.get('/students/:id', async (req, res) => {
  try {
    const student = Student.getStudentById(req.params.id);
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

/**
 * PUT /students/:id - Update a specific student by ID
 */
router.put('/students/:id', async (req, res) => {
  try {
    const { name, age, group } = req.body;
    const updatedStudent = Student.updateStudent(
      req.params.id,
      name,
      age,
      group
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

/**
 * DELETE /students/:id - Delete a specific student by ID
 */
router.delete('/students/:id', async (req, res) => {
  try {
    const success = Student.removeStudent(req.params.id);
    if (success) {
      res.status(204).json({ message: 'Student deleted successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

/**
 * POST /students/save - Save all students to JSON file
 */
router.post('/students/save', async (req, res) => {
  try {
    const students = Student.getAllStudents();
    await saveToJSON(students, './students.json');
    res.status(201).json({ message: 'Students saved to file' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

/**
 * GET /students/load - Load students from JSON file
 */
router.post('/students/load', async (req, res) => {
  try {
    const students = await loadJSON('./students.json');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

/**
 * POST /backup/start - Start the backup mechanism
 */
router.post('/backup/start', async (req, res) => {
  try {
    if (backupManager.isRunning) {
      return res.status(400).json({ message: 'Backup is already running' });
    }
    await backupManager.start();
    res.status(200).json({ message: 'Backup started successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start backup', error });
  }
});

/**
 * POST /backup/stop - Stop the backup mechanism
 */
router.post('/backup/stop', async (req, res) => {
  try {
    if (!backupManager.isRunning) {
      return res.status(400).json({ message: 'Backup is not running' });
    }
    backupManager.stop();
    res.status(200).json({ message: 'Backup stopped successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to stop backup', error });
  }
});

/**
 * GET /backup/status - Get the current status of the backup mechanism
 */
router.get('/backup/status', async (req, res) => {
  try {
    const status = backupManager.isBackupInProgress ? 'running' : 'stopped';
    res.status(200).json({ status });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get backup status', error });
  }
});

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
