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

    it('should fail registration for existing user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
                name: 'John',
                surname: 'Doe'
            });

        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual('User already exists');
    });

    it('should fail login with non-existent user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'password123'
            });

        expect(res.status).toEqual(401);
        expect(res.body.message).toEqual('Invalid credentials');
    });
});

describe('Protected Routes', () => {
    let token: string;
    let adminToken: string;

    beforeAll(async () => {
        // Register a user to get token (student)
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'student@example.com',
                password: 'password123',
                name: 'Student',
                surname: 'User'
            });
        token = res.body.token;

        // Create an admin user directly
        const adminRole = await Role.findOne({ where: { name: 'admin' } });
        // We can't use register endpoint as it defaults to student
        // Using Register endpoint then updating role, or creating via Model?
        // Let's use register then update for simplicity of getting token or just create user then generate token.
        // Actually AuthController.generateToken is not exported.
        // Let's use register then update database.

        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'admin@example.com',
                password: 'adminpassword',
                name: 'Admin',
                surname: 'User'
            });

        // We need to login to get token, but first update role
        const { User } = require('../src/models');
        await User.update({ roleId: adminRole?.id }, { where: { email: 'admin@example.com' } });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@example.com',
                password: 'adminpassword'
            });
        adminToken = loginRes.body.token;
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

    it('should deny access to /status for regular user', async () => {
        const res = await request(app)
            .get('/status')
            .set('Authorization', `Bearer ${token}`); // student token

        expect(res.status).toEqual(403);
    });

    it('should allow access to /status for admin user', async () => {
        const res = await request(app)
            .get('/status')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toEqual(200);
    });
});
