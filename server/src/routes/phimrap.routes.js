const router = require('express').Router();
const ctrl = require('../controllers/phimrap.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole, ROLES } = require('../middleware/rbac');

// Chỉ Cluster Manager (4) + System Admin (2) được truy cập
router.use(authenticate, requireRole(ROLES.CLUSTER_MANAGER, ROLES.SYSTEM_ADMIN));

router.get('/', ctrl.getDistribution);
router.get('/summary', ctrl.getRapSummary);
router.get('/available/:id_rap', ctrl.getAvailableMovies);
router.post('/', ctrl.distribute);
router.delete('/:id', ctrl.removeDistribution);

module.exports = router;
