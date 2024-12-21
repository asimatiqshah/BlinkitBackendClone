const {Customer} = require('../../models/user.js');
const {Branch} = require('../../models/branch.js');
const {Order} = require('../../models/order.js');
const createOrder= async(req,res)=>{
    const {userId} = req.user;
    const {items,branch,totalPrice} = req.body;

    //AS WE UNDERSTOOD THIS FUNCTION WILL COMMUNICATE WITH CUSTOMER ONLY
    const customerData= await Customer.findById(userId);
    const branchData = await Branch.find({_id:branch});
    console.log(branchData);
    
    if(!customerData){
        return res.status(404).send({message:"Customer not found"});
    }
    //CREATE NEW ORDER INSTANCE
    const newOrder = new Order({
        customer:userId,
        item:items.map((item)=>({
            id:item.id,
            item:item.item,
            count:item.count
        })),
        branch,
        totalPrice,
        deliveryLocation:{
            latitude: customerData.liveLocation.latitude,
            longitude: customerData.liveLocation.longitude,
            address: customerData.address || "No address available",
        },
        pickupLocation:{
            latitude: branchData[0].location.latitude,
            longitude: branchData[0].location.longitude,
            address: branchData[0].address || "No address available",
        },
    });
    //SAVING DATA IN DATABASE
    const saveOrder = await newOrder.save();
    return res.status(201).send(saveOrder);
}
module.exports={
    createOrder
}