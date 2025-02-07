const mongoose = require("mongoose");

const basketSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    quantity:{
        type:Number,
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customers',
        required: true
    }
});

const Basket = mongoose.model('Baskets',basketSchema);
module.exports={
    Basket
}