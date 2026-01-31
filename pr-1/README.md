# Student Management System (Lab 4)

This is a Node.js + TypeScript project for managing student data. The data is stored in a **PostgreSQL** database, and all CRUD operations are implemented. Data validation is included using **Joi**, and the database can be initialized automatically via Sequelize.

---

## **1. Setup**

### **1.1 Clone the repository**

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

### **1.2 Install dependencies**

```bash
npm install
```

### **1.3 Setup `.env` file**

Create a file named `.env` in the root of the project and add the following configuration:

```
DB_HOST=localhost
DB_PORT=5433
DB_NAME=students_db
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3000
```

**Explanation:**

* `DB_HOST` — Database server host (localhost if running locally).
* `DB_PORT` — PostgreSQL port (default here is 5433).
* `DB_NAME` — Name of the database (`students_db`).
* `DB_USER` — Database user (`postgres`).
* `DB_PASSWORD` — Password for the user (`postgres`).
* `PORT` — Port for the Express server (default 3000).

---

### **1.4 Run PostgreSQL**

Make sure PostgreSQL server is running and accessible using the credentials from `.env`. You can use pgAdmin or CLI to create the database `students_db` if it doesn’t exist.

---

### **1.5 Run database migration**

To create tables automatically:

```bash
npx ts-node src/db/migrate.ts
```

Or, if using Sequelize sync in `db.ts`:

```ts
sequelize.sync({ force: false });
```

This will create the `students` table automatically.

---

### **1.6 Start the server**

```bash
npm run dev
```

Server will start on `http://localhost:3000`.

---

## **2. API Endpoints**

### **2.1 Get all students**

```
GET /api/students
```

### **2.2 Get a student by ID**

```
GET /api/students/:id
```

### **2.3 Add a new student**

```
POST /api/students
Content-Type: application/json

{
  "name": "David",
  "age": 23,
  "group": "D1"
}
```

Validation: Name (string), Age (number), Group (string). Returns 400 if invalid.

### **2.4 Update a student**

```
PUT /api/students/:id
Content-Type: application/json

{
  "name": "David Updated",
  "age": 24,
  "group": "D2"
}
```

### **2.5 Delete a student**

```
DELETE /api/students/:id
```

---

## **3. Project Structure**

```
/src
  /db
    db.ts          # Database connection
    migrate.ts     # Migration script for initial data
  /models
    Student.ts     # Sequelize model for Student
  /validators
    studentValidator.ts  # Joi validation schema
  server.ts        # Express server
.env               # Environment variables
package.json
```

---

## **4. Short Step-by-Step Report for Lab 4**

1. **Setup PostgreSQL**

    * Installed PostgreSQL locally.
    * Created database `students_db`.

2. **Configure `.env`**

    * Added DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, PORT.

3. **Connect Node.js project to PostgreSQL**

    * Installed `pg`, `pg-hstore`, `sequelize`, `sequelize-typescript`.
    * Configured `db.ts` with Sequelize using `.env` variables.

4. **Create Student model**

    * Defined `Student` model with `id`, `name`, `age`, `group`.
    * Set `id` as primary key.

5. **Database migration / sync**

    * Ran `migrate.ts` or `sequelize.sync()` to create `students` table.
    * Seeded initial test data with unique `id`.

6. **CRUD Endpoints**

    * Implemented `/api/students` endpoints with Express.
    * Added Joi validation for POST and PUT.

7. **Tested all endpoints**

    * Verified GET, POST, PUT, DELETE.
    * Checked responses, status codes, and data stored in PostgreSQL.

8. **Backup service** (optional for lab 3 continuation)

    * Handles periodic JSON backups if required.

