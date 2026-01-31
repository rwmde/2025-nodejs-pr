import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models';

interface UserPayload {
    id: string;
    email: string;
    role: number;
}

export interface AuthRequest extends Request {
    user?: UserPayload
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as UserPayload;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const authorize = (roles: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const user = await User.findByPk(req.user.id, { include: [Role] });

            if (!user || !user.Role) {
                return res.status(403).json({ message: 'Forbidden: Role not found' });
            }

            if (!roles.includes(user.Role.name)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }

            next();
        } catch (error) {
            console.error('Authorization error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};
