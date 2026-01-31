import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models';

const generateToken = (user: User) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.roleId },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '24h' }
    );
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name, surname } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Get student role
        let studentRole = await Role.findOne({ where: { name: 'student' } });

        if (!studentRole) {
            studentRole = await Role.create({ name: 'student' });
        }

        const user = await User.create({
            email,
            password,
            name,
            surname,
            roleId: studentRole.id
        });

        const token = generateToken(user);

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                role: 'student'
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValidPassword = await user.checkPassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);

        return res.json({
            message: 'Login successful',
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
