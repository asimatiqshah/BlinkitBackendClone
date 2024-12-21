const express = require('express');
const { createOrder } = require('../controllers/order/order');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
//Routes
router.post('/order',verifyToken,createOrder);

//Export
module.exports = router;