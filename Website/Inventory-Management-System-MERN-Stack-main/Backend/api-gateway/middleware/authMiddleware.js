const jwt = require('jsonwebtoken');

const PUBLIC_PATHS = [
  /^\/api\/auth\/signin$/,
  /^\/api\/auth\/signup$/,
  /^\/health$/,
];

const isPublic = (path) => PUBLIC_PATHS.some((re) => re.test(path));

const verifyToken = (req, res, next) => {
  if (isPublic(req.path)) return next();

  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = header.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'change-me-in-production';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { verifyToken, isPublic };
