```markdown
# Student Management API (Lab Project)
---

## ✨ Features

- **Authentication & Authorization**
  - Register new users with roles (student, teacher, admin).
  - Login with email and password → returns JWT token.
  - Role-based access control for protected endpoints.

- **Student Management**
  - CRUD operations for students (`GET`, `POST`, `PUT`, `DELETE`).
  - Protected endpoints requiring JWT and role permissions.

- **Logging**
  - Winston logger configured:
    - Development → logs to console.
    - Production → logs to files (`logs/combined.log`, `logs/error.log`).

- **Monitoring**
  - `express-status-monitor` provides real-time metrics at `/status`.

- **API Documentation**
  - Swagger UI available at `/api/docs`.

- **Testing**
  - Jest + Supertest for unit and integration tests.
  - Covers authentication service, student validator, and server endpoints.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables
Create a `.env` file in the root with values like:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_NAME=students_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_secret_key
```

### 4. Run the server (development mode)
```bash
npm run dev
```
Expected output:
```
Server running at http://localhost:3000
Database connected
Tables created (sync)
```

### 5. Run the server (production mode)
```bash
NODE_ENV=production npm run dev
```
Logs will be written to:
- `logs/combined.log`
- `logs/error.log`

---

## 🧪 Running Tests

Run all Jest tests:
```bash
npm test
```

Expected result:
```
Test Suites: 3 passed, 3 total
Tests:       8 passed, 8 total
```

---

## 📖 API Documentation (Swagger)

1. Start the server (`npm run dev`).
2. Open Swagger UI in browser:
   ```
   http://localhost:3000/api/docs
   ```
3. Available endpoints:
   - **Auth**
      - `POST /api/auth/register` → Register new user
      - `POST /api/auth/login` → Login and get JWT
   - **Students**
      - `GET /api/students` → Get all students
      - `POST /api/students` → Create student
      - `GET /api/students/{id}` → Get student by ID
      - `PUT /api/students/{id}` → Update student
      - `DELETE /api/students/{id}` → Delete student
   - **Protected Students**
      - `GET /api/students-protected` → Requires JWT
      - `POST /api/students-protected` → Requires JWT + role

4. To test protected endpoints:
   - First call `POST /api/auth/login` with valid credentials.
   - Copy the returned JWT token.
   - Click **Authorize** in Swagger UI and paste:
     ```
     Bearer <your_token>
     ```
   - Now you can access protected routes.

---

## 📊 Monitoring

Open:
```
http://localhost:3000/status
```
You will see real-time metrics (CPU, memory, requests).

---

## ✅ Checklist for Verification

1. `npm run dev` → server starts.
2. `http://localhost:3000/api/docs` → Swagger UI opens.
3. Register a user → login → get JWT.
4. Authorize in Swagger → test protected endpoints.
5. `http://localhost:3000/status` → monitoring dashboard.
6. `npm test` → all tests pass.
7. In production mode, check `logs/combined.log` and `logs/error.log`.

---

## 📌 Notes

- Ensure PostgreSQL is running and accessible with the credentials in `.env`.
- Create the `logs` folder manually or let `logger.ts` auto-create it.
- Use `curl` or Swagger UI to verify API endpoints.
