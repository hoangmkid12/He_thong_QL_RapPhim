const router = require('express').Router();
const ctrl = require('../controllers/phim.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/rbac');
const upload = require('../middleware/upload');

// Public
router.get('/', ctrl.getAllPhim);
router.get('/loai', ctrl.getAllLoaiPhim);
router.get('/:id', ctrl.getOnePhim);
router.get('/:id/raps', ctrl.getRapsShowingPhim);
router.get('/:id/raps/:id_rap/dates', ctrl.getDatesForPhimAtRap);
router.get('/:id/raps/:id_rap/showtimes', ctrl.getShowtimesForDate);

// Admin only
router.post('/', authenticate, requirePermission('themphim'), (req, res, next) => { req.uploadSubDir = 'phim'; next(); }, upload.single('img'), ctrl.createPhim);
router.put('/:id', authenticate, requirePermission('suaphim'), (req, res, next) => { req.uploadSubDir = 'phim'; next(); }, upload.single('img'), ctrl.updatePhim);
router.patch('/:id/status', authenticate, ctrl.updateStatus);
router.delete('/:id', authenticate, requirePermission('xoaphim'), ctrl.deletePhim);

// Loai phim
router.post('/loai', authenticate, requirePermission('themloai'), ctrl.createLoaiPhim);
router.put('/loai/:id', authenticate, requirePermission('sualoai'), ctrl.updateLoaiPhim);
router.delete('/loai/:id', authenticate, requirePermission('xoaloai'), ctrl.deleteLoaiPhim);

module.exports = router;
