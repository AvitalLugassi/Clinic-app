import crypto from 'crypto';
import pool from '../config/db.mysql.js';
import { sendOtpEmail } from '../services/email.service.js';

const VALID_PURPOSES = ['view_records', 'view_prescriptions', 'view_files'];
const OTP_TTL_MINUTES = 10;

export const requestOtp = async (req, res) => {
  const { purpose } = req.body;
  if (!VALID_PURPOSES.includes(purpose))
    return res.status(400).json({ message: 'Invalid purpose' });

  const [rows] = await pool.query('SELECT email FROM users WHERE id = ?', [req.user.id]);
  const user = rows[0];
  if (!user?.email) return res.status(400).json({ message: 'No email on file' });

  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await pool.query(
    'DELETE FROM otps WHERE user_id = ? AND purpose = ?',
    [req.user.id, purpose]
  );
  await pool.query(
    'INSERT INTO otps (user_id, code, purpose, expires_at) VALUES (?, ?, ?, ?)',
    [req.user.id, code, purpose, expiresAt]
  );

  await sendOtpEmail(user.email, code, purpose);
  res.json({ message: 'OTP sent', email: user.email.replace(/(.{2}).+(@.+)/, '$1***$2') });
};

export const verifyOtp = async (req, res) => {
  const { code, purpose } = req.body;
  if (!code || !purpose) return res.status(400).json({ message: 'Missing fields' });

  const [rows] = await pool.query(
    'SELECT id, expires_at, used FROM otps WHERE user_id = ? AND code = ? AND purpose = ?',
    [req.user.id, code, purpose]
  );

  const otp = rows[0];
  if (!otp) return res.status(401).json({ message: 'Invalid OTP' });
  if (otp.used) return res.status(401).json({ message: 'OTP already used' });
  if (new Date() > new Date(otp.expires_at))
    return res.status(401).json({ message: 'OTP expired' });

  await pool.query('UPDATE otps SET used = 1 WHERE id = ?', [otp.id]);

  const otpToken = `${req.user.id}:${purpose}:${Date.now() + OTP_TTL_MINUTES * 60 * 1000}`;
  const encoded = Buffer.from(otpToken).toString('base64');

  res.json({ otpToken: encoded });
};
