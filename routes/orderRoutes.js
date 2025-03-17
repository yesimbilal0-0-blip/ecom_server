const express = require('express');
const router = express.Router();

const { generateOrder } = require('../controllers/orderController');
const { validateToken } = require('../middleware/tokenHandler');

router.route('/generateOrder').post(validateToken, generateOrder);
router.route('/makePayment');

module.exports = router;