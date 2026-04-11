const router = require('express').Router();
const ctrl = require('../controllers/lichlamviec.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/rbac');

// Staff: View my schedule
router.get('/my', authenticate, requirePermission('nv_lichlamviec'), ctrl.getMy);

// Manager: Manage all schedules
router.get('/', authenticate, requirePermission('ql_lichlamviec'), ctrl.getAll);
router.post('/', authenticate, requirePermission('ql_lichlamviec'), ctrl.create);
router.put('/:id', authenticate, requirePermission('ql_lichlamviec'), ctrl.update);
router.delete('/:id', authenticate, requirePermission('ql_lichlamviec'), ctrl.remove);

module.exports = router;
