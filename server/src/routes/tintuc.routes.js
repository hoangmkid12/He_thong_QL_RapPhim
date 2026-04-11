const router = require('express').Router();
const ctrl = require('../controllers/tintuc.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/rbac');
const upload = require('../middleware/upload');

router.get('/', ctrl.getAll);
router.get('/admin/all', authenticate, requirePermission('quan_ly_tin_tuc'), ctrl.getAllAdmin);
router.get('/:id', ctrl.getOne);

router.post('/', authenticate, requirePermission('quan_ly_tin_tuc'), (req, res, next) => { req.uploadSubDir = 'tintuc'; next(); }, upload.single('img'), ctrl.create);
router.put('/:id', authenticate, requirePermission('quan_ly_tin_tuc'), (req, res, next) => { req.uploadSubDir = 'tintuc'; next(); }, upload.single('img'), ctrl.update);
router.delete('/:id', authenticate, requirePermission('quan_ly_tin_tuc'), ctrl.remove);

module.exports = router;
