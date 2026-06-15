import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.mysql.js';
import { sendRegistrationOtp, sendStaffActivationOtp } from '../services/email.service.js';

const STAFF_EMAIL_DOMAIN = '@clinic-app.com';
const hashId = (id) => crypto.createHash('sha256').update(id).digest('hex');

const COOKIE_OPTS = { httpOnly: true, sameSite: 'lax' };

const signAndSend = async (res, user) => {
  const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [user.id, newRefreshToken, expiresAt]
  );

  res.cookie('token', accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', newRefreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ id: user.id, role: user.role });
};

export const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const [rows] = await pool.query('SELECT id FROM refresh_tokens WHERE token = ? AND user_id = ?', [token, user.id]);
    if (!rows[0]) return res.status(401).json({ message: 'Invalid refresh token' });

    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.cookie('token', accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
    res.json({ id: user.id, role: user.role });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// שלב 1: פציינט מזין ת"ז — בדיקה במערכת ושליחת OTP
export const patientPreRegister = async (req, res) => {
  const { id_number } = req.body;
  if (!id_number) return res.status(400).json({ message: 'Missing id_number' });

  const [rows] = await pool.query(
    'SELECT id, email, is_app_registered FROM users WHERE national_id_hash = ? AND role = ?',
    [hashId(id_number), 'patient']
  );
  const user = rows[0];

  if (!user) return res.status(404).json({ message: 'אינך לקוח של הקליניקה. גש לסניף הקרוב להירשם.' });
  if (user.is_app_registered) return res.status(409).json({ message: 'משתמש זה כבר רשום באפליקציה' });

  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await pool.query('DELETE FROM otps WHERE user_id = ? AND purpose = ?', [user.id, 'registration']);
  await pool.query(
    'INSERT INTO otps (user_id, code, purpose, expires_at) VALUES (?, ?, ?, ?)',
    [user.id, code, 'registration', expiresAt]
  );

  await sendRegistrationOtp(user.email, code);

  const maskedEmail = user.email.replace(/(.{2}).+(@.+)/, '$1***$2');
  res.json({ message: 'נשלח קוד לכתובת המייל', email: maskedEmail });
};

// שלב 2: אימות OTP + קביעת סיסמה
export const patientCompleteRegister = async (req, res) => {
  const { id_number, otp, password } = req.body;
  if (!id_number || !otp || !password) return res.status(400).json({ message: 'Missing fields' });
  if (password.length < 6) return res.status(400).json({ message: 'הסיסמה חייבת להכיל לפחות 6 תווים' });

  const [rows] = await pool.query(
    'SELECT id FROM users WHERE national_id_hash = ? AND role = ?',
    [hashId(id_number), 'patient']
  );
  const user = rows[0];
  if (!user) return res.status(404).json({ message: 'משתמש לא נמצא' });

  const [otpRows] = await pool.query(
    'SELECT id, expires_at, used FROM otps WHERE user_id = ? AND code = ? AND purpose = ?',
    [user.id, otp, 'registration']
  );
  const record = otpRows[0];
  if (!record) return res.status(401).json({ message: 'קוד שגוי' });
  if (record.used) return res.status(401).json({ message: 'קוד כבר נוצל' });
  if (new Date() > new Date(record.expires_at)) return res.status(401).json({ message: 'הקוד פג תוקף' });

  const password_hash = await bcrypt.hash(password, 10);
  await pool.query('UPDATE users SET password_hash = ?, is_app_registered = 1, is_active = 1 WHERE id = ?', [password_hash, user.id]);
  await pool.query('UPDATE otps SET used = 1 WHERE id = ?', [record.id]);

  res.json({ message: 'נרשמת בהצלחה! כעת תוכל/י להתחבר.' });
};

// רישום רופא/אדמין — רק ע"י אדמין
// רופא נוצר ללא סיסמה (is_app_registered=0) ומשלים הפעלה בנפרד
export const staffRegister = async (req, res) => {
  const { full_name, email, role, phone, id_number } = req.body;
  if (!full_name || !email || !role) return res.status(400).json({ message: 'Missing fields' });
  if (!['doctor', 'admin'].includes(role)) return res.status(400).json({ message: 'תפקיד לא חוקי' });
  if (!email.endsWith(STAFF_EMAIL_DOMAIN)) return res.status(400).json({ message: `מייל חייב להסתיים ב-${STAFF_EMAIL_DOMAIN}` });
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length) return res.status(409).json({ message: 'מייל כבר קיים במערכת' });

  const user_uuid = uuidv4();
  const isDoctor = role === 'doctor';

  const [result] = await pool.query(
    'INSERT INTO users (user_uuid, full_name, email, password_hash, national_id_hash, role, phone, is_active, is_app_registered, created_at) VALUES (?, ?, ?, NULL, ?, ?, ?, 1, 0, NOW())',
    [user_uuid, full_name, email, id_number ? hashId(id_number) : null, role, phone || null]
  );

  if (isDoctor) {
    await pool.query('INSERT INTO doctors (user_id, created_at) VALUES (?, NOW())', [result.insertId]);
  }

  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await pool.query('INSERT INTO otps (user_id, code, purpose, expires_at) VALUES (?, ?, ?, ?)', [result.insertId, code, 'activation', expiresAt]);
  await sendStaffActivationOtp(email, code, role);

  res.status(201).json({ message: `${isDoctor ? 'רופא' : 'אדמין'} נוסף בהצלחה. נשלח קוד הפעלה למייל.` });
};

