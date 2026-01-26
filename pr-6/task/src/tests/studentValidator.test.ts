import { studentSchema } from '../validators/studentValidator';

describe('studentValidator', () => {
  it('should pass valid student', () => {
    const { error } = studentSchema.validate({ name: 'Alice', age: 20, group: 'A1' });
    expect(error).toBeUndefined();
  });

  it('should fail invalid age', () => {
    const { error } = studentSchema.validate({ name: 'Bob', age: -1, group: 'B1' });
    expect(error).toBeDefined();
  });

  it('should fail empty name', () => {
    const { error } = studentSchema.validate({ name: '', age: 20, group: 'A1' });
    expect(error).toBeDefined();
  });
});
