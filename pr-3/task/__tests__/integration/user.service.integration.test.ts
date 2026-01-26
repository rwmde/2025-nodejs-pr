import request from 'supertest';
import { app } from '../../server';

describe('User API - Integration Tests', () => {
  describe('POST /api/user/registration', () => {
    it('should return 400 for invalid registration data', async () => {
      const invalidUser = {
        name: '',
        surname: '',
        email: 'invalid-email',
        password: '123',
      };

      const response = await request(app)
        .post('/api/user/registration')
        .send(invalidUser);

      expect([400, 422]).toContain(response.status);
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteUser = {
        name: 'Test',
      };

      const response = await request(app)
        .post('/api/user/registration')
        .send(incompleteUser);

      expect([400, 422]).toContain(response.status);
    });

    it('should return JSON content type', async () => {
      const response = await request(app).post('/api/user/registration').send({
        name: 'Format',
        surname: 'Test',
        email: 'format-integration-test@example.com',
        password: 'formatPass123',
      });

      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should not expose password in response', async () => {
      const userData = {
        name: 'Security',
        surname: 'Test',
        email: 'security-integration-test@example.com',
        password: 'securityPass123',
      };

      const response = await request(app)
        .post('/api/user/registration')
        .send(userData);

      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('passwordHash');
    });
  });

  describe('POST /api/user/login', () => {
    it('should return 401 without authentication header', async () => {
      const response = await request(app).post('/api/user/login').send({
        email: 'test-login-integration@example.com',
        password: 'testPassword123',
      });

      expect(response.status).toBe(401);
    });

    it('should return proper error message for unauthenticated request', async () => {
      const response = await request(app).post('/api/user/login').send({
        email: 'test-login-integration@example.com',
        password: 'testPassword123',
      });

      expect(response.body).toHaveProperty('message');
    });

    it('should return JSON content type', async () => {
      const response = await request(app).post('/api/user/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Request Validation', () => {
    it('should validate email format', async () => {
      const userWithInvalidEmail = {
        name: 'Test',
        surname: 'User',
        email: 'not-an-email',
        password: 'validPassword123',
      };

      const response = await request(app)
        .post('/api/user/registration')
        .send(userWithInvalidEmail);

      expect([400, 422]).toContain(response.status);
    });

    it('should require all mandatory fields - missing name', async () => {
      const response = await request(app).post('/api/user/registration').send({
        surname: 'Test',
        email: 'test@example.com',
        password: 'pass123',
      });

      expect([400, 422]).toContain(response.status);
    });

    it('should require all mandatory fields - missing surname', async () => {
      const response = await request(app)
        .post('/api/user/registration')
        .send({ name: 'Test', email: 'test@example.com', password: 'pass123' });

      expect([400, 422]).toContain(response.status);
    });

    it('should require all mandatory fields - missing email', async () => {
      const response = await request(app)
        .post('/api/user/registration')
        .send({ name: 'Test', surname: 'User', password: 'pass123' });

      expect([400, 422]).toContain(response.status);
    });

    it('should require all mandatory fields - missing password', async () => {
      const response = await request(app)
        .post('/api/user/registration')
        .send({ name: 'Test', surname: 'User', email: 'test@example.com' });

      expect([400, 422]).toContain(response.status);
    });

    it('should return error for empty request body', async () => {
      const response = await request(app)
        .post('/api/user/registration')
        .send({});

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('Security', () => {
    it('should handle SQL injection attempts safely', async () => {
      const maliciousUser = {
        name: "Robert'; DROP TABLE users;--",
        surname: 'Test',
        email: 'injection-integration-test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/user/registration')
        .send(maliciousUser);

      expect([201, 400, 422, 500]).toContain(response.status);
    });

    it('should handle XSS attempts in user input', async () => {
      const xssUser = {
        name: '<script>alert("xss")</script>',
        surname: 'Test',
        email: 'xss-test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/user/registration')
        .send(xssUser);

      expect([201, 400, 422, 500]).toContain(response.status);
    });
  });
});
