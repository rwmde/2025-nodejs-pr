import request from 'supertest';
import { app } from '../../server';

describe('Students API - Integration Tests', () => {
  describe('GET /api/students', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/students');

      expect(response.status).toBe(401);
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/api/students');

      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should include error message in response', async () => {
      const response = await request(app).get('/api/students');

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/students', () => {
    it('should return 401 without authentication', async () => {
      const newStudent = {
        studentName: 'New Test Student',
        age: 21,
        groupNumber: 201,
      };

      const response = await request(app)
        .post('/api/students')
        .send(newStudent);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/students/:id', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/students/1');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/students/:id', () => {
    it('should return 401 without authentication', async () => {
      const updateData = {
        studentName: 'Updated Name',
        age: 23,
        groupNumber: 203,
      };

      const response = await request(app)
        .put('/api/students/1')
        .send(updateData);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/students/:id', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).delete('/api/students/1');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/students/average-age', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/students/average-age');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/students/group/:id', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/students/group/200');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/students (replace all)', () => {
    it('should return 401 without authentication', async () => {
      const students = [
        { studentName: 'Replaced 1', age: 20, groupNumber: 210 },
        { studentName: 'Replaced 2', age: 21, groupNumber: 210 },
      ];

      const response = await request(app).put('/api/students').send(students);

      expect(response.status).toBe(401);
    });
  });

  describe('Backup Endpoints', () => {
    it('POST /api/backup/start should return 401 without authentication', async () => {
      const response = await request(app).post('/api/backup/start');

      expect(response.status).toBe(401);
    });

    it('POST /api/backup/stop should return 401 without authentication', async () => {
      const response = await request(app).post('/api/backup/stop');

      expect(response.status).toBe(401);
    });

    it('GET /api/backup/status should return 401 without authentication', async () => {
      const response = await request(app).get('/api/backup/status');

      expect(response.status).toBe(401);
    });
  });

  describe('File Operations', () => {
    it('POST /api/students/save should return 401 without authentication', async () => {
      const response = await request(app).post('/api/students/save');

      expect(response.status).toBe(401);
    });

    it('POST /api/students/load should return 401 without authentication', async () => {
      const response = await request(app).post('/api/students/load');

      expect(response.status).toBe(401);
    });
  });

  describe('Complete Student Lifecycle via API', () => {
    it('should require authentication for all CRUD operations', async () => {
      const createResponse = await request(app).post('/api/students').send({
        studentName: 'Lifecycle Test',
        age: 20,
        groupNumber: 220,
      });
      expect(createResponse.status).toBe(401);

      const listResponse = await request(app).get('/api/students');
      expect(listResponse.status).toBe(401);

      const getResponse = await request(app).get('/api/students/1');
      expect(getResponse.status).toBe(401);

      const updateResponse = await request(app).put('/api/students/1').send({
        studentName: 'Updated Lifecycle',
        age: 21,
        groupNumber: 221,
      });
      expect(updateResponse.status).toBe(401);

      const deleteResponse = await request(app).delete('/api/students/1');
      expect(deleteResponse.status).toBe(401);
    });
  });
});
