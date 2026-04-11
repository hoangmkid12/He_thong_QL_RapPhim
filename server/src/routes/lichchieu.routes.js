const router = require('express').Router();
const ctrl = require('../controllers/lichchieu.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/rbac');

router.get('/', ctrl.getAll);
router.get('/seat-info', ctrl.getSeatInfo);
router.get('/:id', ctrl.getDetail);

router.post('/', authenticate, requirePermission('themlichchieu'), ctrl.create);
router.put('/:id', authenticate, requirePermission('sualichchieu'), ctrl.update);
router.delete('/:id', authenticate, requirePermission('sualichchieu'), ctrl.remove);

router.post('/khung-gio', authenticate, requirePermission('themlichchieu'), ctrl.createKhungGio);
router.delete('/khung-gio/:id', authenticate, requirePermission('sualichchieu'), ctrl.deleteKhungGio);
router.patch('/:id/status', authenticate, requirePermission('duyet_kehoach'), ctrl.updateStatus);

module.exports = router;
