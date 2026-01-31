import 'reflect-metadata';
import { sequelize } from './db';
import { Student } from '../models/Student';


async function migrate() {
  try {
    // Создаём таблицы, если их нет
    await sequelize.sync({ force: true }); // force: true удаляет старые данные

    // Тестовые студенты
    const students = [
      { name: 'Alice', age: 20, group: 'A1' },
      { name: 'Bob', age: 21, group: 'B1' },
      { name: 'Charlie', age: 22, group: 'C1' },
    ];

    await Student.bulkCreate(students);

    console.log('Migration completed with test students.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
