import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { connectDB } from './db/db';
import { Student } from './models/Student';
import { studentSchema } from './validators/studentValidator';
import authRoutes from './routes/authRoutes';
import { authMiddleware } from './middleware/authMiddleware';
import { roleMiddleware } from './middleware/roleMiddleware';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Connect to database
connectDB();

// --- STUDENTS API ---
// Get all students
app.get('/api/students', async (req: Request, res: Response) => {
  const students = await Student.findAll();
  res.json(students);
});

// Get student by id
app.get('/api/students/:id', async (req: Request, res: Response) => {
  const student = await Student.findByPk(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

// Create new student
app.post('/api/students', async (req: Request, res: Response) => {
  try {
    const { error } = studentSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const student = await Student.create(req.body);
    res.json(student);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Update existing student
app.put('/api/students/:id', async (req: Request, res: Response) => {
  const student = await Student.findByPk(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const { error } = studentSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  await student.update(req.body);
  res.json(student);
});

// Delete student
app.delete('/api/students/:id', async (req: Request, res: Response) => {
  const student = await Student.findByPk(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  await student.destroy();
  res.json({ message: 'Student deleted' });
});

// --- START SERVER ---
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));


app.use('/api/auth', authRoutes);

app.get('/api/students', authMiddleware, async (req, res) => {
  res.json(await Student.findAll());
});

app.post(
    '/api/students',
    authMiddleware,
    roleMiddleware(['admin', 'teacher']),
    async (req, res) => {
      const student = await Student.create(req.body);
      res.json(student);
    }
);

