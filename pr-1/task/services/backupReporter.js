
const fs = require('fs').promises;
const path = require('path');

async function reportBackupStats(backupDir = 'backups') {
    try {
        const files = await fs.readdir(backupDir);
        const backupFiles = files.filter(f => f.endsWith('.backup.json'));

        console.log(`Total backup files: ${backupFiles.length}`);
        if (backupFiles.length === 0) return;

        const latestFile = backupFiles.sort().reverse()[0];
        const timestampPart = latestFile.replace('.backup.json', '');
        const readableDate = new Date(timestampPart).toLocaleString();
        console.log(`Latest backup file: ${latestFile} (created at ${readableDate})`);

        const dataArrays = await Promise.all(
            backupFiles.map(f => fs.readFile(path.join(backupDir, f), 'utf8').then(JSON.parse))
        );

        const studentCountById = {};
        let totalStudents = 0;

        dataArrays.forEach(arr => {
            totalStudents += arr.length;
            arr.forEach(student => {
                if (!studentCountById[student.id]) studentCountById[student.id] = 0;
                studentCountById[student.id] += 1;
            });
        });

        const grouped = Object.entries(studentCountById).map(([id, amount]) => ({ id, amount }));
        console.log('Students count by ID across all backups:', grouped);

        const average = totalStudents / backupFiles.length;
        console.log(`Average number of students per backup file: ${average.toFixed(2)}`);
    } catch (err) {
        console.error('Error while generating backup report:', err);
    }
}

module.exports = { reportBackupStats };
