import { addStudent, getPlainStudents } from './services/studentService';
import { saveToJSON } from './services/storage';

export async function createTestStudents() {
  // Example of test students data
  addStudent({ name: 'Alice', age: 20, group: 'A1' });
  addStudent({ name: 'Bob', age: 21, group: 'B1' });
  addStudent({ name: 'Charlie', age: 22, group: 'C1' });

  // Saving to JSON
  await saveToJSON(getPlainStudents());
}
