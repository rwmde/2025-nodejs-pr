import { generateToken, verifyToken } from '../services/authService';

describe('authService', () => {
  it('should generate and verify token', () => {
    const payload = { id: '123', email: 'test@example.com', role: 'admin' };
    const token = generateToken(payload);
    expect(typeof token).toBe('string');

    const decoded: any = verifyToken(token);
    expect(decoded.email).toBe('test@example.com');
    expect(decoded.role).toBe('admin');
  });

  it('should return null for invalid token', () => {
    const decoded = verifyToken('invalid.token.value');
    expect(decoded).toBeNull();
  });
});
