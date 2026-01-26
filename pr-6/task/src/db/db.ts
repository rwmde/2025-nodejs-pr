import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

import { Student } from '../models/Student';
import { Role } from '../models/Role';
import { User } from '../models/User';
import { Subject } from '../models/Subject';
import { Grade } from '../models/Grade';

import { logInfo, logError } from '../logger/logger';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [Student, Role, User, Subject, Grade],
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logInfo('Database connected');

    await sequelize.sync({ force: false });
    logInfo('Tables created (sync)');
  } catch (error: any) {
    logError(`Unable to connect to DB: ${error.message}`);
  }
};
