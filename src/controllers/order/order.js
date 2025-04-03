const { Customer, DeliveryPartner } = require('../../models/user.js');
const { Branch } = require('../../models/branch.js');
const { Order } = require('../../models/order.js');

//CREATE ORDER
const createOrder = async (req, res) => {
    try {
        const { userId } = req.user;
        const { items, branch, totalPrice } = req.body;

        //AS WE UNDERSTOOD THIS FUNCTION WILL COMMUNICATE WITH CUSTOMER ONLY
        const customerData = await Customer.findById(userId);
        const branchData = await Branch.find({ _id: branch });

        if (!customerData) {
            return res.status(404).send({ message: "Customer not found" });
        }
        //CREATE NEW ORDER INSTANCE
        const newOrder = new Order({
            customer: userId,
            items: items.map((item) => ({
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
    } catch (error) {
        return res.status(500).send({ message: "Failed to create order" });
    }
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

        //emitting to socket to frontend
        req.io.to(orderId).emit('orderConfirmed', order);
        await order.save();
        return res.send(order);
    } catch (error) {
        return res.status(500).send({ message: "Failed to confirm order" });
    }
}

//UPDATE ORDER STATUS
const updateOrderStatus = async () => {
    try {
        const { orderId } = req.params;
        const { userId } = req.user;
        const { status, deliveryPersonLocation } = req.body;

        const develiveryPerson = await DeliveryPartner.findById(userId);
        if (!develiveryPerson) {
            return res.status(404).send({ message: "Delivery person not found" });
        }
        //CHECK ORDER EXISTS IN ORDER COLLECTION
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        if (["cancelled", "delivered"].includes(order.status)) {
            return res.status(400).send({ message: "Order cannot updated" });
        }

        if (order.deliveryPartner.toString !== userId) {
            return res.status(403).send({ message: "Unauthorized" });
        }

        order.status = status;
        order.deliveryPersonLocation = deliveryPersonLocation;
        await order.save();
        req.io.to(orderId).emit("liveTrackingUpdates", order);

        return res.send(order);

    } catch (error) {
        return res.status(500).send({ message: "Failed to retrieve orders", error });
    }
}

const getOrders = async (req, res) => {
    try {
        const { status, customerId, deliveryPartnerId, branchId } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }
        if (customerId) {
            query.customer = customerId;
        }
        if (deliveryPartnerId) {
            query.deliveryPartner = deliveryPartnerId;
            query.branch = branchId;
        }

        const orders = await Order.find(query).populate(
            "customer branch items.item deliveryPartner"
        )
        return res.send(orders);
    } catch (error) {
        return res.status(500).send({ message: "Failed to confirm order" });
    }

}


const getOrderById = async () => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate(
            "customer branch items.item deliveryPartner"
        );
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        return res.send(order);
    } catch (error) {
        return res.status(500).send({ message: "Failed to retrieve single order", error });
    }
}

module.exports = {
    createOrder,
    confirmOrder,
    updateOrderStatus,
    getOrders,
    getOrderById
}