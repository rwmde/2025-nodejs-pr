const express = require('express');
const path = require('path');

const StudentManager = require('../pr-1/task/StudentManager');
const Student = require('../pr-1/task/Student');
const BackupService = require('../pr-1/task/BackupService');
const EventObserver = require('../pr-1/task/EventObserver');
const Logger = require('../pr-1/task/Logger');

const DATA_FILE = path.join(__dirname, '..', 'pr-1', 'task', 'students.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

const logger = new Logger(true, false);
const manager = new StudentManager(logger);
const backupService = new BackupService(manager, logger);
new EventObserver(manager, backupService, logger);

(async () => {
    await manager.loadJSON(DATA_FILE);
})();

// Helper to generate a simple id
function generateId() {
    return (Date.now() + Math.random()).toString(36);
}

// Students collection routes
app.get('/api/students', (_, res) => {
    return res.json(manager.getAllStudents());
});

// Create new student
app.post('/api/students', (req, res) => {
    const { id, name, age, group } = req.body;
    if (!name || typeof age === 'undefined' || typeof group === 'undefined') {
        return res.status(400).json({ error: 'Missing required fields: name, age, group' });
    }

    const studentId = id || generateId();
    const student = new Student(String(studentId), name, Number(age), group);
    manager.addStudent(student);
    return res.status(201).json(student);
});

// Replace entire collection
app.put('/api/students', (req, res) => {
    const students = req.body;
    if (!Array.isArray(students)) {
        return res.status(400).json({ error: 'Expected an array of students' });
    }

    manager.students = students.map(s => new Student(String(s.id || generateId()), s.name, Number(s.age), s.group));
    return res.json(manager.getAllStudents());
});

// Get students by group
app.get('/api/students/group/:id', (req, res) => {
    const groupId = req.params.id;

    const students = manager.getStudentsByGroup(Number(groupId));
    return res.json(students);
});

// Get average age
app.get('/api/students/average-age', (_, res) => {
    const avg = manager.calculateAverageAge();
    return res.json({ averageAge: avg });
});

// Save data to JSON
app.post('/api/students/save', async (_, res) => {
    try {
        await manager.saveToJSON(DATA_FILE);
        return res.json({ message: 'Data saved', file: DATA_FILE });
    } catch (error) {
        logger.log('Error saving data:', error.message);
        return res.status(500).json({ error: 'Failed to save data' });
    }
});

// Load data from JSON
app.post('/api/students/load', async (_, res) => {
    try {
        await manager.loadJSON(DATA_FILE);
        return res.json({ message: 'Data loaded', students: manager.getAllStudents() });
    } catch (error) {
        logger.log('Error loading data via HTTP:', error.message);
        return res.status(500).json({ error: 'Failed to load data' });
    }
});

// Get student by id
app.get('/api/students/:id', (req, res) => {
    const student = manager.getStudentById(req.params.id);

    if (!student) return res.status(404).json({ error: 'Student not found' });
    return res.json(student);
});

// Update existing student by id
app.put('/api/students/:id', (req, res) => {
    const id = req.params.id;
    const existing = manager.getStudentById(id);
    if (!existing) return res.status(404).json({ error: 'Student not found' });

    const { name, age, group } = req.body;
    if (!name || typeof age === 'undefined' || typeof group === 'undefined') {
        return res.status(400).json({ error: 'Missing required fields: name, age, group' });
    }

    // Replace properties
    existing.name = name;
    existing.age = Number(age);
    existing.group = group;

    return res.json(existing);
});

// Delete student by id
app.delete('/api/students/:id', (req, res) => {
    const id = req.params.id;
    const existing = manager.getStudentById(id);
    if (!existing) return res.status(404).json({ error: 'Student not found' });

    manager.removeStudent(id);
    return res.json({ message: 'Student removed', id });
});


// Backup endpoints
app.post('/api/backup/start', (_, res) => {
    try {
        backupService.start();
        return res.json({ status: 'running' });
    } catch (error) {
        logger.log('Error starting backup:', error.message);
        return res.status(500).json({ error: 'Failed to start backup' });
    }
});

app.post('/api/backup/stop', (_, res) => {
    try {
        backupService.stop();
        return res.json({ status: 'stopped' });
    } catch (error) {
        logger.log('Error stopping backup:', error.message);
        return res.status(500).json({ error: 'Failed to stop backup' });
    }
});

app.get('/api/backup/status', (_, res) => {
    const running = !!backupService.intervalId;
    return res.json({ running });
});


// Error handler
app.use((err, _, res, __) => {
    logger.log('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Express server listening on http://localhost:${PORT}`);
});
