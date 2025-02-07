const { Customer, DeliveryPartner } = require('../../models/user.js');
const { Branch } = require('../../models/branch.js');
const { Order } = require('../../models/order.js');

//CREATE ORDER
const createOrder = async (req, res) => {
    const { userId } = req.user;
    const { items, branch, totalPrice } = req.body;

    //AS WE UNDERSTOOD THIS FUNCTION WILL COMMUNICATE WITH CUSTOMER ONLY
    const customerData = await Customer.findById(userId);
    const branchData = await Branch.find({ _id: branch });
    console.log(branchData);

    if (!customerData) {
        return res.status(404).send({ message: "Customer not found" });
    }
    //CREATE NEW ORDER INSTANCE
    const newOrder = new Order({
        customer: userId,
        item: items.map((item) => ({
            id: item.id,
            item: item.item,
            count: item.count
        })),
        branch,
        totalPrice,
        deliveryLocation: {
            latitude: customerData.liveLocation.latitude,
            longitude: customerData.liveLocation.longitude,
            address: customerData.address || "No address available",
        },
        pickupLocation: {
            latitude: branchData[0].location.latitude,
            longitude: branchData[0].location.longitude,
            address: branchData[0].address || "No address available",
        },
    });
    //SAVING DATA IN DATABASE
    const saveOrder = await newOrder.save();
    return res.status(201).send(saveOrder);
}

//CONFIRM ORDER
const confirmOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { userId } = req.user; // For Develivery Partner
        const { deliveryPersonLocation } = req.body;

        const develiveryPerson = await DeliveryPartner.findById(userId);
        if (!develiveryPerson) {
            return res.status(404).send({ message: "Delivery person not found" });
        }

        //CHECK ORDER EXISTS IN ORDER COLLECTION
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        //CHECK ORDER STATUS
        if (order.status !== "available") {
            return res.status(404).send({ message: "Order is not available" });
        }
        order.status = "confirmed";

        order.deliveryPartner = userId;

        order.deliveryPersonLocation = {
            latitude: deliveryPersonLocation?.latitude,
            longitude: deliveryPersonLocation?.longitude,
            address: deliveryPersonLocation?.address || "",
        }

        await order.save();
        return res.send(order);
    } catch (error) {
        return res.status(500).send({ message: "Failed to confirm order" });
    }




}


module.exports = {
    createOrder
}