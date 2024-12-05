const express = require('express');
const { loginCustomer, loginDeliveryPartner, refreshToken, fetchUser } = require('../controllers/auth');

const router = express.Router();

//Define Routes
router.post('/customer/login',loginCustomer);
router.post('/delivery/login',loginDeliveryPartner);
router.post('/refresh-token',refreshToken);
router.post('/user',fetchUser);

module.exports = router;