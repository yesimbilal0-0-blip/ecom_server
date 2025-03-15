const express = require('express');
const router = express.Router();

const { validateToken } = require('../middleware/tokenHandler');
const { register, login, updateDetails, resetPassword, addAddress, getAddress, updateAddress } = require('../controllers/userController');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/updateDetails').put(validateToken, updateDetails);
router.route('/resetPassword').put(resetPassword);
router.route('/address').get(validateToken, getAddress).post(validateToken, addAddress).put(validateToken, updateAddress);

module.exports = router;