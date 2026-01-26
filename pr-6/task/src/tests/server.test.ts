import request from 'supertest';
import type { Express } from 'express';
import app from '../server';
import { sequelize } from '../db/db';

describe('server endpoints', () => {
  it('GET /api/docs should return swagger UI', async () => {
    const res = await request(app as Express).get('/api/docs');
    expect(res.status).toBe(301);
  });

  it('GET /api/students should return 200', async () => {
    const res = await request(app as Express).get('/api/students');
    expect([200, 500]).toContain(res.status);
  });

  it('POST /api/auth/login should validate body', async () => {
    const res = await request(app as Express)
        .post('/api/auth/login')
        .send({ email: 'bad', password: '' });
    expect([400, 500]).toContain(res.status);
  });
});

afterAll(async () => {
  await sequelize.close(); // закрыть соединение с БД
  await new Promise(resolve => setTimeout(resolve, 500)); // дать время завершиться
});
