const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    discountPrice: {
        type: Number,
        required: true,
    },
    quantity : {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Category
        ref: 'Categories', // Name of the Category model
        required: true
      }
});

const Product = mongoose.model('Products',productSchema)
module.exports={
    Product
}