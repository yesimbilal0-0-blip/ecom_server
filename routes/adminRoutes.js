const express = require('express');
const router = express.Router();

const { getAllProducts, getProductById, getProductsBySeller, deleteProduct } = require('../controllers/productController');
const { getAllCustomers, getAllSellers, deleteCustomer, deleteSeller, getCustomerById, getSellerById } = require('../controllers/userController');
const { getAllOrders, getOrdersByCustomer, getOrdersByProduct, getOrderById, updateOrder, deleteOrder } = require('../controllers/orderController');
const { getPaymentById, getAllPayments, deletePaymentById, updatePaymentById } = require('../controllers/paymentController');
const { validateToken } = require('../middleware/tokenHandler');

router.route('/customer/:id').get(validateToken, getCustomerById).delete(validateToken, deleteCustomer);
router.route('/seller/:id').get(validateToken, getSellerById).delete(validateToken, deleteSeller);
router.route('/customer/').get(validateToken, getAllCustomers);
router.route('/seller/').get(validateToken, getAllSellers);

router.route('/product/:id').get(validateToken, getProductById).delete(validateToken, deleteProduct);
router.route('/product/seller/:sellerId').get(validateToken, getProductsBySeller);
router.route('/product/').get(validateToken, getAllProducts);

router.route('/order/').get(validateToken, getAllOrders);
router.route('/order/:OrderId').get(validateToken, getOrderById).delete(validateToken, deleteOrder).put(validateToken, updateOrder);
router.route('/order/customer/:customerId').get(validateToken, getOrdersByCustomer);
router.route('/order/product/:productId').get(validateToken, getOrdersByProduct);

router.route('/payment/:id').get(validateToken, getPaymentById).delete(validateToken, deletePaymentById).put(validateToken, updatePaymentById);
router.route('/payment/').get(validateToken, getAllPayments);

module.exports = router;