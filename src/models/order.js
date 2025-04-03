const mongoose = require("mongoose");
const { Counter } = require("./counter");

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
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branches',
        required: true
    },
    items: [
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
    deliveryLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
        address: { type: String },
    },
    pickupLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
        address: { type: String },
    },
    deliveryPersonLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
        address: { type: String },
    },
    status: {
        type: String,
        enum: ["available", "confirmed", "arriving", "delivered", "cancelled"],
        default: "available"
    },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

});

const getNextSequenceValue = async (sequenceName) => {
    let sequenceDocument = await Counter.findOneAndUpdate(
        { name: sequenceName },
        { $inc: { sequence_value: 1 } },
        { upsert: true, new: true }
    );
    return sequenceDocument.sequence_value;
}

orderSchema.pre('save',async function(next){
    if (this.isNew) {
        const sequence_value = await getNextSequenceValue("orderId");
            this.orderId = `ORDR${sequence_value.toString().padStart(5, "0")}`;
    }
    next(); // now
});

const Order = mongoose.model('Orders', orderSchema);
module.exports = {
    Order
}