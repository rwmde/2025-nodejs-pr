import { v4 as uuidv4 } from 'uuid';

class Student {
  constructor(public id: string, public name: string, public age: number, public group: string) {}
}

const students: Student[] = [];

export function addStudent({ name, age, group }: { name: string; age: number; group: string }) {
  const id = uuidv4();
  const student = new Student(id, name, age, group);
  students.push(student);
  return student;
}

export function getAllStudents() {
  return students;
}

export function getStudentById(id: string) {
  return students.find(s => s.id === id);
}

export function removeStudent(id: string) {
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) return students.splice(index, 1)[0];
  return null;
}

export function loadStudents(array: any[]) {
  if (!Array.isArray(array)) return;
  students.length = 0;
  array.forEach(obj => students.push(new Student(obj.id, obj.name, obj.age, obj.group)));
}

export function getPlainStudents() {
  return students.map(s => ({ id: s.id, name: s.name, age: s.age, group: s.group }));
}

export function getStudentsByGroup(group: string) {
  return students.filter(s => s.group === group);
}

export function calculateAverageAge() {
  if (students.length === 0) return 0;
  const sum = students.reduce((acc, s) => acc + s.age, 0);
  return sum / students.length;
}
