const {Branch} = require('../models/branch.js');
const { Category } = require('./category.js');
const { Product } = require('./product.js');
const { Customer,DeliveryPartner,Admin } = require('./user');

module.exports={
    Customer,
    DeliveryPartner,
    Admin,
    Branch,
    Category,
    Product
}
