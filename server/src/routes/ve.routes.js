const router = require('express').Router();
const ctrl = require('../controllers/ve.controller');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');

router.post('/dat-ve', authenticate, ctrl.datVe);
router.post('/pos', authenticate, ctrl.datVePOS);
router.get('/my', authenticate, ctrl.getMyVe);
router.get('/admin', authenticate, requireAdmin, ctrl.getAllAdmin);
router.get('/:id', authenticate, ctrl.getOne);
router.post('/:id/huy', authenticate, ctrl.huyVe);
router.put('/:id/trang-thai', authenticate, requireAdmin, ctrl.updateTrangThai);

module.exports = router;
