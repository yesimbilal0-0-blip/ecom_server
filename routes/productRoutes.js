const express = require('express');
const  router = express.Router();
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { validateToken } = require('../middleware/tokenHandler');

router.route('/').get(getAllProducts).post(validateToken, addProduct);
router.route('/:id').get(getProductById).delete(validateToken, deleteProduct).put(validateToken, updateProduct);


module.exports = router;