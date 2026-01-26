import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import { connectDB } from './db/db';
import { Student } from './models/Student';
import { studentSchema } from './validators/studentValidator';
import authRoutes from './routes/authRoutes';
import { authMiddleware } from './middleware/authMiddleware';
import { roleMiddleware } from './middleware/roleMiddleware';
import dotenv from 'dotenv';
import expressStatusMonitor from 'express-status-monitor';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { logInfo, logError } from './logger/logger';

dotenv.config();

const app = express();
app.use(express.json());

// Monitoring
app.use(expressStatusMonitor());

// Simple request logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  logInfo(`Request: ${req.method} ${req.url}`);
  next();
});

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Students & Users API',
      version: '1.0.0',
      description: 'API for managing students'
    },
    servers: [
      { url: 'http://localhost:' + (process.env.PORT || 3000) }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ]
  },
  // где искать аннотации @openapi
  apis: ['src/server.ts']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = Number(process.env.PORT) || 3000;

// Connect to database
connectDB();

/**
 * @openapi
 * /api/students:
 *   get:
 *     summary: Get all students
 *     responses:
 *       200:
 *         description: List of students
 */
app.get('/api/students', async (_req: Request, res: Response) => {
  const students = await Student.findAll();
  res.json(students);
});

/**
 * @openapi
 * /api/students/{id}:
 *   get:
 *     summary: Get student by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student
 *       404:
 *         description: Not found
 */
app.get('/api/students/:id', async (req: Request, res: Response) => {
  const student = await Student.findByPk(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

/**
 * @openapi
 * /api/students:
 *   post:
 *     summary: Create new student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               age: { type: number }
 *               group: { type: string }
 *     responses:
 *       200:
 *         description: Created student
 *       400:
 *         description: Validation error
 */
app.post('/api/students', async (req: Request, res: Response) => {
  try {
    const { error } = studentSchema.validate(req.body);
    if (error) {
      logError(`Student create validation error: ${error.details[0].message}`);
      return res.status(400).json({ error: error.details[0].message });
    }
    const student = await Student.create(req.body);
    res.json(student);
  } catch (err: any) {
    logError(`Student create error: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

/**
 * @openapi
 * /api/students/{id}:
 *   put:
 *     summary: Update student
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               age: { type: number }
 *               group: { type: string }
 *     responses:
 *       200:
 *         description: Updated student
 *       404:
 *         description: Not found
 *       400:
 *         description: Validation error
 */
app.put('/api/students/:id', async (req: Request, res: Response) => {
  const student = await Student.findByPk(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const { error } = studentSchema.validate(req.body);
  if (error) {
    logError(`Student update validation error: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  await student.update(req.body);
  res.json(student);
});

/**
 * @openapi
 * /api/students/{id}:
 *   delete:
 *     summary: Delete student
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
app.delete('/api/students/:id', async (req: Request, res: Response) => {
  const student = await Student.findByPk(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  await student.destroy();
  res.json({ message: 'Student deleted' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Protected examples
app.get('/api/students-protected', authMiddleware, async (_req, res) => {
  res.json(await Student.findAll());
});

app.post(
    '/api/students-protected',
    authMiddleware,
    roleMiddleware(['admin', 'teacher']),
    async (req, res) => {
      const student = await Student.create(req.body);
      res.json(student);
    }
);


// User registration and login

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     description: Creates a new user with name, surname, email, password and roleId.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               surname: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               roleId: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates user by email and password, returns JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: JWT token returned
 *       400:
 *         description: Invalid credentials
 */

/**
 * @openapi
 * /api/students:
 *   get:
 *     summary: Get all students
 *     responses:
 *       200:
 *         description: List of students
 *   post:
 *     summary: Create new student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               age: { type: number }
 *               group: { type: string }
 *     responses:
 *       200:
 *         description: Created student
 *       400:
 *         description: Validation error
 */

/**
 * @openapi
 * /api/students/{id}:
 *   get:
 *     summary: Get student by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Student object
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update student
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               age: { type: number }
 *               group: { type: string }
 *     responses:
 *       200:
 *         description: Updated student
 *       404:
 *         description: Not found
 *       400:
 *         description: Validation error
 *   delete:
 *     summary: Delete student
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */

/**
 * @openapi
 * /api/students-protected:
 *   get:
 *     summary: Get all students (protected)
 *     description: Requires JWT token in Authorization header.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 *   post:
 *     summary: Create student (protected)
 *     description: Requires JWT token and role admin/teacher.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               age: { type: number }
 *               group: { type: string }
 *     responses:
 *       200:
 *         description: Created student
 *       403:
 *         description: Forbidden
 */

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logError(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => logInfo(`Server running at http://localhost:${PORT}`));

export default app; // for tests
