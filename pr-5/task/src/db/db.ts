import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

import { Student } from '../models/Student';
import { Role } from '../models/Role';
import { User } from '../models/User';
import { Subject } from '../models/Subject';
import { Grade } from '../models/Grade';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [Student, Role, User, Subject, Grade], // Добавляем новые модели в массив
  logging: false,
});

export const connectDB = async () => {
  try {
    // Подключаемся к базе данных
    await sequelize.authenticate();
    console.log('Database connected');

    // Синхронизируем базы данных. Это гарантирует, что таблицы будут созданы, если они еще не существуют
    await sequelize.sync({ force: false }); // `force: false` сохраняет данные, если таблицы уже существуют
    console.log('Tables created (sync)');
  } catch (error) {
    console.error('Unable to connect to DB:', error);
  }
};
