const express = require('express');
const router = express.Router();
const luongController = require('../controllers/luong.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/rbac');

router.use(authenticate);
router.use(requirePermission('bangluong'));

router.get('/', luongController.getAll);
router.post('/calculate', luongController.calculateSalary);
router.put('/:id', luongController.updateSalary);

module.exports = router;
