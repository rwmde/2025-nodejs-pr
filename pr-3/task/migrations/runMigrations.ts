import fs from 'fs';
import path from 'path';
import sql from 'mssql';
import dotenv from 'dotenv';
import { Logger } from '../utils/logger';

dotenv.config();
const logger = new Logger();

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'migrations');
const connectionString = process.env.DATABASE_CONNECTION_STRING;

if (!connectionString) {
  logger.log('DATABASE_CONNECTION_STRING is not defined in .env');
  process.exit(1);
}

async function run() {
  try {
    const pool = await new sql.ConnectionPool(connectionString!).connect();
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      logger.log('Applying migration:', file);
      const sqlText = fs.readFileSync(filePath, 'utf8');
      // split by GO statements (used in SQL Server scripts)
      const batches = sqlText
        .split(/^GO$/gim)
        .map((b) => b.trim())
        .filter(Boolean);

      for (const batch of batches) {
        logger.log('Executing batch...');
        await pool.request().batch(batch);
      }
      logger.log('Applied:', file);
    }

    await pool.close();
    logger.log('Migrations complete');
  } catch (err) {
    logger.log('Migration failed:', err);
    process.exit(1);
  }
}

run();
