import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireOtp = (purpose) => (req, res, next) => {
  const otpToken = req.headers['x-otp-token'];
  if (!otpToken) return res.status(403).json({ message: 'OTP required' });

  try {
    const decoded = Buffer.from(otpToken, 'base64').toString('utf8');
    const [userId, tokenPurpose, expiresAt] = decoded.split(':');

    if (Number(userId) !== req.user.id) return res.status(403).json({ message: 'Invalid OTP token' });
    if (tokenPurpose !== purpose) return res.status(403).json({ message: 'Invalid OTP purpose' });
    if (Date.now() > Number(expiresAt)) return res.status(403).json({ message: 'OTP token expired' });

    next();
  } catch {
    res.status(403).json({ message: 'Invalid OTP token' });
  }
};