// שלב 1: צוות מזין מייל — שליחת OTP להפעלת חשבון
export const doctorPreActivate = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Missing email' });

  const [rows] = await pool.query(
    "SELECT id, role FROM users WHERE email = ? AND role IN ('doctor','admin') AND is_app_registered = 0 AND is_active = 1",
    [email]
  );
  const user = rows[0];
  if (!user) return res.status(404).json({ message: 'לא נמצא חשבון ממתין להפעלה עבור מייל זה' });

  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await pool.query('DELETE FROM otps WHERE user_id = ? AND purpose = ?', [user.id, 'activation']);
  await pool.query('INSERT INTO otps (user_id, code, purpose, expires_at) VALUES (?, ?, ?, ?)', [user.id, code, 'activation', expiresAt]);

  await sendStaffActivationOtp(email, code, user.role);
  res.json({ message: 'נשלח קוד אימות לכתובת המייל' });
};

// שלב 2: צוות מאמת OTP וקובע סיסמה
export const doctorCompleteActivate = async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) return res.status(400).json({ message: 'Missing fields' });
  if (password.length < 6) return res.status(400).json({ message: 'הסיסמה חייבת להכיל לפחות 6 תווים' });

  const [rows] = await pool.query(
    "SELECT id FROM users WHERE email = ? AND role IN ('doctor','admin') AND is_app_registered = 0",
    [email]
  );
  const user = rows[0];
  if (!user) return res.status(404).json({ message: 'משתמש לא נמצא' });

  const [otpRows] = await pool.query(
    'SELECT id, expires_at, used FROM otps WHERE user_id = ? AND code = ? AND purpose = ?',
    [user.id, otp, 'activation']
  );
  const record = otpRows[0];
  if (!record) return res.status(401).json({ message: 'קוד שגוי' });
  if (record.used) return res.status(401).json({ message: 'קוד כבר נוצל' });
  if (new Date() > new Date(record.expires_at)) return res.status(401).json({ message: 'הקוד פג תוקף' });

  const password_hash = await bcrypt.hash(password, 10);
  await pool.query('UPDATE users SET password_hash = ?, is_app_registered = 1 WHERE id = ?', [password_hash, user.id]);
  await pool.query('UPDATE otps SET used = 1 WHERE id = ?', [record.id]);

  res.json({ message: 'החשבון הופעל בהצלחה! כעת תוכל/י להתחבר.' });
};

// רישום פציינט ע"י אדמין (ללא אפשרות אפליקציה עדיין)
export const adminRegisterPatient = async (req, res) => {
  const { full_name, id_number, email, phone } = req.body;
  if (!full_name || !id_number || !email) return res.status(400).json({ message: 'Missing fields' });

  const [existing] = await pool.query('SELECT id FROM users WHERE national_id_hash = ?', [hashId(id_number)]);
  if (existing.length) return res.status(409).json({ message: 'תעודת זהות כבר קיימת במערכת' });

  const user_uuid = uuidv4();
  const [result] = await pool.query(
    'INSERT INTO users (user_uuid, full_name, email, national_id_hash, role, phone, is_active, is_app_registered, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, 0, NOW())',
    [user_uuid, full_name, email, hashId(id_number), 'patient', phone || null]
  );

  await pool.query('INSERT INTO patients (user_id, created_at) VALUES (?, NOW())', [result.insertId]);

  res.status(201).json({ message: 'מטופל נרשם בהצלחה' });
};

export const patientLogin = async (req, res) => {
  const { id_number, password } = req.body;
  if (!id_number || !password) return res.status(400).json({ message: 'Missing fields' });

  const [rows] = await pool.query(
    'SELECT id, password_hash, role, is_active, is_app_registered FROM users WHERE national_id_hash = ? AND role = ?',
    [hashId(id_number), 'patient']
  );
  const user = rows[0];
  if (!user || !user.password_hash || !(await bcrypt.compare(password, user.password_hash)))
    return res.status(401).json({ message: 'תעודת זהות או סיסמה שגויים' });
  if (!user.is_active) return res.status(403).json({ message: 'החשבון מושבת' });
  if (!user.is_app_registered) return res.status(403).json({ message: 'עליך להשלים את תהליך הרישום לאפליקציה' });

  signAndSend(res, user);
};

export const staffLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  if (!email.endsWith(STAFF_EMAIL_DOMAIN))
    return res.status(401).json({ message: 'מייל שגוי או סיסמה שגויה' });

  const [rows] = await pool.query(
    "SELECT id, password_hash, role, is_active, is_app_registered FROM users WHERE email = ? AND role IN ('doctor', 'admin')",
    [email]
  );
  const user = rows[0];
  if (!user || !user.password_hash || !(await bcrypt.compare(password, user.password_hash)))
    return res.status(401).json({ message: 'מייל שגוי או סיסמה שגויה' });
  if (!user.is_active) return res.status(403).json({ message: 'החשבון מושבת' });
  if (!user.is_app_registered) return res.status(403).json({ message: 'עליך להשלים את הפעלת החשבון', code: 'ACCOUNT_NOT_ACTIVATED' });

  signAndSend(res, user);
};

export const logout = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) await pool.query('DELETE FROM refresh_tokens WHERE token = ?', [token]);
  res.clearCookie('token');
  res.clearCookie('refreshToken');
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
