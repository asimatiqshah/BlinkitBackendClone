const {Branch} = require('../models/branch.js');
const { Customer,DeliveryPartner,Admin } = require('./user');

module.exports={
    Customer,
    DeliveryPartner,
    Admin,
    Branch
}
