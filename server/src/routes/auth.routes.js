const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');

router.post('/login', ctrl.login);
router.post('/register', ctrl.register);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);
router.get('/me', authenticate, ctrl.me);
router.post('/forgot-password/send-otp', ctrl.sendOtp);
router.post('/forgot-password/verify-otp', ctrl.verifyOtp);
router.post('/forgot-password/reset', ctrl.resetPassword);
router.put('/change-password', authenticate, ctrl.changePassword);
router.post('/guest', ctrl.createGuest);

module.exports = router;
