import request from 'supertest';
import app from '../src/server';
import sequelize from '../src/config/database';

describe('Server Basic Endpoints', () => {
    beforeAll(async () => {
        // We generally need database connection for the app to start cleanly 
        // if some middleware or routes depend on it immediately?
        // But /status and /api-docs might not need DB.
        // However, authenticate middleware in server.ts imports db models, so it's safer to connect.
        try {
            await sequelize.authenticate();
        } catch (err) {
            console.error('Test DB connection error', err);
        }
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('GET / should return welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Student Management API is running');
    });

    it('GET /status should be available', async () => {
        // express-status-monitor usually exposes /status
        const res = await request(app).get('/status');
        // It returns HTML usually
        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toMatch(/text\/html/);
    });

    it('GET /api-docs should be available', async () => {
        // Swagger UI
        const res = await request(app).get('/api-docs/');
        // Note the trailing slash is sometimes important for swagger-ui-express main page
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Swagger UI');
    });

    it('Swagger UI should load', async () => {
        const res = await request(app).get('/api-docs/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('id="swagger-ui"');
    });
});
