const router = require('express').Router();
const leave = require('../controllers/leave.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/rbac');

// ─── Đơn nghỉ phép ───────────────────────────────────────────────
// Mọi nhân viên (Staff 1, Manager 3, Admin 2) đều xem được danh sách của mình (Manager/Admin xem rộng hơn)
router.get('/', authenticate, leave.getAll);

// Đăng ký đơn nghỉ phép (Chủ yếu cho Staff Role 1 và Manager Role 3)
router.post('/', authenticate, leave.create);

// Duyệt đơn nghỉ phép (Chỉ cho Manager Role 3 và Admin Role 2)
// Quyền 'DuyetDonNghiPhep' chưa có trong DB, ta dùng Role kiểm tra trong controller hoặc tạo mới permission
router.patch('/:id/status', authenticate, leave.updateStatus);

module.exports = router;
