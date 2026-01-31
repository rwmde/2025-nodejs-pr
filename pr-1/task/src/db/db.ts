import { Sequelize } from 'sequelize-typescript';
import { Student } from '../models/Student';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [Student],
  logging: false
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync({ force: false });
    console.log('Tables created (sync)');
  } catch (error) {
    console.error('Unable to connect to DB:', error);
  }
};
