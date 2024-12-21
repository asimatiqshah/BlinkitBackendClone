const express = require('express');
const { getProductsByCategoryId } = require("../controllers/products/product");
const { getAllcategories } = require('../controllers/products/category');

const router = express.Router();

//Define Routes
router.get('/products/:categoryId',getProductsByCategoryId);
router.get('/categories',getAllcategories);

//Export
module.exports = router;