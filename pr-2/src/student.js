const JsonStorage = require('./json-storage');
const path = require('path');
const Logger = require('./logger').getInstance();
const EventEmitter = require('events');

class Student {
    /**
     * @param {number} id
     * @param {string} name
     * @param {number} age
     * @param {string} group
     */
    constructor(id, name, age, group) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.group = group;
    }
}

class StudentRepository extends EventEmitter {
    #studentStorage = new JsonStorage(path.join(process.cwd(), "students.json"))

    constructor() {
        super();
    }

    async addStudent(id, name, age, group) {
        const student = new Student(id, name, age, group);
        const existingStudents = await this.getAllStudents();

        existingStudents.push(student);

        await this.#studentStorage.save(existingStudents);

        this.emit('add', student);

        return student;
    }

    async removeStudent(id) {
        this.emit('student-removing', { id });

        const existingStudents = await this.getAllStudents();
        const student = existingStudents.find(student => student.id === id);

        if (!student) {
            const error = new Error(`Student with id ${id} not found`);
            this.emit('student-remove-error', error);
            throw error;
        }

        await this.#studentStorage.save(existingStudents.filter(student => student.id !== id));
        this.emit('remove', student);

        return student;
    }

    async getStudentById(id) {
        const existingStudents = await this.getAllStudents();
        return existingStudents.find(student => student.id === id) || null;
    }

    async getStudentsByGroup(group) {
        const existingStudents = await this.getAllStudents();
        return existingStudents.filter(student => student.group === group) || [];
    }

    async getAllStudents() {
        return await this.#studentStorage.load() || [];
    }

    async calculateAverageAge() {
        const existingStudents = await this.getAllStudents();
        return Math.floor(existingStudents.reduce((acc, student) => acc + student.age, 0) / existingStudents.length);
    }

}

module.exports = {
    repository: StudentRepository,
}
