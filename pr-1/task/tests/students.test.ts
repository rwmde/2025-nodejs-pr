import request from 'supertest';
import app from '../src/server';
import sequelize from '../src/config/database';
import Student from '../src/models/Student';

describe('Student API', () => {
    beforeAll(async () => {
        // Sync database before tests
        // force: true clears the database
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        // Clear students after each test to maintain isolation
        await Student.destroy({ where: {}, truncate: true });
    });

    describe('POST /api/students (Create)', () => {
        it('should create a new student', async () => {
            const res = await request(app)
                .post('/api/students')
                .send({
                    name: 'John Doe',
                    age: 20,
                    group: 101
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toEqual('John Doe');
        });

        it('should return 400 for invalid data', async () => {
            const res = await request(app)
                .post('/api/students')
                .send({
                    name: 'J', // Too short
                    age: 20,
                    group: 101
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('GET /api/students (Read)', () => {
        it('should return all students', async () => {
            await Student.create({ name: 'Jane', age: 22, group: 102 });

            const res = await request(app).get('/api/students');

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toEqual(1);
            expect(res.body[0].name).toEqual('Jane');
        });

        it('should return empty array when no students', async () => {
            const res = await request(app).get('/api/students');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });
    });

    describe('GET /api/students/:id (Read One)', () => {
        it('should return a student by id', async () => {
            const student = await Student.create({ name: 'Bob', age: 25, group: 103 });

            const res = await request(app).get(`/api/students/${student.id}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toEqual('Bob');
        });

        it('should return 404 for non-existent student', async () => {
            const res = await request(app).get('/api/students/9999');

            expect(res.statusCode).toEqual(404);
        });
    });

    describe('PUT /api/students/:id (Update)', () => {
        it('should update a student', async () => {
            const student = await Student.create({ name: 'Bob', age: 25, group: 103 });

            const res = await request(app)
                .put(`/api/students/${student.id}`)
                .send({ age: 26 });

            expect(res.statusCode).toEqual(200);
            expect(res.body.age).toEqual(26);

            // Verify in DB
            const updated = await Student.findByPk(student.id);
            expect(updated?.age).toEqual(26); // Use optional chaining or check for null
        });
    });

    describe('DELETE /api/students/:id (Delete)', () => {
        it('should delete a student', async () => {
            const student = await Student.create({ name: 'Bob', age: 25, group: 103 });

            const res = await request(app).delete(`/api/students/${student.id}`);

            expect(res.statusCode).toEqual(204);

            // Verify in DB
            const deleted = await Student.findByPk(student.id);
            expect(deleted).toBeNull();
        });
    });
    describe('PUT /api/students (Replace All)', () => {
        it('should replace all students with new collection', async () => {
            await Student.create({ name: 'Old Student', age: 99, group: 999 });

            const newStudents = [
                { name: 'New Student 1', age: 20, group: 1 },
                { name: 'New Student 2', age: 21, group: 1 }
            ];

            const res = await request(app)
                .put('/api/students')
                .send(newStudents);

            expect(res.statusCode).toEqual(201);
            expect(res.body.length).toEqual(2);
            expect(res.body[0].name).toEqual('New Student 1');

            // Verify DB cleared and repopulated
            const allStudents = await Student.findAll();
            expect(allStudents.length).toEqual(2);
            expect(allStudents.find(s => s.name === 'Old Student')).toBeUndefined();
        });
    });

    describe('GET /api/students/group/:group (Get by Group)', () => {
        it('should return students in a specific group', async () => {
            await Student.create({ name: 'In Group', age: 20, group: 1 });
            await Student.create({ name: 'Out Group', age: 21, group: 2 });

            const res = await request(app).get('/api/students/group/1');

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(1);
            expect(res.body[0].name).toEqual('In Group');
        });
    });

    describe('GET /api/students/average-age', () => {
        it('should calculate the average age of students', async () => {
            await Student.create({ name: 'A', age: 20, group: 1 });
            await Student.create({ name: 'B', age: 30, group: 1 });

            const res = await request(app).get('/api/students/average-age');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ averageAge: 25 });
        });
    });

});
