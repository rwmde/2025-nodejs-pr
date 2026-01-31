# Assignment 4 - Working with Databases

> **NOTE**: All relevant code is placed in the `pr-1/task` directory.

### Configure Environment
Copy the example environment file:
```bash
cp .env.template .env
```

### Install Dependencies
```bash
npm install
```

### Start Database
Launch the PostgreSQL container using Docker Compose:
```bash
npm run compose
```

### Run Migrations
Initialize the database schema:
```bash
npm run migrate
```
> **Note**: This script will automatically create the `students_db` database if it doesn't exist.

## Running the Project

Start the development server:
```bash
npm start
```
