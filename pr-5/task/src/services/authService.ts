import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET || 'mysecret';

export function generateToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
