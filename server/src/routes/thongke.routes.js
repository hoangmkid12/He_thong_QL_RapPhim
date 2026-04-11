const router = require('express').Router();
const ctrl = require('../controllers/thongke.controller');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');

router.use(authenticate, requireAdmin);

router.get('/summary', ctrl.getSummary);
router.get('/revenue-by-date', ctrl.getRevenueByDate);
router.get('/revenue-by-rap', ctrl.getRevenueByRap);
router.get('/top-movies', ctrl.getTopMovies);
router.get('/revenue-by-phim-rap', ctrl.getRevenueByPhimRap);

module.exports = router;
