const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {
    addStudent,
    removeStudent,
    getAllStudents,
    calculateAverageAge,
    loadStudents,
    getPlainStudents,
    getStudentById,
    getStudentsByGroup
} = require('./services/studentService');

const Logger = require('./services/logger');
const { saveToJSON, loadJSON } = require('./services/storage');
const BackupService = require('./services/backupService');
const { reportBackupStats } = require('./services/backupReporter');

const app = express();
const PORT = process.env.PORT || 3000;

const logger = new Logger({ verbose: false, quiet: false });

// Use JSON body parsing
app.use(express.json());

// Serve static frontend files from /public (CV page, css, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// --- Load data into memory on server start ---
(async () => {
    try {
        const loaded = await loadJSON();
        loadStudents(loaded);
        logger.log('Students loaded into memory', { count: loaded.length });
    } catch (err) {
        logger.log('Failed to load students on startup', { error: err.message });
    }
})();

// --- Backup service instance (reuse existing BackupService) ---
const backupService = new BackupService(getPlainStudents, {
    intervalMs: 30000, // default 30s
    backupDir: path.join(__dirname, 'backups'),
    logger: (msg, type = 'success') => {
        // For the server just log messages through Logger
        if (type === 'success') logger.log(`Backup success: ${msg}`);
        else if (type === 'failed') logger.log(`Backup failed: ${msg}`);
        else logger.log(msg);
    }
});

// --- API ROUTES ---

// Health / Hello world (task 1)
app.get('/', (req, res) => {
    // If public/index.html exists, express.static will serve it.
    // Otherwise return simple HTML for basic check.
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            // fallback simple HTML
            res.type('html').send('<h1>Hello World</h1>');
        }
    });
});

// 2. Display request details (simple route)
app.get('/request-info', (req, res) => {
    const info = {
        method: req.method,
        url: req.originalUrl,
        httpVersion: req.httpVersion,
        headers: req.headers,
        remoteAddress: req.ip
    };
    // Return as HTML (simple)
    const html = `
    <h1>Request Info</h1>
    <pre>${JSON.stringify(info, null, 2)}</pre>
  `;
    res.type('html').send(html);
});

// --- Students endpoints (RESTful) ---

// GET /api/students - get all students
app.get('/api/students', (req, res) => {
    res.json(getAllStudents());
});

// POST /api/students - add new student
app.post('/api/students', async (req, res) => {
    try {
        const payload = req.body;
        if (!payload || !payload.name) {
            return res.status(400).json({ error: 'Invalid student payload' });
        }
        const student = addStudent(payload);
        await saveToJSON(getPlainStudents());
        return res.status(201).json(student);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// PUT /api/students - replace whole collection
app.put('/api/students', async (req, res) => {
    try {
        const newArray = req.body;
        if (!Array.isArray(newArray)) return res.status(400).json({ error: 'Body must be an array' });
        // Use loadStudents to replace in-memory collection
        loadStudents(newArray);
        await saveToJSON(getPlainStudents());
        return res.status(200).json({ message: 'Students replaced', count: getAllStudents().length });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// GET /api/students/:id - get by id
app.get('/api/students/:id', (req, res) => {
    const student = getStudentById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
});

// PATCH /api/students/:id - update existing student by id
app.patch('/api/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const existing = getStudentById(id);
        if (!existing) return res.status(404).json({ error: 'Student not found' });

        // Simple update: allow name, age, group
        const { name, age, group } = req.body;
        if (name !== undefined) existing.name = name;
        if (age !== undefined) existing.age = age;
        if (group !== undefined) existing.group = group;

        await saveToJSON(getPlainStudents());
        res.json(existing);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/students/:id - remove existing student
app.delete('/api/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const removed = removeStudent(id);
        if (!removed) return res.status(404).json({ error: 'Student not found' });
        await saveToJSON(getPlainStudents());
        res.json({ message: 'Removed', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/students/group/:id - students by group id
app.get('/api/students/group/:id', (req, res) => {
    const group = req.params.id;
    res.json(getStudentsByGroup(group));
});

// GET /api/students/average-age - average age
app.get('/api/students/average-age', (req, res) => {
    res.json({ average: calculateAverageAge() });
});

// POST /api/students/save - save students to JSON
app.post('/api/students/save', async (req, res) => {
    try {
        await saveToJSON(getPlainStudents());
        res.json({ message: 'Saved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/students/load - load students from JSON (replaces in-memory)
app.post('/api/students/load', async (req, res) => {
    try {
        const loaded = await loadJSON();
        loadStudents(loaded);
        res.json({ message: 'Loaded', count: loaded.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Backup endpoints ---

// POST /api/backup/start
app.post('/api/backup/start', (req, res) => {
    try {
        backupService.start();
        res.json({ status: 'started' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/backup/stop
app.post('/api/backup/stop', (req, res) => {
    try {
        backupService.stop();
        res.json({ status: 'stopped' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/backup/status
app.get('/api/backup/status', (req, res) => {
    res.json({ running: !!backupService.intervalId });
});

// --- Backup reporter endpoint ---
app.get('/api/backup/report', async (req, res) => {
    try {
        // Reuse reporter function to return JSON instead of console.log
        const fs = require('fs').promises;
        const files = await fs.readdir(path.join(__dirname, 'backups')).catch(() => []);
        const backupFiles = files.filter(f => f.endsWith('.backup.json'));
        const dataArrays = await Promise.all(
            backupFiles.map(f => fs.readFile(path.join(__dirname, 'backups', f), 'utf8').then(JSON.parse))
        );
        const studentCountById = {};
        let totalStudents = 0;
        dataArrays.forEach(arr => {
            totalStudents += arr.length;
            arr.forEach(s => {
                studentCountById[s.id] = (studentCountById[s.id] || 0) + 1;
            });
        });
        const grouped = Object.entries(studentCountById).map(([id, amount]) => ({ id, amount }));
        const average = backupFiles.length ? (totalStudents / backupFiles.length) : 0;
        res.json({
            totalFiles: backupFiles.length,
            latestFile: backupFiles.sort().reverse()[0] || null,
            latestDate: backupFiles.length ? new Date(backupFiles.sort().reverse()[0].replace('.backup.json','')).toString() : null,
            grouped,
            average
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Start server ---
app.listen(PORT, () => {
    logger.log(`Server listening on port ${PORT}`);
});
