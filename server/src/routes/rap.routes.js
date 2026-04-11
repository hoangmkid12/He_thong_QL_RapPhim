const router = require('express').Router();
const ctrl = require('../controllers/rap.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/rbac');
const upload = require('../middleware/upload');

router.get('/', ctrl.getAll);
router.get('/active', ctrl.getActiveRaps);
router.get('/:id', ctrl.getOne);
router.get('/:id/phim', ctrl.getPhimDangChieuTheoRap);
router.get('/:id/phong', ctrl.getPhongByRap);

router.post('/', authenticate, requirePermission('themrp'), (req, res, next) => { req.uploadSubDir = 'rap'; next(); }, upload.single('img'), ctrl.create);
router.put('/:id', authenticate, requirePermission('suarp'), (req, res, next) => { req.uploadSubDir = 'rap'; next(); }, upload.single('img'), ctrl.update);
router.delete('/:id', authenticate, requirePermission('xoarp'), ctrl.remove);

module.exports = router;
