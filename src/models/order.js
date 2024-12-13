const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customers', 
        required: true
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'DeliveryPartners', 
        required: true
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Branches',
        required: true
    },
    item: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            count: {
                type: Number,
                required: true,
            },
        }
    ],

})