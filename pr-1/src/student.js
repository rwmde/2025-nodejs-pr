const JsonStorage = require('./json-storage');
const path = require('path');
const Logger = require('./logger').getInstance();

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

class StudentRepository {
    #studentStorage = new JsonStorage(path.join(process.cwd(), "students.json"))

    constructor() {
        this.#studentStorage.save("");
    }

    addStudent(id, name, age, group) {
        const student = new Student(id, name, age, group);
        const existingStudents = this.getAllStudents();

        existingStudents.push(student);

        this.#studentStorage.save(existingStudents);
        Logger.log(`Added student ${name}: `, student);

        return student;
    }

    removeStudent(id) {
        const existingStudents = this.getAllStudents();
        const student = existingStudents.find(student => student.id === id);

        if (!student) {
            throw new Error(`Student with id ${id} not found`);
        }

        this.#studentStorage.save(existingStudents.filter(student => student.id !== id));
        Logger.log(`Removed student with ID ${id}`);

        return student;
    }

    getStudentById(id) {
        const existingStudents = this.getAllStudents();
        return existingStudents.find(student => student.id === id) || null;
    }

    getStudentsByGroup(group) {
        const existingStudents = this.getAllStudents();
        return existingStudents.filter(student => student.group === group) || [];
    }

    getAllStudents() {
        return this.#studentStorage.load() || [];
    }

    calculateAverageAge() {
        const existingStudents = this.getAllStudents();
        return Math.floor(existingStudents.reduce((acc, student) => acc + student.age, 0) / existingStudents.length);
    }

}

module.exports = {
    repository: StudentRepository,
}
