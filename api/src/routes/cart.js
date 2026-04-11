const express = require('express');

const cartController = require('../controllers/cartController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validateCartItemCreate, validateCartItemUpdate } = require('../validators/cartValidators');

const router = express.Router();

router.use(requireAuth, requireRole('buyer'));

router.get('/', cartController.getCart);
router.post('/items', validateCartItemCreate, cartController.addCartItem);
router.patch('/items/:cartItemId', validateCartItemUpdate, cartController.updateCartItem);
router.delete('/items/:cartItemId', cartController.removeCartItem);

module.exports = router;
