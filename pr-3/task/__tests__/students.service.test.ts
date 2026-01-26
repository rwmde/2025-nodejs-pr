import { StudentsService } from '../useCases/students/services/students-service';
import { DatabaseService } from '../shared/db-service';
import { Student } from '../shared/types';

jest.mock('../shared/db-service');

describe('StudentsService', () => {
  let studentsService: StudentsService;
  let mockDbService: jest.Mocked<DatabaseService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDbService = new DatabaseService() as jest.Mocked<DatabaseService>;
    mockDbService.onModuleInit = jest.fn();
    mockDbService.query = jest.fn();
    studentsService = new StudentsService(mockDbService);
  });

  describe('getAllStudents - Happy Path', () => {
    it('should retrieve all students from database', async () => {
      const mockStudents: Student[] = [
        {
          studentId: '1',
          studentName: 'Alice Johnson',
          age: 20,
          groupNumber: 101,
        },
        { studentId: '2', studentName: 'Bob Smith', age: 21, groupNumber: 101 },
        {
          studentId: '3',
          studentName: 'Carol White',
          age: 20,
          groupNumber: 102,
        },
      ];

      mockDbService.query.mockResolvedValueOnce(mockStudents);

      const result = await studentsService.getAllStudents();

      expect(result).toEqual(mockStudents);
      expect(mockDbService.query).toHaveBeenCalledWith(
        'SELECT * FROM students',
      );
    });

    it('should handle empty students list', async () => {
      mockDbService.query.mockResolvedValueOnce([]);

      const result = await studentsService.getAllStudents();

      expect(result).toEqual([]);
    });
  });

  describe('addStudent', () => {
    it('should successfully add a new student', async () => {
      const newStudent: Student = {
        studentName: 'David Lee',
        age: 22,
        groupNumber: 103,
      };

      mockDbService.query.mockResolvedValueOnce([]);

      const result = await studentsService.addStudent(newStudent);

      expect(result).toBe(true);
      expect(mockDbService.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO students'),
      );
      expect(mockDbService.query).toHaveBeenCalledWith(
        expect.stringContaining("'David Lee'"),
      );
    });

    it('should successfully add multiple students with different groups', async () => {
      const student1: Student = {
        studentName: 'Emma Davis',
        age: 21,
        groupNumber: 104,
      };

      const student2: Student = {
        studentName: 'Frank Miller',
        age: 20,
        groupNumber: 105,
      };

      mockDbService.query.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

      const result1 = await studentsService.addStudent(student1);
      const result2 = await studentsService.addStudent(student2);

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(mockDbService.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('removeStudent', () => {
    it('should successfully remove a student by id', async () => {
      mockDbService.query.mockResolvedValueOnce([]);

      const result = await studentsService.removeStudent('1');

      expect(result).toBe(true);
      expect(mockDbService.query).toHaveBeenCalledWith(
        'DELETE FROM students WHERE studentId = 1',
      );
    });
  });

  describe('getStudentById', () => {
    it('should retrieve a student by id', async () => {
      const mockStudent: Student = {
        studentId: '1',
        studentName: 'Alice Johnson',
        age: 20,
        groupNumber: 101,
      };

      mockDbService.query.mockResolvedValueOnce([mockStudent]);

      const result = await studentsService.getStudentById('1');

      expect(result).toEqual(mockStudent);
      expect(mockDbService.query).toHaveBeenCalledWith(
        'SELECT * FROM students WHERE studentId = 1',
      );
    });

    it('should return undefined if student not found', async () => {
      mockDbService.query.mockResolvedValueOnce([]);

      const result = await studentsService.getStudentById('999');

      expect(result).toBeUndefined();
    });
  });

  describe('getStudentsByGroup', () => {
    it('should retrieve all students in a group', async () => {
      const mockStudents: Student[] = [
        {
          studentId: '1',
          studentName: 'Alice Johnson',
          age: 20,
          groupNumber: 101,
        },
        { studentId: '2', studentName: 'Bob Smith', age: 21, groupNumber: 101 },
      ];

      mockDbService.query.mockResolvedValueOnce(mockStudents);

      const result = await studentsService.getStudentsByGroup(101);

      expect(result).toEqual(mockStudents);
      expect(mockDbService.query).toHaveBeenCalledWith(
        'SELECT * FROM students WHERE groupNumber = 101',
      );
    });

    it('should return empty array for group with no students', async () => {
      mockDbService.query.mockResolvedValueOnce([]);

      const result = await studentsService.getStudentsByGroup(999);

      expect(result).toEqual([]);
    });
  });

  describe('updateStudent', () => {
    it('should successfully update student information', async () => {
      const updatedStudent: Student = {
        studentId: '1',
        studentName: 'Alice Johnson Updated',
        age: 21,
        groupNumber: 102,
      };

      mockDbService.query
        .mockResolvedValueOnce([]) // Update query
        .mockResolvedValueOnce([updatedStudent]); // getStudentById call

      const result = await studentsService.updateStudent('1', updatedStudent);

      expect(result).toEqual(updatedStudent);
      expect(mockDbService.query).toHaveBeenCalledTimes(2);
      expect(mockDbService.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('UPDATE students'),
      );
    });
  });

  describe('replaceAllStudents', () => {
    it('should replace all students with new list', async () => {
      const newStudents: Student[] = [
        { studentName: 'Grace Lee', age: 19, groupNumber: 201 },
        { studentName: 'Henry Brown', age: 20, groupNumber: 202 },
      ];

      mockDbService.query
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(newStudents);

      const result = await studentsService.replaceAllStudents(newStudents);

      expect(result).toEqual(newStudents);
      expect(mockDbService.query).toHaveBeenCalledWith('DELETE FROM students');
      expect(mockDbService.query).toHaveBeenCalledTimes(4);
    });
  });

  describe('calculateAverageAge - Happy Path', () => {
    it('should calculate average age of all students', async () => {
      const averageAgeResult = [{ averageAge: 20.5 }];

      mockDbService.query.mockResolvedValueOnce(averageAgeResult);

      const result = await studentsService.calculateAverageAge();

      expect(result).toBe(20.5);
      expect(mockDbService.query).toHaveBeenCalledWith(
        'SELECT AVG(age) as averageAge FROM students',
      );
    });

    it('should handle zero average age', async () => {
      const averageAgeResult = [{ averageAge: 0 }];

      mockDbService.query.mockResolvedValueOnce(averageAgeResult);

      const result = await studentsService.calculateAverageAge();

      expect(result).toBe(0);
    });
  });
});
