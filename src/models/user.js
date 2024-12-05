const mongoose = require("mongoose");

//General User Fields
const userSchema = new mongoose.Schema({
    name: { type: String },
    role: {
        type: String,
        enum: ["Customer", "Admin", "DeliveryPartner"],
        required: true
    },
    isActivated: { type: Boolean, default: false }
});


const customerSchema = new mongoose.Schema({
    ...userSchema.obj,
    phone:{type:Number,required:true,unique:true},
    role:{
        type: String,
        enum: ["Customer"],
        default: "Customer"
    },
    liveLocation:{
        latitude:{type:Number},
        longitude:{type:Number}
    },
    address:{type:String}
});


const deliveryPartnerSchema = new mongoose.Schema({
    ...userSchema.obj,
    email: { type: String,required:true,unique:true },
    password: { type: String,required:true },
    phone:{type:Number,required:true,unique:true},
    role:{
        type: String,
        enum: ["DeliveryPartner"],
        default: "DeliveryPartner"
    },
    liveLocation:{
        latitude:{type:Number},
        longitude:{type:Number}
    },
    address:{type:String},
    branch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Branch'
    }
});

// Referencing Branch Schema ID
// In a straight forword to assign an specific branch to a delivery partner

const adminSchema = new mongoose.Schema({
    ...userSchema.obj,
    email: { type: String,required:true,unique:true },
    password: { type: String,required:true },
    phone: { type: Number,required:true },
    role: {
        type: String,
        enum: ["Admin"],
        default:"Admin"
    }
});

const Customer =  mongoose.model("Customers",customerSchema);
const DeliveryPartner =  mongoose.model("DeliveryPartners",deliveryPartnerSchema);
const Admin = mongoose.model("Admins",adminSchema);

module.exports={
    Customer,
    DeliveryPartner,
    Admin
}