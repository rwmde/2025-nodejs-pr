import request from 'supertest';
import app from '../src/server';
import { User, Role } from '../src/models';
import sequelize from '../src/config/database';
import jwt from 'jsonwebtoken';

describe('System Monitoring Endpoint', () => {
    let adminToken: string;
    let moderatorToken: string;
    let userToken: string;

    beforeAll(async () => {
        const [adminRole] = await Role.findOrCreate({ where: { name: 'admin' } });
        const [moderatorRole] = await Role.findOrCreate({ where: { name: 'moderator' } });
        const [userRole] = await Role.findOrCreate({ where: { name: 'user' } });

        const adminUser = await User.create({
            email: 'admin_monitor@example.com',
            password: 'password123',
            name: 'Admin',
            surname: 'User',
            roleId: adminRole.id
        });

        const moderatorUser = await User.create({
            email: 'moderator_monitor@example.com',
            password: 'password123',
            name: 'Moderator',
            surname: 'User',
            roleId: moderatorRole.id
        });

        const regularUser = await User.create({
            email: 'user_monitor@example.com',
            password: 'password123',
            name: 'Regular',
            surname: 'User',
            roleId: userRole.id
        });

        // Generate tokens
        adminToken = jwt.sign({ id: adminUser.id, email: adminUser.email, role: adminUser.roleId }, process.env.JWT_SECRET || 'secret_key');
        moderatorToken = jwt.sign({ id: moderatorUser.id, email: moderatorUser.email, role: moderatorUser.roleId }, process.env.JWT_SECRET || 'secret_key');
        userToken = jwt.sign({ id: regularUser.id, email: regularUser.email, role: regularUser.roleId }, process.env.JWT_SECRET || 'secret_key');
    });

    afterAll(async () => {
        await User.destroy({ where: { email: ['admin_monitor@example.com', 'moderator_monitor@example.com', 'user_monitor@example.com'] } });
        await sequelize.close();
    });

    it('should deny access to unauthenticated users', async () => {
        const res = await request(app).get('/status');
        expect(res.status).toBe(401);
    });

    it('should deny access to unauthorized roles (user)', async () => {
        const res = await request(app)
            .get('/status')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toBe(403);
    });

    it('should allow access to admin', async () => {
        const res = await request(app)
            .get('/status')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/text\/html/);
    });

    it('should allow access to moderator', async () => {
        const res = await request(app)
            .get('/status')
            .set('Authorization', `Bearer ${moderatorToken}`);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/text\/html/);
    });
});
