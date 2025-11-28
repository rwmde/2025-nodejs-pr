# EventEmitter Implementation Summary

## Student Management Events (`students.js`)

### Events Emitted:

1. **`student:added`**

   - Triggered when: A new student is added
   - Data: `{ student: Student, totalStudents: number }`

2. **`student:removed`**

   - Triggered when: A student is removed
   - Data: `{ student: Student, totalStudents: number }`

3. **`student:retrieved`**

   - Triggered when: Getting a student by ID
   - Data: `{ id: string, found: boolean }`

4. **`students:filteredByGroup`**

   - Triggered when: Filtering students by group
   - Data: `{ group: number, count: number }`

5. **`students:retrieved`**

   - Triggered when: Getting all students
   - Data: `{ count: number }`

6. **`students:averageCalculated`**
   - Triggered when: Calculating average age
   - Data: `{ average: number, totalStudents: number }`

### Usage:

```javascript
const { studentEvents } = require('./students');

studentEvents.on('student:added', (data) => {
  console.log(`Student ${data.student.name} added`);
});
```

## Backup Manager Events (`backup.js`)

### Events Emitted:

1. **`backup:started`**

   - Triggered when: Backup process is started
   - Data: `{ intervalMs: number, backupDir: string }`

2. **`backup:started-operation`**

   - Triggered when: Individual backup operation begins
   - Data: `{ filename: string }`

3. **`backup:completed`**

   - Triggered when: Backup operation completes successfully
   - Data: `{ filename: string, filepath: string, dataCount: number, timestamp: string }`

4. **`backup:skipped`**

   - Triggered when: Backup skipped due to ongoing operation
   - Data: `{ skippedIntervals: number, maxSkippedIntervals: number }`

5. **`backup:error`**

   - Triggered when: An error occurs during backup
   - Data: `{ error: string, phase: string, skippedIntervals?: number }`

6. **`backup:stopped`**
   - Triggered when: Backup process is stopped
   - Data: none

### Usage:

```javascript
const backupManager = new BackupManager(getData, 30000, './backups');

backupManager.on('backup:completed', (data) => {
  console.log(`Backup saved: ${data.filename}`);
});
```
