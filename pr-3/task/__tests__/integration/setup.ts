import { DatabaseService } from '../../shared/db-service';

/**
 * Database setup/teardown helpers for integration tests
 */

export class IntegrationTestSetup {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = new DatabaseService();
  }

  /**
   * Initialize database connection for tests
   */
  async setup(): Promise<void> {
    try {
      this.dbService.onModuleInit();
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to setup database for integration tests:', error);
      throw error;
    }
  }

  /**
   * Clean up database after tests
   */
  async teardown(): Promise<void> {
    try {
      await this.dbService.query(
        "DELETE FROM students WHERE studentName LIKE '%Test%'",
      );
      await this.dbService.query("DELETE FROM users WHERE email LIKE '%test%'");
    } catch (error) {
      console.error('Failed to teardown database:', error);
    }
  }

  /**
   * Get database service instance for tests
   */
  getDbService(): DatabaseService {
    return this.dbService;
  }

  /**
   * Create test student data
   */
  async createTestStudent(
    studentName: string,
    age: number,
    groupNumber: number,
  ): Promise<void> {
    const query = `
      INSERT INTO students (studentName, age, groupNumber)
      VALUES ('${studentName}', ${age}, ${groupNumber})
    `;
    await this.dbService.query(query);
  }

  /**
   * Clear all test data
   */
  async clearAllTestData(): Promise<void> {
    try {
      // Truncate or delete test records
      await this.dbService.query(
        'DELETE FROM students WHERE groupNumber >= 200',
      );
      await this.dbService.query(
        "DELETE FROM users WHERE email LIKE '%integration-test%'",
      );
    } catch (error) {
      console.warn('Warning during test data cleanup:', error);
    }
  }

  /**
   * Get all students from database
   */
  async getAllStudents(): Promise<any[]> {
    return this.dbService.query('SELECT * FROM students');
  }

  /**
   * Get average age of all students
   */
  async getAverageAge(): Promise<number> {
    const result = await this.dbService.query(
      'SELECT AVG(age) as averageAge FROM students',
    );
    return result?.[0]?.averageAge || 0;
  }
}
