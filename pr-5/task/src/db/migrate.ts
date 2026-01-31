import 'reflect-metadata';
import { sequelize } from './db';
import { Student } from '../models/Student';
import { Role } from '../models/Role';
import { User } from '../models/User';
import { Subject } from '../models/Subject';
import { Grade } from '../models/Grade';
import bcrypt from 'bcryptjs';

async function migrate() {
  try {
    console.log('Starting migration...');

    // force: true удаляет старые данные и пересоздает таблицы
    await sequelize.sync({ force: true });

    console.log('Tables created.');

    // --- Seed roles ---
    const roles = await Role.bulkCreate([
      { name: 'student' },
      { name: 'teacher' },
      { name: 'admin' },
    ], { returning: true });

    console.log('Roles created:', roles.map(r => r.name));

    // --- Seed admin user ---
    const adminRole = roles.find(r => r.name === 'admin');
    if (!adminRole) throw new Error('Admin role not found');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = await User.create({
      name: 'Admin',
      surname: 'User',
      email: 'admin@example.com',
      password: hashedPassword,
      roleId: adminRole.id,
    });

    console.log('Admin user created:', adminUser.email);

    // --- Seed test students ---
    const students = await Student.bulkCreate([
      { name: 'Alice', age: 20, group: 'A1' },
      { name: 'Bob', age: 21, group: 'B1' },
      { name: 'Charlie', age: 22, group: 'C1' },
    ]);

    console.log('Test students created:', students.map(s => s.name));

    // --- Seed subjects ---
    const subjects = await Subject.bulkCreate([
      { subjectName: 'Math' },
      { subjectName: 'Physics' },
      { subjectName: 'History' },
    ]);

    console.log('Subjects created:', subjects.map(s => s.subjectName));

    // --- Seed grades ---
    const grades = await Grade.bulkCreate([
      { grade: 4, evaluatedAt: new Date(), studentId: students[0].id, subjectId: subjects[0].id },
      { grade: 5, evaluatedAt: new Date(), studentId: students[1].id, subjectId: subjects[1].id },
      { grade: 3, evaluatedAt: new Date(), studentId: students[2].id, subjectId: subjects[2].id },
    ]);

    console.log('Grades created:', grades);

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
