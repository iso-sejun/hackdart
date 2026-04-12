const express = require('express');

const foodBankController = require('../controllers/foodBankController');

const router = express.Router();

router.get('/ready/:token', foodBankController.markReadyForPickup);

module.exports = router;
