const express = require('express');
const router = express.Router();

const { generateOrder, updateStatus } = require('../controllers/orderController');
const { validateToken } = require('../middleware/tokenHandler');

router.route('/generateOrder').post(validateToken, generateOrder);
router.route('/updateStatus').put(updateStatus);

module.exports = router;