
const http = require('http');
const url = require('url');
const { addStudent, getAllStudents, loadStudents, getPlainStudents, getStudentById, removeStudent } = require('./services/studentService');
const { saveToJSON, loadJSON } = require('./services/storage');
const BackupService = require('./services/backupService');

// Simple logger
function logger(msg, type = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type}] ${msg}`);
}

// Calculate average age
function calculateAverageAge() {
    const all = getAllStudents();
    if (!all.length) return 0;
    const sum = all.reduce((acc, s) => acc + s.age, 0);
    return sum / all.length;
}

// Get students by group
function getStudentsByGroup(groupId) {
    return getAllStudents().filter(s => s.group === groupId);
}

// Initialize students
async function initStudents() {
    const data = await loadJSON();
    loadStudents(data);
    logger(`Loaded ${getAllStudents().length} students`);
}

initStudents();

// Initialize backup service
const backupService = new BackupService(getPlainStudents, { intervalMs: 10000, logger });

// Create HTTP server
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const pathname = parsedUrl.pathname;

    res.setHeader('Content-Type', 'application/json');

    // Root
    if (pathname === '/' && method === 'GET') {
        res.writeHead(200);
        return res.end(JSON.stringify({ message: 'Hello, Student Management System! Use /api/students or /api/backup' }));
    }

    // --- STUDENTS API ---
    if (pathname.startsWith('/api/students')) {
        try {
            // GET /api/students
            if (pathname === '/api/students' && method === 'GET') {
                return res.end(JSON.stringify(getAllStudents()));
            }

            // GET /api/students/:id
            const studentIdMatch = pathname.match(/^\/api\/students\/([^/]+)$/);
            if (studentIdMatch && method === 'GET') {
                const student = getStudentById(studentIdMatch[1]);
                return res.end(JSON.stringify(student || { error: 'Student not found' }));
            }

            // GET /api/students/group/:id
            const groupMatch = pathname.match(/^\/api\/students\/group\/([^/]+)$/);
            if (groupMatch && method === 'GET') {
                const groupStudents = getStudentsByGroup(groupMatch[1]);
                return res.end(JSON.stringify(groupStudents));
            }

            // GET /api/students/average-age
            if (pathname === '/api/students/average-age' && method === 'GET') {
                const avg = calculateAverageAge();
                return res.end(JSON.stringify({ averageAge: avg }));
            }

            // POST /api/students - add student
            if (pathname === '/api/students' && method === 'POST') {
                let body = '';
                req.on('data', chunk => { body += chunk; });
                req.on('end', async () => {
                    try {
                        const obj = JSON.parse(body);
                        const student = addStudent(obj);
                        await saveToJSON(getPlainStudents());
                        return res.end(JSON.stringify(student));
                    } catch (err) {
                        res.writeHead(400);
                        return res.end(JSON.stringify({ error: 'Invalid JSON' }));
                    }
                });
                return;
            }

            // PUT /api/students - replace all students
            if (pathname === '/api/students' && method === 'PUT') {
                let body = '';
                req.on('data', chunk => { body += chunk; });
                req.on('end', async () => {
                    try {
                        const arr = JSON.parse(body);
                        if (!Array.isArray(arr)) throw new Error('Expected array');
                        loadStudents(arr);
                        await saveToJSON(getPlainStudents());
                        return res.end(JSON.stringify(getAllStudents()));
                    } catch (err) {
                        res.writeHead(400);
                        return res.end(JSON.stringify({ error: err.message }));
                    }
                });
                return;
            }

            // DELETE /api/students/:id
            if (studentIdMatch && method === 'DELETE') {
                const removed = removeStudent(studentIdMatch[1]);
                await saveToJSON(getPlainStudents());
                return res.end(JSON.stringify({ removed }));
            }

            res.writeHead(404);
            return res.end(JSON.stringify({ error: 'Student endpoint not found' }));
        } catch (err) {
            res.writeHead(500);
            return res.end(JSON.stringify({ error: err.message }));
        }
    }

    // --- BACKUP API ---
    if (pathname.startsWith('/api/backup')) {
        try {
            if (pathname === '/api/backup/start' && method === 'POST') {
                backupService.start();
                return res.end(JSON.stringify({ status: 'Backup started' }));
            }
            if (pathname === '/api/backup/stop' && method === 'POST') {
                backupService.stop();
                return res.end(JSON.stringify({ status: 'Backup stopped' }));
            }
            if (pathname === '/api/backup/status' && method === 'GET') {
                return res.end(JSON.stringify({ running: !!backupService.intervalId }));
            }
            res.writeHead(404);
            return res.end(JSON.stringify({ error: 'Backup endpoint not found' }));
        } catch (err) {
            res.writeHead(500);
            return res.end(JSON.stringify({ error: err.message }));
        }
    }

    // Not found
    res.writeHead(404);
    return res.end(JSON.stringify({ error: 'Not found' }));
});

// Start server
const PORT = 3000;
server.listen(PORT, () => logger(`Server running at http://localhost:${PORT}`));
