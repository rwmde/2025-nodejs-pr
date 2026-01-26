-- Drop tables in reverse dependency order
IF OBJECT_ID('dbo.grades', 'U') IS NOT NULL
    DROP TABLE dbo.grades;

IF OBJECT_ID('dbo.students', 'U') IS NOT NULL
    DROP TABLE dbo.students;

IF OBJECT_ID('dbo.users', 'U') IS NOT NULL
    DROP TABLE dbo.users;

IF OBJECT_ID('dbo.roles', 'U') IS NOT NULL
    DROP TABLE dbo.roles;

IF OBJECT_ID('dbo.subjects', 'U') IS NOT NULL
    DROP TABLE dbo.subjects;


CREATE TABLE dbo.roles (
  roleId INT IDENTITY(1,1) PRIMARY KEY,
  roleName NVARCHAR(100) NOT NULL
);

CREATE TABLE dbo.users (
  userId INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  surname NVARCHAR(100) NOT NULL,
  email NVARCHAR(255) NOT NULL UNIQUE,
  passwordHash NVARCHAR(255) NOT NULL,
  roleId INT FOREIGN KEY REFERENCES dbo.roles(roleId)
);

CREATE TABLE dbo.students (
  studentId INT IDENTITY(1,1) PRIMARY KEY,
  studentName NVARCHAR(255) NOT NULL,
  age INT NOT NULL,
  groupNumber INT NOT NULL,
  userId INT FOREIGN KEY REFERENCES dbo.users(userId)
);

CREATE TABLE dbo.subjects (
  subjectId INT IDENTITY(1,1) PRIMARY KEY,
  subjectName NVARCHAR(255) NOT NULL
);

CREATE TABLE dbo.grades (
  gradeId INT IDENTITY(1,1) PRIMARY KEY,
  studentId INT FOREIGN KEY REFERENCES dbo.students(studentId),
  subjectId INT FOREIGN KEY REFERENCES dbo.subjects(subjectId),
  gradeValue INT NOT NULL,
  gradeDate DATETIME NOT NULL DEFAULT GETDATE()
);

-- Optional seed data
INSERT INTO dbo.students (studentName, age, groupNumber) VALUES
('Alice', 20, 1),
('Bob', 22, 1),
('Charlie', 21, 2);

INSERT INTO dbo.roles (roleName) VALUES
('admin'),
('teacher'),
('student'); 

INSERT INTO dbo.subjects (subjectName) VALUES
('Mathematics'),
('Physics'),
('Chemistry');

INSERT INTO dbo.grades (studentId, subjectId, gradeValue) VALUES
(1, 1, 95),
(1, 2, 88),
(2, 1, 76),
(3, 3, 89);