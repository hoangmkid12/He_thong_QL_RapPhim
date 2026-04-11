const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { query, queryOne, execute, insert } = require('../config/db');
const { updateRankIfChanged } = require('../utils/userRank.helper');

// ─── JWT helpers ────────────────────────────────────────────────
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    user: user.user,
    name: user.name,
    email: user.email,
    vai_tro: user.vai_tro,
    id_rap: user.id_rap,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
  return { accessToken, refreshToken };
};

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ─── Email transporter ──────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

// ─── Controllers ────────────────────────────────────────────────

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { user: username, pass } = req.body;
    if (!username || !pass) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tài khoản và mật khẩu' });
    }

    const user = await queryOne(
      'SELECT * FROM taikhoan WHERE user = ? LIMIT 1',
      [username]
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Tài khoản hoặc mật khẩu không đúng' });
    }

    // Support both bcrypt hashed and plain text passwords (migration period)
    let passwordMatch = false;
    if (user.pass.startsWith('$2')) {
      passwordMatch = await bcrypt.compare(pass, user.pass);
    } else {
      passwordMatch = (pass === user.pass); // plain text (legacy)
    }

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Tài khoản hoặc mật khẩu không đúng' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    setRefreshCookie(res, refreshToken);

    const { pass: _, ...userSafe } = user;
    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: { user: userSafe, accessToken },
    });
  } catch (err) {
    console.error('[AUTH] login error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, phone, dia_chi, user: username, pass, email } = req.body;

    if (!name || !phone || !dia_chi || !username || !pass || !email) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Email không hợp lệ' });
    }

    if (pass.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ success: false, message: 'Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới' });
    }

    const existEmail = await queryOne('SELECT id FROM taikhoan WHERE email = ? LIMIT 1', [email]);
    if (existEmail) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }

    const existUser = await queryOne('SELECT id FROM taikhoan WHERE user = ? LIMIT 1', [username]);
    if (existUser) {
      return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
    }

    const hashedPass = await bcrypt.hash(pass, 10);
    await execute(
      'INSERT INTO taikhoan (email, user, pass, dia_chi, phone, name, vai_tro, id_rap, img) VALUES (?,?,?,?,?,?,0,NULL,"")',
      [email, username, hashedPass, dia_chi, phone, name]
    );

    return res.status(201).json({ success: true, message: 'Đăng ký thành công! Vui lòng đăng nhập.' });
  } catch (err) {
    console.error('[AUTH] register error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * POST /api/auth/refresh
 */
const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Không có refresh token' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
    }

    const user = await queryOne('SELECT * FROM taikhoan WHERE id = ? LIMIT 1', [decoded.id]);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    setRefreshCookie(res, newRefreshToken);

    return res.json({ success: true, data: { accessToken } });
  } catch (err) {
    console.error('[AUTH] refresh error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * POST /api/auth/logout
 */
const logout = (req, res) => {
  res.clearCookie('refreshToken');
  return res.json({ success: true, message: 'Đã đăng xuất' });
};

/**
 * GET /api/auth/me — get current user from token
 */
const me = async (req, res) => {
  try {
    const userId = req.user.id;
    // 1. Update rank first to ensure 'me' returns fresh data
    const userPoints = await queryOne('SELECT tong_diem_tich_luy FROM taikhoan WHERE id = ?', [userId]);
    if (userPoints) {
      await updateRankIfChanged(require('../config/db'), userId, userPoints.tong_diem_tich_luy);
    }

    const user = await queryOne(
      'SELECT id, user, name, email, phone, dia_chi, vai_tro, id_rap, img, id_diem, diem_tich_luy, hang_thanh_vien FROM taikhoan WHERE id = ? LIMIT 1',
      [userId]
    );
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    return res.json({ success: true, data: user });
  } catch (err) {
    console.error('[AUTH] me error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * POST /api/auth/forgot-password/send-otp
 */
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Vui lòng nhập email' });

    const user = await queryOne('SELECT id, email, name FROM taikhoan WHERE email = ? LIMIT 1', [email]);
    if (!user) return res.status(404).json({ success: false, message: 'Email không tồn tại trong hệ thống' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in DB (simple approach using a temp field or separate table)
    // Using a JSON column or temp storage — here we use a simple update approach
    // In production, use a separate otp_tokens table
    req.app.locals.otpStore = req.app.locals.otpStore || {};
    req.app.locals.otpStore[email] = { otp, expiry: expiry.getTime() };

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Galaxy Studio'}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Mã OTP xác nhận quên mật khẩu - Galaxy Studio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #e50914;">🎬 Galaxy Studio</h2>
          <p>Xin chào <strong>${user.name}</strong>,</p>
          <p>Mã OTP của bạn để đổi mật khẩu là:</p>
          <div style="font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 8px; padding: 20px; background: #fff; border-radius: 8px; border: 2px dashed #e50914; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666;">Mã có hiệu lực trong <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với ai.</p>
          <hr>
          <p style="font-size: 12px; color: #999;">Email này được gửi tự động từ hệ thống Galaxy Studio.</p>
        </div>
      `,
    });

    return res.json({ success: true, message: 'Đã gửi mã OTP về email. Vui lòng kiểm tra hộp thư.' });
  } catch (err) {
    console.error('[AUTH] sendOtp error:', err);
    return res.status(500).json({ success: false, message: 'Không thể gửi email. Vui lòng thử lại.' });
  }
};

/**
 * POST /api/auth/forgot-password/verify-otp
 */
const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  const store = req.app.locals.otpStore || {};
  const record = store[email];

  if (!record || record.otp !== otp || Date.now() > record.expiry) {
    return res.status(400).json({ success: false, message: 'Mã OTP không đúng hoặc đã hết hạn' });
  }
  // Mark as verified
  req.app.locals.otpStore[email].verified = true;
  return res.json({ success: true, message: 'Xác thực OTP thành công' });
};

/**
 * POST /api/auth/forgot-password/reset
 */
const resetPassword = async (req, res) => {
  try {
    const { email, pass1, pass2 } = req.body;
    const store = req.app.locals.otpStore || {};
    const record = store[email];

    if (!record || !record.verified) {
      return res.status(400).json({ success: false, message: 'Phiên xác thực không hợp lệ. Vui lòng thực hiện lại.' });
    }
    if (!pass1 || pass1.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }
    if (pass1 !== pass2) {
      return res.status(400).json({ success: false, message: 'Mật khẩu nhập lại không khớp' });
    }

    const hashedPass = await bcrypt.hash(pass1, 10);
    await execute('UPDATE taikhoan SET pass = ? WHERE email = ?', [hashedPass, email]);
    delete req.app.locals.otpStore[email];

    return res.json({ success: true, message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.' });
  } catch (err) {
    console.error('[AUTH] resetPassword error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res) => {
  try {
    const { pass, passmoi, passmoi1 } = req.body;
    const userId = req.user.id;

    if (!pass || !passmoi || !passmoi1) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }
    if (passmoi !== passmoi1) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới không trùng nhau' });
    }
    if (passmoi.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    const user = await queryOne('SELECT pass FROM taikhoan WHERE id = ?', [userId]);
    let oldOk = false;
    if (user.pass.startsWith('$2')) {
      oldOk = await bcrypt.compare(pass, user.pass);
    } else {
      oldOk = pass === user.pass;
    }
    if (!oldOk) {
      return res.status(400).json({ success: false, message: 'Mật khẩu cũ không đúng' });
    }

    const hashed = await bcrypt.hash(passmoi, 10);
    await execute('UPDATE taikhoan SET pass = ? WHERE id = ?', [hashed, userId]);
    return res.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    console.error('[AUTH] changePassword error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * POST /api/auth/guest — create or retrieve guest account
 */
const createGuest = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!name || !phone || !email) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }
    if (!/^0[0-9]{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ (phải có 10 số)' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Email không hợp lệ' });
    }

    // Check if guest with this phone already exists
    let guest = await queryOne('SELECT * FROM taikhoan WHERE phone = ? AND vai_tro = -1 LIMIT 1', [phone]);
    if (guest) {
      await execute('UPDATE taikhoan SET name = ?, email = ? WHERE id = ?', [name, email, guest.id]);
      guest = await queryOne('SELECT * FROM taikhoan WHERE id = ?', [guest.id]);
    } else {
      const username = `guest_${phone}`;
      const password = Math.random().toString(36).substring(2, 10);
      const hashedPass = await bcrypt.hash(password, 10);
      const id = await insert(
        'INSERT INTO taikhoan (name, user, pass, email, phone, dia_chi, vai_tro, id_rap, img) VALUES (?,?,?,?,?,"",-1,NULL,"")',
        [name, username, hashedPass, email, phone]
      );
      guest = await queryOne('SELECT * FROM taikhoan WHERE id = ?', [id]);
    }

    const { accessToken, refreshToken } = generateTokens(guest);
    setRefreshCookie(res, refreshToken);
    const { pass: _, ...guestSafe } = guest;

    return res.json({
      success: true,
      message: 'Tạo tài khoản khách thành công',
      data: { user: guestSafe, accessToken, isGuest: true },
    });
  } catch (err) {
    console.error('[AUTH] createGuest error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { login, register, refresh, logout, me, sendOtp, verifyOtp, resetPassword, changePassword, createGuest };
