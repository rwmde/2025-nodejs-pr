import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '../../../shared/db-service';

const jwtSecret = process.env.JWT_SECRET ?? 'change_this_secret';

export interface AuthPayload {
  userId?: number;
  email?: string;
  roleId?: number;
  roleName?: string;
  name?: string;
  surname?: string;
  [key: string]: any;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, jwtSecret) as AuthPayload;
    (req as any).user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const userRolesMapping: { [key: number]: string } = {
  1: 'admin',
  2: 'teacher',
  3: 'student',
};

const validateRole = (roleId: number, allowedRoles: Array<string>): boolean => {
  return allowedRoles.every((allowed) => {
    return userRolesMapping[roleId] === allowed;
  });
};

export const requireRole = (allowedRoles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthPayload | undefined;
    console.log('requireRole middleware - user payload:', user);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    if (user.roleId) {
      const has = validateRole(user.roleId!, allowedRoles);
      if (has) return next();

      return res.status(403).json({ message: 'Forbidden' });
    }

    try {
      const db = new DatabaseService();
      const identifier = user.userId
        ? `u.userId = ${user.userId}`
        : `u.email = '${user.email}'`;
      const q = `SELECT r.roleName, r.roleId FROM users u JOIN roles r ON u.roleId = r.roleId WHERE ${identifier}`;
      const rows = await db.query<{ roleName: string; roleId: number }>(q);
      const row = rows && rows[0];

      if (!row) return res.status(403).json({ message: 'Forbidden' });

      if (validateRole(row.roleId, allowedRoles)) return next();

      return res.status(403).json({ message: 'Forbidden' });
    } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err });
    }
  };
};
