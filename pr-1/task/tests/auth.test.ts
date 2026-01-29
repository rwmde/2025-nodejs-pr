import request from 'supertest';
import app from '../src/server';
import sequelize from '../src/config/database';
import { Role } from '../src/models';

beforeAll(async () => {
    await sequelize.sync({ force: true });

    await Role.create({ name: 'student' });
    await Role.create({ name: 'admin' });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Auth Endpoints', () => {
    let token: string;

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
                name: 'John',
                surname: 'Doe'
            });

        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', 'test@example.com');
        token = res.body.token;
    });

    it('should login an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

        expect(res.status).toEqual(401);
    });
});

describe('Protected Routes', () => {
    let token: string;

    beforeAll(async () => {
        // Register a user to get token
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'student@example.com',
                password: 'password123',
                name: 'Student',
                surname: 'User'
            });
        token = res.body.token;
    });

    it('should access protected route with token', async () => {
        const res = await request(app)
            .get('/api/students')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toEqual(200);
    });

    it('should deny access without token', async () => {
        const res = await request(app)
            .get('/api/students');

        expect(res.status).toEqual(401);
    });
});
