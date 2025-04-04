const express = require('express');
const { loginCustomer, loginDeliveryPartner, refreshToken, fetchUser } = require('../controllers/auth');
const { verifyToken } = require('../middleware/auth');
const { updateUser } = require('../controllers/tracking/user');

const router = express.Router();

//Define Routes
router.post('/customer/login',loginCustomer);
router.post('/delivery/login',loginDeliveryPartner);
router.post('/refresh-token',refreshToken);
router.get('/user',verifyToken,fetchUser);
router.post('/user',verifyToken,updateUser);

module.exports = router;