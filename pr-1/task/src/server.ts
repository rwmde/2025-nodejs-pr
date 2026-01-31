import express from 'express';
import sequelize from './config/database';
import studentRoutes from './routes/studentRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/students', studentRoutes);

app.get('/', (_, res) => {
    res.send('Student Management API is running.');
});

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

if (require.main === module) {
    startServer();
}

export default app;
