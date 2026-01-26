import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  authenticate,
  requireRole,
  AuthPayload,
} from '../useCases/user-flow/middleware/auth';
import { DatabaseService } from '../shared/db-service';

jest.mock('jsonwebtoken');
jest.mock('../shared/db-service');

const createMockRequest = (overrides?: Partial<Request>): Partial<Request> => ({
  headers: {},
  ...overrides,
});

const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const createMockNext = (): NextFunction => jest.fn();

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should return 401 when no authorization header is provided', () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      authenticate(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header does not start with Bearer', () => {
      const req = createMockRequest({
        headers: { authorization: 'Basic sometoken' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      authenticate(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', () => {
      const req = createMockRequest({
        headers: { authorization: 'Bearer invalidtoken' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authenticate(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next and attach user to request when token is valid', () => {
      const payload: AuthPayload = {
        userId: 1,
        email: 'test@example.com',
        roleId: 1,
        roleName: 'admin',
      };

      const req = createMockRequest({
        headers: { authorization: 'Bearer validtoken' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      (jwt.verify as jest.Mock).mockReturnValue(payload);

      authenticate(req as Request, res as Response, next);

      expect(jwt.verify).toHaveBeenCalledWith('validtoken', expect.any(String));
      expect((req as any).user).toEqual(payload);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should extract token correctly from Bearer header', () => {
      const payload: AuthPayload = { userId: 1, email: 'test@example.com' };
      const req = createMockRequest({
        headers: { authorization: 'Bearer myspecialtoken123' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      (jwt.verify as jest.Mock).mockReturnValue(payload);

      authenticate(req as Request, res as Response, next);

      expect(jwt.verify).toHaveBeenCalledWith(
        'myspecialtoken123',
        expect.any(String),
      );
    });
  });

  describe('requireRole', () => {
    it('should return 401 when user is not attached to request', async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(['admin']);
      await middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next when user has admin role (roleId: 1)', async () => {
      const req = createMockRequest() as any;
      req.user = { userId: 1, roleId: 1 };
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(['admin']);
      await middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should call next when user has teacher role (roleId: 2)', async () => {
      const req = createMockRequest() as any;
      req.user = { userId: 1, roleId: 2 };
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(['teacher']);
      await middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should call next when user has student role (roleId: 3)', async () => {
      const req = createMockRequest() as any;
      req.user = { userId: 1, roleId: 3 };
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(['student']);
      await middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 when user role is not in allowed roles', async () => {
      const req = createMockRequest() as any;
      req.user = { userId: 1, roleId: 3 }; // student
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(['admin']);
      await middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 when teacher tries to access admin-only route', async () => {
      const req = createMockRequest() as any;
      req.user = { userId: 1, roleId: 2 }; // teacher
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(['admin']);
      await middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    });

    it('should query database when roleId is not in payload', async () => {
      const req = createMockRequest() as any;
      req.user = { userId: 1, email: 'test@example.com' }; // No roleId
      const res = createMockResponse();
      const next = createMockNext();

      const mockDbService =
        new DatabaseService() as jest.Mocked<DatabaseService>;
      mockDbService.query = jest
        .fn()
        .mockResolvedValue([{ roleName: 'admin', roleId: 1 }]);
      (DatabaseService as jest.Mock).mockImplementation(() => mockDbService);

      const middleware = requireRole(['admin']);
      await middleware(req as Request, res as Response, next);

      expect(mockDbService.query).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 when database query returns no rows', async () => {
      const req = createMockRequest() as any;
      req.user = { userId: 1, email: 'test@example.com' }; // No roleId
      const res = createMockResponse();
      const next = createMockNext();

      const mockDbService =
        new DatabaseService() as jest.Mocked<DatabaseService>;
      mockDbService.query = jest.fn().mockResolvedValue([]);
      (DatabaseService as jest.Mock).mockImplementation(() => mockDbService);

      const middleware = requireRole(['admin']);
      await middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    });

    it('should return 403 when database query returns null', async () => {
      const req = createMockRequest() as any;
      req.user = { userId: 1, email: 'test@example.com' }; // No roleId
      const res = createMockResponse();
      const next = createMockNext();

      const mockDbService =
        new DatabaseService() as jest.Mocked<DatabaseService>;
      mockDbService.query = jest.fn().mockResolvedValue(null);
      (DatabaseService as jest.Mock).mockImplementation(() => mockDbService);

      const middleware = requireRole(['admin']);
      await middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    });

    it('should return 500 when database query throws error', async () => {
      const req = createMockRequest() as any;
      req.user = { userId: 1, email: 'test@example.com' }; // No roleId
      const res = createMockResponse();
      const next = createMockNext();

      const mockDbService =
        new DatabaseService() as jest.Mocked<DatabaseService>;
      const dbError = new Error('Database connection failed');
      mockDbService.query = jest.fn().mockRejectedValue(dbError);
      (DatabaseService as jest.Mock).mockImplementation(() => mockDbService);

      const middleware = requireRole(['admin']);
      await middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error',
        error: dbError,
      });
    });

    it('should use email identifier when userId is not available', async () => {
      const req = createMockRequest() as any;
      req.user = { email: 'test@example.com' }; // No userId, no roleId
      const res = createMockResponse();
      const next = createMockNext();

      const mockDbService =
        new DatabaseService() as jest.Mocked<DatabaseService>;
      mockDbService.query = jest
        .fn()
        .mockResolvedValue([{ roleName: 'admin', roleId: 1 }]);
      (DatabaseService as jest.Mock).mockImplementation(() => mockDbService);

      const middleware = requireRole(['admin']);
      await middleware(req as Request, res as Response, next);

      expect(mockDbService.query).toHaveBeenCalledWith(
        expect.stringContaining("u.email = 'test@example.com'"),
      );
    });

    it('should use userId identifier when available', async () => {
      const req = createMockRequest() as any;
      req.user = { userId: 42, email: 'test@example.com' }; // Has userId, no roleId
      const res = createMockResponse();
      const next = createMockNext();

      const mockDbService =
        new DatabaseService() as jest.Mocked<DatabaseService>;
      mockDbService.query = jest
        .fn()
        .mockResolvedValue([{ roleName: 'admin', roleId: 1 }]);
      (DatabaseService as jest.Mock).mockImplementation(() => mockDbService);

      const middleware = requireRole(['admin']);
      await middleware(req as Request, res as Response, next);

      expect(mockDbService.query).toHaveBeenCalledWith(
        expect.stringContaining('u.userId = 42'),
      );
    });

    it('should return 403 when db role does not match allowed roles', async () => {
      const req = createMockRequest() as any;
      req.user = { userId: 1, email: 'test@example.com' }; // No roleId
      const res = createMockResponse();
      const next = createMockNext();

      const mockDbService =
        new DatabaseService() as jest.Mocked<DatabaseService>;
      mockDbService.query = jest
        .fn()
        .mockResolvedValue([{ roleName: 'student', roleId: 3 }]);
      (DatabaseService as jest.Mock).mockImplementation(() => mockDbService);

      const middleware = requireRole(['admin']);
      await middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    });
  });

  describe('Role Mapping', () => {
    it('should correctly map roleId 1 to admin', async () => {
      const req = createMockRequest() as any;
      req.user = { userId: 1, roleId: 1 };
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(['admin']);
      await middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should correctly map roleId 2 to teacher', async () => {
      const req = createMockRequest() as any;
      req.user = { userId: 1, roleId: 2 };
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(['teacher']);
      await middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should correctly map roleId 3 to student', async () => {
      const req = createMockRequest() as any;
      req.user = { userId: 1, roleId: 3 };
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(['student']);
      await middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 403 for unknown roleId', async () => {
      const req = createMockRequest() as any;
      req.user = { userId: 1, roleId: 99 }; // Unknown roleId
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = requireRole(['admin']);
      await middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    });
  });
});
