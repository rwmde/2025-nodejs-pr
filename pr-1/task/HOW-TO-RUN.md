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

### Create Admin User

To access protected endpoints like system monitoring, you need an admin user. Run the helper script:

```bash
npx ts-node src/scripts/createAdmin.ts
```

Default credentials: `admin@example.com` / `adminpassword`

### Generate API Documentation

Update the Swagger spec manually (optional, runs automatically on build):

```bash
npm run swagger
```

## Running the Project

Start the development server:

```bash
npm start
```

## API Documentation & Monitoring

- **Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Status Monitor**: [http://localhost:3000/status](http://localhost:3000/status) (Requires Admin/Moderator role)

## Production Mode

Build and run the project in production mode:

```bash
npm run prod
```

## Live Server

Run the Live Server to serve static files with automatic reload on changes:

```bash
npm run live
```

By default, it serves the `target` directory on port `3000`.

To specify a custom directory and port:

```bash
# Usage: npm run live -- <directory> <port>
npm run live -- ./public 8080
```
