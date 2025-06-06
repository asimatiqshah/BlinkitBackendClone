const mongoose = require("mongoose");
const branchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
        latitude: { type: Number },
        longitude: { type: Number },
    },
    address: { type: String },
    deliveryPartners: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPartners"
    }]
});
const Branch = mongoose.model('Branches', branchSchema);
module.exports = {
    Branch
}
