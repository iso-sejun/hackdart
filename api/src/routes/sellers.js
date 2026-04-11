const express = require('express');

const sellerController = require('../controllers/sellerController');
const productController = require('../controllers/productController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validateSellerProfileUpdate } = require('../validators/sellerValidators');
const { validateProductPayload } = require('../validators/productValidators');

const router = express.Router();

router.use(requireAuth, requireRole('seller'));

router.get('/me', sellerController.getMe);
router.patch('/me', validateSellerProfileUpdate, sellerController.updateMe);

router.get('/me/products', productController.listSellerProducts);
router.post('/me/products', validateProductPayload, productController.createProduct);
router.patch('/me/products/:productId', validateProductPayload, productController.updateProduct);
router.delete('/me/products/:productId', productController.deleteProduct);

module.exports = router;
