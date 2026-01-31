# Students Management System

**Node.js + TypeScript + Express + PostgreSQL**

## 📌 Project Description

This project is a Students Management System built with **Node.js**, **TypeScript**, **Express**, and **PostgreSQL** using **Sequelize ORM**.

The project was developed step by step during laboratory works.
**Lab 5** extends the previous functionality by adding **authentication, authorization, roles, and permissions**.

---

## 🛠 Technologies Used

* Node.js
* TypeScript
* Express
* PostgreSQL
* Sequelize + sequelize-typescript
* JWT (jsonwebtoken)
* bcrypt
* Joi (data validation)
* dotenv

---

## 📂 Project Structure

```
pr-5/
└── task/
    ├── .env
    ├── package.json
    └── src/
        ├── db/
        │   ├── db.ts
        │   └── migrate.ts
        ├── models/
        │   ├── Student.ts
        │   ├── User.ts
        │   ├── Role.ts
        │   ├── Subject.ts
        │   └── Grade.ts
        ├── services/
        ├── validators/
        │   └── studentValidator.ts
        ├── initData.ts
        └── server.ts
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the `task` folder with the following content:

```env
DB_HOST=localhost
DB_PORT=5433
DB_NAME=students_db
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3000
JWT_SECRET=supersecretkey
```

---

## 🗄 Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE students_db;
```

2. Install dependencies:

```bash
npm install
```

3. Run migration (creates tables and test data):

```bash
npx ts-node src/db/migrate.ts
```

The following tables will be created automatically:

* `roles`
* `users`
* `students`
* `subjects`
* `grades`

---

4. Run server 
```bash
npm run dev
```
## 🔐 Authentication & Authorization (Lab 5)

### Roles

The system supports **role-based access control**:

* **admin** – full access
* **teacher** – extended permissions
* **student** – limited permissions

Roles are stored in the database and included in the JWT token.

---

Absolutely, Anastasya — here’s a clean, professional **README section in English** that explains how to test **registration, login, JWT authentication, and role‑based access** in your API.  
It’s written in a style suitable for GitHub.

---

# 📘 Authentication & Authorization Testing Guide

This guide explains how to test **user registration**, **login**, **JWT authentication**, and **role‑based access control** using Postman or any REST client.

---

## 🔐 1. Register a New User

### **Endpoint**
```
POST /api/auth/register
```

### **Body (JSON)**
```json
{
  "name": "Alice",
  "surname": "Test",
  "email": "alice@test.com",
  "password": "123456",
  "roleId": "<ROLE_UUID>"
}
```

### **Where to get `roleId`**
Run:
```sql
SELECT * FROM roles;
```
You will see UUIDs for:
- `student`
- `teacher`
- `admin`

### **Expected Response**
```json
{
  "id": "...",
  "name": "Alice",
  "surname": "Test",
  "email": "alice@test.com",
  "role": "student"
}
```

If you see this — registration works correctly.

---

## 🔑 2. Login

### **Endpoint**
```
POST /api/auth/login
```

### **Body (JSON)**
```json
{
  "email": "alice@test.com",
  "password": "123456"
}
```

### **Expected Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

This token must be used for all protected routes.

---

## 🧪 3. Decode the Token (Optional)

Go to:  
https://jwt.io

Paste the token and verify that the payload contains:

```json
{
  "id": "...",
  "email": "alice@test.com",
  "role": "student"
}
```

If `role` is a string (`admin`, `teacher`, `student`), role‑based access will work.

---

## 🔒 4. Access a Protected Route

Example:

### **Endpoint**
```
GET /api/students
```

### **Headers**
```
Authorization: Bearer <your_token_here>
```

### **Expected Response**
- If the token is valid → list of students
- If missing token → `{ "error": "No token" }`
- If token is invalid → `{ "error": "Invalid token" }`

---

## 🛡 5. Test Role‑Based Access

Creating a student requires `admin` or `teacher` role.

### **Endpoint**
```
POST /api/students
```

### **Headers**
```
Authorization: Bearer <your_token_here>
```

### **Body**
```json
{
  "name": "Bob",
  "age": 20,
  "group": "A1"
}
```

### **Expected Behavior**
- **admin / teacher** → student is created (200 OK)
- **student** → `{ "error": "Forbidden" }`

This confirms that `roleMiddleware` works.

---

## ❌ 6. Negative Test Cases

### Wrong password
```
POST /api/auth/login
```
```json
{
  "email": "alice@test.com",
  "password": "wrong"
}
```
Expected:
```json
{ "error": "Invalid credentials" }
```

### Wrong email
```json
{ "email": "unknown@test.com", "password": "123456" }
```
Expected:
```json
{ "error": "Invalid credentials" }
```

### Missing token
```
GET /api/students
```
Expected:
```json
{ "error": "No token" }
```

---

## 📚 Students API

### Get all students

```
GET /api/students
```

### Get student by ID

```
GET /api/students/:id
```

### Create student (admin / teacher only)

```
POST /api/students
```

### Update student (admin / teacher only)

```
PUT /api/students/:id
```

### Delete student (admin only)

```
DELETE /api/students/:id
```

---

## ✅ Data Validation

All `POST` and `PUT` requests are validated using **Joi**.

Example validation errors:

* empty name
* negative age
* missing required fields

Invalid requests return **HTTP 400**.

---

## 🔐 Security

* Passwords are encrypted using **bcrypt**
* Plain text passwords are never stored
* JWT is used for authentication
* Role-based middleware prevents unauthorized access

---

## 🧪 How to Test the Application

1. Start the server:

```bash
npm run dev
```

2. Use **Postman** or **Bruno**

3. Steps:

   * Register a user
   * Login and get JWT token
   * Access protected endpoints with and without token
   * Verify role restrictions
   * Try invalid input to test Joi validation

---

## 📝 Lab 5 Summary

During Lab 5 the following features were implemented:

1. Database structure was expanded with new tables
2. Authentication using JWT was added
3. Password encryption with bcrypt
4. Role-based access control
5. Protected API endpoints
6. Input validation using Joi
7. Clean and modular project structure

---

## ✅ Conclusion

The project fully meets the requirements of **Laboratory Work 5**:

* Secure authentication
* Proper authorization
* Expanded database schema
* Stable and structured code

---
