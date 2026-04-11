const router = require('express').Router();
const combo = require('../controllers/combo.controller');
const km = require('../controllers/khuyenmai.controller');
const { authenticate } = require('../middleware/auth');
const { requireAdmin, requirePermission } = require('../middleware/rbac');
const upload = require('../middleware/upload');

// ─── Combo ──────────────────────────────────────────────────────
router.get('/combo', combo.getAll);
router.get('/combo/:id', combo.getOne);
router.post('/combo', authenticate, requirePermission('QLcombo'), (req, res, next) => { req.uploadSubDir = 'combo'; next(); }, upload.single('img'), combo.create);
router.put('/combo/:id', authenticate, requirePermission('QLcombo'), (req, res, next) => { req.uploadSubDir = 'combo'; next(); }, upload.single('img'), combo.update);
router.delete('/combo/:id', authenticate, requirePermission('QLcombo'), combo.remove);
router.patch('/combo/:id/toggle', authenticate, requirePermission('QLcombo'), combo.toggle);

// ─── Khuyen mai ─────────────────────────────────────────────────
router.get('/khuyen-mai', km.getAll);
router.get('/khuyen-mai/active', km.getActive);
router.get('/khuyen-mai/:id', km.getOne);
router.post('/khuyen-mai', authenticate, requirePermission('QLkm'), (req, res, next) => { req.uploadSubDir = 'khuyenmai'; next(); }, upload.single('img'), km.create);
router.put('/khuyen-mai/:id', authenticate, requirePermission('QLkm'), (req, res, next) => { req.uploadSubDir = 'khuyenmai'; next(); }, upload.single('img'), km.update);
router.delete('/khuyen-mai/:id', authenticate, requirePermission('QLkm'), km.remove);
router.patch('/khuyen-mai/:id/toggle', authenticate, requirePermission('QLkm'), km.toggle);

module.exports = router;
