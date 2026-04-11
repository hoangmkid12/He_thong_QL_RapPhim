const router = require('express').Router();
const ctrl = require('../controllers/phong.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/rbac');

// Public
router.get('/rap/:id_rap', ctrl.getByRap);
router.get('/:id/ghe', ctrl.getSeatMap);
router.get('/:id', ctrl.getOne);

// Protected - tạo/sửa/xóa phòng
router.post('/', authenticate, requirePermission('themphong'), ctrl.create);
router.put('/:id', authenticate, requirePermission('suaphong'), ctrl.update);
router.delete('/:id', authenticate, requirePermission('xoaphong'), ctrl.remove);
router.post('/:id/generate-seats', authenticate, requirePermission('suaphong'), ctrl.generateSeatMap);

module.exports = router;
