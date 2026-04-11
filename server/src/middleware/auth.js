const jwt = require('jsonwebtoken');

/**
 * Middleware: verify JWT access token
 * Attach decoded user payload to req.user
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Chưa đăng nhập hoặc token không tồn tại' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token đã hết hạn', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
};

/**
 * Middleware: optional authentication (doesn't block if no token)
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.cookies?.accessToken;

  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (_) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

module.exports = { authenticate, optionalAuth };
