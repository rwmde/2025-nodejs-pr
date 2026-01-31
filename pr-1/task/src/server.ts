import express from 'express';
import sequelize from './config/database';
import studentRoutes from './routes/studentRoutes';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
import { authenticate } from './middleware/authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/students', authenticate, studentRoutes); // Protect all student routes

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
