import { Client } from 'pg';
import sequelize from '../config/database';
import '../models/Student'; // Import model to ensure it's registered
import dotenv from 'dotenv';
import { Logger } from '../Logger';

dotenv.config();

const logger = new Logger();

async function createDatabaseIfNotExists() {
    const dbName = process.env.DB_NAME as string;
    const client = new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: 'postgres', // Connect to default database
    });

    try {
        await client.connect();
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

        if (res.rowCount === 0) {
            logger.log(`Database "${dbName}" not found. Creating...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            logger.log(`Database "${dbName}" created successfully.`);
        } else {
            logger.log(`Database "${dbName}" already exists.`);
        }
    } catch (error) {
        logger.error('Error checking/creating database:', error);
        throw error;
    } finally {
        await client.end();
    }
}

async function migrate() {
    try {
        logger.log('Starting migration...');

        await createDatabaseIfNotExists();

        await sequelize.authenticate(); // Verify connection to the new/existing DB
        await sequelize.sync({ alter: true });
        logger.log('Migration successful: Tables created or updated.');
        process.exit(0);
    } catch (error) {
        logger.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
