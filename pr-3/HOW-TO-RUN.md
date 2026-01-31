# Server Documentation & Usage

## Install Dependencies

```bash
npm install
```

## Run Basic Server

```bash
npm run basic
```

### Available Routes

- `GET /` - returns HTML page
- `GET /hello` - returns "Hello World"
- `GET /request` - returns request details

## Run Express Server

```bash
npm run express
```

> [!NOTE]
>
> Backup files are stored in `pr-1/task/backups` directory.
>
> Initial `students.json` file is stored in `pr-1/task/students.json` directory.

### Student Routes

| Method | Path | Functionality |
| :--- | :--- | :--- |
| GET | `/api/students` | Get all students |
| POST | `/api/students` | Add new student |
| PUT | `/api/students` | Completely replace old students collection with a new one |
| GET | `/api/students/:id` | Get student by ID |
| PUT | `/api/students/:id` | Update existing student by ID |
| DELETE | `/api/students/:id` | Remove existing student by ID |
| GET | `/api/students/group/:id` | Get all students by specific group id |
| GET | `/api/students/average-age` | Calculate average age of your students |
| POST | `/api/students/save` | Save students to JSON file |
| POST | `/api/students/load` | Load students from JSON file |

### Backup Routes

| Method | Path | Functionality |
| :--- | :--- | :--- |
| POST | `/api/backup/start` | Start backup mechanism |
| POST | `/api/backup/stop` | Stop backup mechanism |
| GET | `/api/backup/status` | Return current status of the backup mechanism (running/stopped) |

> [!TIP]
> Both Web server and frontend are served on port **3000**.
