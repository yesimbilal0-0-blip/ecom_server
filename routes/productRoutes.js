const express = require('express');
const router = express.Router();
const multer = require('multer');

const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { validateToken } = require('../middleware/tokenHandler');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.route('/').get(getAllProducts).post(validateToken, upload.single('file'), addProduct);
router.route('/:id').get(getProductById).delete(validateToken, deleteProduct).put(validateToken, upload.single('file'), updateProduct);

module.exports = router;