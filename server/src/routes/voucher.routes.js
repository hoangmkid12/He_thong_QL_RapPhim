const router = require('express').Router();
const ctrl = require('../controllers/voucher.controller');
const { authenticate } = require('../middleware/auth');

router.get('/check/:code', authenticate, ctrl.checkVoucher);

module.exports = router;
