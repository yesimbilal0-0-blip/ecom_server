const express = require('express');
const router = express.Router();

const { getCart, addToCart, deleteFromCart } = require('../controllers/cartController');
const { validateToken} = require('../middleware/tokenHandler');

router.route('/').post(validateToken, addToCart).get(validateToken, getCart)
router.route('/:id').delete(validateToken, deleteFromCart);

module.exports = router;