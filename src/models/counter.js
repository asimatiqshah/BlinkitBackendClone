const mongoose = require("mongoose");
const counterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    sequence_value: {
        type: Number,
        default:0
    }
});
const Counter = mongoose.model('Counters',counterSchema);
module.exports={
    Counter
}
