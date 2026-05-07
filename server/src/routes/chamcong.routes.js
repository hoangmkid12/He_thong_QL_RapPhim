const router = require('express').Router();
const ctrl = require('../controllers/chamcong.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole, ROLES } = require('../middleware/rbac');

// Public for staff (Role 1)
router.post('/self', authenticate, ctrl.selfCheckIn);
router.get('/self', authenticate, ctrl.getSelfRecords);

// Restricted to managers
router.use(authenticate, requireRole(ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER));

router.get('/', ctrl.getAll);
router.get('/staff/:id_rap', ctrl.getStaffByRap);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
