const router = require('express').Router();
const diem = require('../controllers/diem.controller');
const bl = require('../controllers/binhluan.controller');
const scan = require('../controllers/scanve.controller');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');

// Điểm
router.get('/diem/my', authenticate, diem.getMyHistory);
router.get('/diem/user/:id', authenticate, requireAdmin, diem.getUserPoints);

// Bình luận
router.get('/binh-luan', bl.getAll);
router.post('/binh-luan', authenticate, bl.create);
router.delete('/binh-luan/:id', authenticate, bl.remove);
router.post('/binh-luan/:id/tra-loi', authenticate, requireAdmin, bl.addReply);

// Scan vé
router.post('/scan-ve', authenticate, scan.scanVe);
router.get('/scan-ve/history', authenticate, scan.getScanHistory);

module.exports = router;
