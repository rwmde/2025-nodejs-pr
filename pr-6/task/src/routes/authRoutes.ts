import { Router } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { generateToken } from '../services/authService';
import { registerSchema, loginSchema } from '../validators/authValidator';
import { Role } from '../models/Role';
import { logInfo, logError } from '../logger/logger';

const router = Router();

/* ============================
  LOGIN
============================ */
router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    logError(`Login validation error: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const user = await User.findOne({
      where: { email: req.body.email as string },
      include: [{ model: Role }] // правильный синтаксис include
    });

    if (!user) {
      logError('Login failed: user not found');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok) {
      logError('Login failed: wrong password');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      id: user.id,
      role: user.role?.name,
      email: user.email
    });

    logInfo(`User logged in: ${user.email}`);
    res.json({ token });
  } catch (err: any) {
    logError(`Login error: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ============================
  REGISTER
============================ */
router.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    logError(`Register validation error: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, surname, email, password, roleId } = req.body;

  try {
    const exists = await User.findOne({ where: { email: email as string } });
    if (exists) {
      logError(`Register failed: email exists ${email}`);
      return res.status(400).json({ error: 'Email already exists' });
    }

    const role = await Role.findByPk(roleId as string);
    if (!role) {
      logError(`Register failed: invalid roleId ${roleId}`);
      return res.status(400).json({ error: 'Invalid roleId' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      surname,
      email,
      password: hashed,
      roleId
    });

    logInfo(`User registered: ${email} with role ${role.name}`);

    res.json({
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: role.name
    });
  } catch (err: any) {
    logError(`Register error: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
