# Backup Reporter Documentation

## Overview

The Backup Reporter is a tool that analyzes all backup files in a directory and generates comprehensive statistics about the backup data.

## Features

### 1. Total Backup Files

Counts the total number of `.backup.json` files in the backup directory.

### 2. Latest Backup Information

- Identifies the most recent backup file
- Parses the timestamp from the filename
- Displays it in a human-readable format

### 3. Student Occurrence Statistics

Groups all students by their ID and counts how many times each student appears across all backup files. This helps track:

- Which students were consistently in the system
- Which students were added or removed over time
- Data consistency across backups

Example output:

```json
[
  { "id": "1", "name": "John Doe", "amount": 2 },
  { "id": "2", "name": "Jane Smith", "amount": 3 },
  { "id": "3", "name": "Mike Johnson", "amount": 3 },
  { "id": "4", "name": "Alice Brown", "amount": 1 }
]
```

### 4. Average Students Per File

Calculates the average number of students across all backup files, providing insight into typical dataset size.

## Usage

### Command Line Interface

```bash
# Generate report for default backup directory (./backups)
node generate-report.js

# Generate report for custom directory
node generate-report.js ./custom-backups

# Show help
node generate-report.js --help
```

### Programmatic Usage

```javascript
const { BackupReporter } = require('./reporter');

async function analyzeBackups() {
  const reporter = new BackupReporter('./backups');

  // Generate and print formatted report
  await reporter.printReport();

  // Or get raw report data
  const report = await reporter.generateReport();
  console.log(report);
}

analyzeBackups();
```

## Report Structure

The generated report includes:

```javascript
{
  totalBackupFiles: 3,
  latestBackup: {
    filename: 'students_2025-11-19T20-20-15-901Z.backup.json',
    timestamp: Date,
    readableTimestamp: 'November 19, 2025 at 09:20:15 PM GMT+1'
  },
  studentOccurrences: [
    { id: '1', name: 'John Doe', amount: 2 },
    { id: '2', name: 'Jane Smith', amount: 3 }
  ],
  averageStudentsPerFile: 3.00
}
```

## Methods

### `BackupReporter` Class

#### Constructor

```javascript
new BackupReporter((backupDir = './backups'));
```

#### Methods

- **`readAllBackupFiles()`** - Reads and parses all backup files
- **`parseTimestamp(filename)`** - Extracts timestamp from filename
- **`getBackupFilesCount(backupFiles)`** - Returns total count
- **`getLatestBackup(backupFiles)`** - Returns latest backup info
- **`groupStudentsByIdWithCount(backupFiles)`** - Returns student occurrences
- **`calculateAverageStudentsCount(backupFiles)`** - Returns average count
- **`generateReport()`** - Generates complete report object
- **`printReport()`** - Prints formatted report to console

## Error Handling

The reporter handles common errors:

- Missing backup directory
- Invalid JSON files
- Corrupted backup files
- Empty backup directory

All errors are logged and re-thrown for proper handling.

## Example Output

```
============================================================
BACKUP REPORT
============================================================

1. Total Backup Files: 3

2. Latest Backup:
   Filename: students_2025-11-19T20-20-15-901Z.backup.json
   Timestamp: November 19, 2025 at 09:20:15 PM GMT+1

3. Student Occurrences Across All Backups:
[
  {
    "id": "1",
    "name": "John Doe",
    "amount": 2
  },
  {
    "id": "2",
    "name": "Jane Smith",
    "amount": 3
  },
  {
    "id": "3",
    "name": "Mike Johnson",
    "amount": 3
  },
  {
    "id": "4",
    "name": "Alice Brown",
    "amount": 1
  }
]

4. Average Students Per File: 3.00

============================================================
```

## Integration with Student Management System

The reporter integrates seamlessly with the backup system:

1. Backup files are created by `BackupManager`
2. Files follow naming convention: `students_<ISO-timestamp>.backup.json`
3. Reporter reads these files and generates statistics
4. Can be run independently or integrated into the main application
