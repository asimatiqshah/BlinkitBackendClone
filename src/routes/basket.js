const express = require('express');
const { fetchBasketItems, createBasketHandler } = require('../controllers/basket/basket');
const router = express.Router();

//Define Routes
router.post('/customer/basket',fetchBasketItems);
router.post('/customer/basket/create', createBasketHandler);

//Export
module.exports = router;