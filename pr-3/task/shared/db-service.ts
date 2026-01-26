import sql from 'mssql';
import { Logger } from '../utils/logger';

export class DatabaseService {
  private pool!: sql.ConnectionPool;
  private logger = new Logger();

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    try {
      const connectionString = process.env.DATABASE_CONNECTION_STRING;

      if (!connectionString) {
        throw new Error(
          'DATABASE_CONNECTION_STRING is not defined in .env file',
        );
      }
      this.pool = await new sql.ConnectionPool(connectionString).connect();
      this.logger.log('Connected to Azure SQL Database successfully');
    } catch (error) {
      this.logger.log('Database connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.logger.log('Database connection closed');
    }
  }

  async query<T = any>(queryString: string): Promise<T[]> {
    try {
      const result = await this.pool.request().query(queryString);
      return result.recordset;
    } catch (error) {
      this.logger.log('Query execution failed:', error);
      throw error;
    }
  }
}
