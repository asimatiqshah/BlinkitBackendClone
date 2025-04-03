const express = require('express');
const { createOrder, getOrders, confirmOrder, getOrderById, updateOrderStatus } = require('../controllers/order/order');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
//Routes
router.post('/order', verifyToken, createOrder);
router.get('/order', verifyToken, getOrders);
router.patch('/order/:orderId/status', verifyToken, updateOrderStatus);
router.post('/order/:orderId/confirm', verifyToken, confirmOrder);
router.get('/order/:orderId', verifyToken, getOrderById);

//Export
module.exports = router;