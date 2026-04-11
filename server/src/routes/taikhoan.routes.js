const router = require('express').Router();
const ctrl = require('../controllers/taikhoan.controller');
const { authenticate } = require('../middleware/auth');
const { requireAdmin, requirePermission } = require('../middleware/rbac');
const upload = require('../middleware/upload');

// Profile (bản thân)
router.get('/me', authenticate, (req, res) => ctrl.getOne({ ...req, params: { id: req.user.id } }, res));
router.put('/profile', authenticate, (req, res, next) => { req.uploadSubDir = 'avatars'; next(); }, upload.single('img'), ctrl.updateProfile);

// Admin management
router.get('/', authenticate, requireAdmin, ctrl.getAll);
router.get('/:id', authenticate, requireAdmin, ctrl.getOne);
router.post('/', authenticate, requirePermission('themuser'), (req, res, next) => { req.uploadSubDir = 'avatars'; next(); }, upload.single('img'), ctrl.create);
router.put('/:id', authenticate, requirePermission('suatk'), (req, res, next) => { req.uploadSubDir = 'avatars'; next(); }, upload.single('img'), ctrl.update);
router.delete('/:id', authenticate, requirePermission('xoatk'), ctrl.remove);

module.exports = router;
