const express = require('express');
const router = express.Router();

const { generateOrder, updateStatus } = require('../controllers/orderController');
const { validateToken } = require('../middleware/tokenHandler');
// const { createPaymentIntent, handleWebhook } = require('../controllers/paymentController');

router.route('/generateOrder').post(validateToken, generateOrder);
router.route('/updateStatus').put(updateStatus);
// router.post('/create-payment-intent', validateToken, createPaymentIntent);
// router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;