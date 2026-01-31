import { Router } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { generateToken } from '../services/authService';
import { registerSchema, loginSchema } from '../validators/authValidator';
import { Role } from '../models/Role';

const router = Router();

/* ============================
   🔐  LOGIN
============================ */
router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({
    where: { email: req.body.email },
    include: ['role']
  });

  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

  const token = generateToken({
    id: user.id,
    role: user.role.name,
    email: user.email
  });

  res.json({ token });
});

/* ============================
   📝  REGISTER
============================ */
router.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, surname, email, password, roleId } = req.body;

  // Проверяем, что email уникален
  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(400).json({ error: 'Email already exists' });

  // Проверяем, что роль существует
  const role = await Role.findByPk(roleId);
  if (!role) return res.status(400).json({ error: 'Invalid roleId' });

  // Хэшируем пароль
  const hashed = await bcrypt.hash(password, 10);

  // Создаём пользователя
  const user = await User.create({
    name,
    surname,
    email,
    password: hashed,
    roleId
  });

  res.json({
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: role.name
  });
});

export default router;
