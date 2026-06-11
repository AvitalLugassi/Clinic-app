import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.mysql.js';

export const register = async (req, res) => {
  const { full_name, name, email, password, role, phone } = req.body;
  const userName = full_name || name;

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length) return res.status(409).json({ message: 'Email already exists' });

  const password_hash = await bcrypt.hash(password, 10);
  const user_uuid = uuidv4();

  const [result] = await pool.query(
    'INSERT INTO users (user_uuid, full_name, email, password_hash, role, phone, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, NOW())',
    [user_uuid, userName, email, password_hash, role, phone]
  );

  const userId = result.insertId;

  if (role === 'patient') {
    await pool.query('INSERT INTO patients (user_id, created_at) VALUES (?, NOW())', [userId]);
  } else if (role === 'doctor') {
    await pool.query('INSERT INTO doctors (user_id, created_at) VALUES (?, NOW())', [userId]);
  }

  res.status(201).json({ message: 'Registered successfully' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query(
    'SELECT id, email, password_hash, role, is_active FROM users WHERE email = ?',
    [email]
  );

  const user = rows[0];
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.is_active) return res.status(403).json({ message: 'Account disabled' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ id: user.id, role: user.role, email: user.email });
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

export const getMe = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, full_name, email, role, phone FROM users WHERE id = ?',
    [req.user.id]
  );
  if (!rows[0]) return res.status(404).json({ message: 'User not found' });
  res.json(rows[0]);
};
