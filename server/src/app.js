require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────
const corsOptions = require('./config/cors');

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Health check ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CinePass API is running 🎬', timestamp: new Date().toISOString() });
});

// ─── Routes ──────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api/phim',       require('./routes/phim.routes'));
app.use('/api/rap',        require('./routes/rap.routes'));
app.use('/api/lich-chieu', require('./routes/lichchieu.routes'));
app.use('/api/ve',         require('./routes/ve.routes'));
app.use('/api/store',      require('./routes/store.routes'));
app.use('/api/tai-khoan',  require('./routes/taikhoan.routes'));
app.use('/api/thong-ke',   require('./routes/thongke.routes'));
app.use('/api/phong',      require('./routes/phong.routes'));
app.use('/api/tin-tuc',    require('./routes/tintuc.routes'));
app.use('/api/lich-lam-viec', require('./routes/lichlamviec.routes'));
app.use('/api/nghi-phep',  require('./routes/leave.routes'));
app.use('/api/voucher',    require('./routes/voucher.routes'));
app.use('/api/phim-rap',   require('./routes/phimrap.routes'));
app.use('/api/cham-cong',  require('./routes/chamcong.routes'));
app.use('/api/thiet-bi',   require('./routes/thietbi.routes'));
app.use('/api/luong',      require('./routes/luong.routes'));
app.use('/api',            require('./routes/misc.routes'));

// ─── 404 handler ─────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} không tồn tại` });
});

// ─── Global error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message || err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File quá lớn (tối đa 5MB)' });
  }
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Lỗi server' : (err.message || 'Lỗi không xác định'),
  });
});

// ─── Start server ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎬 CinePass API Server`);
  console.log(`✅ Đang chạy tại: http://localhost:${PORT}`);
  console.log(`📄 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Môi trường: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
