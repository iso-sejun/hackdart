const express = require('express');

const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const {
  validateBuyerRegistration,
  validateSellerRegistration,
  validateLogin,
} = require('../validators/authValidators');

const router = express.Router();

router.post('/register/buyer', validateBuyerRegistration, authController.registerBuyer);
router.post('/register/seller', validateSellerRegistration, authController.registerSeller);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

module.exports = router;
