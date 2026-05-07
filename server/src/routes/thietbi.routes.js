const router = require('express').Router();
const ctrl = require('../controllers/thietbi.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole, ROLES } = require('../middleware/rbac');

router.use(authenticate, requireRole(ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER));

router.get('/', ctrl.getAll);
router.get('/phong/:id_rap', ctrl.getPhongByRap);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
