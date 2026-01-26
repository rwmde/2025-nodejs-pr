import { DatabaseService } from '../../shared/db-service';
import { User, UserLogin } from '../../shared/types';
import { Logger } from '../../utils/logger';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const logger = new Logger();
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET as string;

const defaultRoleId = process.env.DEFAULT_ROLE_ID
  ? parseInt(process.env.DEFAULT_ROLE_ID, 10)
  : 2;

const esc = (v?: string) => (v ? v.replace(/'/g, "''") : v);

export class UserService {
  constructor(private dbService: DatabaseService) {
    this.dbService.onModuleInit();
  }

  async registerUser(user: User): Promise<boolean | void> {
    try {
      const { name, surname, email, password } = user;

      const defaultRoleName = process.env.DEFAULT_ROLE_NAME || 'student';
      let serverRoleId: number | undefined;
      try {
        const rows = await this.dbService.query<{ roleId: number }>(
          `SELECT roleId FROM roles WHERE roleName = '${esc(defaultRoleName)}'`
        );
        serverRoleId = rows && rows[0] && rows[0].roleId;
      } catch (e) {
        logger.log('Role lookup failed, using default roleId', e);
      }

      if (!serverRoleId) {
        serverRoleId = defaultRoleId;
      }

      if (!name || !surname || !email || !password) {
        logger.log('Missing registration fields for user:', email);
        return;
      }

      const checkQuery = `SELECT * FROM users WHERE email = '${esc(email)}'`;
      const existing = await this.dbService.query(checkQuery);
      if (existing && existing.length > 0) {
        logger.log('User with this email already exists:', email);
        return false;
      }

      const passwordHash = await bcrypt.hash(password, saltRounds);

      const query = `
        INSERT INTO users (name, surname, email, passwordHash, roleId)
        VALUES ('${esc(name)}', '${esc(surname)}', '${esc(
        email
      )}', '${passwordHash}', ${serverRoleId})
      `;
      await this.dbService.query(query);
      return true;
    } catch (error) {
      logger.log('Failed to register user:', error);
    }
  }

  async loginUser(
    userLogin: UserLogin
  ): Promise<{ token: string; user: Partial<User> } | void> {
    try {
      const { email, password } = userLogin;

      if (!email || !password) {
        logger.log('Missing login fields');
        return;
      }

      const query = `SELECT * FROM users WHERE email = '${email}'`;
      const results = await this.dbService.query<any>(query);
      const userRecord = results && results[0];

      if (!userRecord) {
        logger.log('User not found:', email);
        return;
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        userRecord.passwordHash
      );

      if (!isPasswordValid) {
        logger.log('Invalid password for user:', email);
        return;
      }

      const payload = {
        userId: userRecord.userId,
        email: userRecord.email,
        roleId: userRecord.roleId,
        name: userRecord.name,
        surname: userRecord.surname,
      };

      const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

      return { token, user: payload };
    } catch (error) {
      logger.log('Failed to login user:', error);
    }
  }
}
