import { UserService } from '../useCases/user-flow/user.service';
import { DatabaseService } from '../shared/db-service';
import { User, UserLogin } from '../shared/types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../shared/db-service');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const createUser = (overrides?: Partial<User>): User => ({
  name: 'John',
  surname: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  ...overrides,
});

const createUserLogin = (overrides?: Partial<UserLogin>): UserLogin => ({
  email: 'john@example.com',
  password: 'password123',
  ...overrides,
});

const createUserRecord = (overrides?: Partial<any>) => ({
  userId: 1,
  email: 'john@example.com',
  passwordHash: 'hashedPassword123',
  name: 'John',
  surname: 'Doe',
  roleId: 2,
  ...overrides,
});

describe('UserService', () => {
  let userService: UserService;
  let mockDbService: jest.Mocked<DatabaseService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDbService = new DatabaseService() as jest.Mocked<DatabaseService>;
    mockDbService.onModuleInit = jest.fn();
    mockDbService.query = jest.fn();
    userService = new UserService(mockDbService);
  });

  describe('registerUser', () => {
    it('should successfully register a new user with default role', async () => {
      const user = createUser();

      mockDbService.query
        .mockResolvedValueOnce([{ roleId: 2 }]) // Role lookup
        .mockResolvedValueOnce([]) // Check existing user
        .mockResolvedValueOnce([]); // Insert user

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');

      const result = await userService.registerUser(user);

      expect(result).toBeTruthy();
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockDbService.query).toHaveBeenCalledTimes(3);
    });

    it('should use default roleId when role lookup fails', async () => {
      const user = createUser({
        name: 'Jane',
        surname: 'Smith',
        email: 'jane@example.com',
        password: 'securepass456',
      });

      mockDbService.query
        .mockRejectedValueOnce(new Error('Role lookup failed'))
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword456');

      const result = await userService.registerUser(user);

      expect(result).toBeTruthy();
      expect(mockDbService.query).toHaveBeenCalledTimes(3);
    });

    it('should return false when user with email already exists', async () => {
      const user = createUser({
        name: 'Bob',
        surname: 'Johnson',
        email: 'bob@example.com',
        password: 'password789',
      });

      mockDbService.query
        .mockResolvedValueOnce([{ roleId: 2 }])
        .mockResolvedValueOnce([{ userId: 1, email: 'bob@example.com' }]); // User exists

      const result = await userService.registerUser(user);

      expect(result).toBeFalsy();
    });
  });

  describe('loginUser', () => {
    it('should successfully login user and return token', async () => {
      const userLogin = createUserLogin();
      const userRecord = createUserRecord();

      mockDbService.query.mockResolvedValueOnce([userRecord]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('jwt_token_here');

      const result = await userService.loginUser(userLogin);

      expect(result).toBeDefined();
      expect(result?.token).toBe('jwt_token_here');
      expect(result?.user).toEqual({
        userId: 1,
        email: 'john@example.com',
        roleId: 2,
        name: 'John',
        surname: 'Doe',
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashedPassword123',
      );
      expect(jwt.sign).toHaveBeenCalled();
    });

    it('should return undefined when user credentials are invalid', async () => {
      const userLogin = createUserLogin({ password: 'wrongpassword' });
      const userRecord = createUserRecord();

      mockDbService.query.mockResolvedValueOnce([userRecord]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await userService.loginUser(userLogin);

      expect(result).toBeUndefined();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        'hashedPassword123',
      );
    });

    it('should return undefined when user is not found', async () => {
      const userLogin = createUserLogin({ email: 'nonexistent@example.com' });

      mockDbService.query.mockResolvedValueOnce([]);

      const result = await userService.loginUser(userLogin);

      expect(result).toBeUndefined();
    });

    it('should create JWT token with correct expiration', async () => {
      const userLogin = createUserLogin();
      const userRecord = createUserRecord();

      mockDbService.query.mockResolvedValueOnce([userRecord]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('jwt_token_here');

      await userService.loginUser(userLogin);

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          email: 'john@example.com',
          roleId: 2,
          name: 'John',
          surname: 'Doe',
        }),
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );
    });
  });
});
