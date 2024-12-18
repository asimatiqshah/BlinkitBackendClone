const mongoose = require("mongoose");
const { Counter } = require("./src/models/counter");
const { Order } = require("./src/models/order");
const { connectDB } = require("./src/config/connect");
require('dotenv').config();

const testOrderCreation = async () => {
    try {
        let newOrder = {
            "customer": "605c72ef1532071f0d6d1c64",
            "deliveryPartner": "605c72ef1532071f0d6d1c65",
            "branch": "605c72ef1532071f0d6d1c66",
            "item": [
                {
                    "id": "605c72ef1532071f0d6d1c67",
                    "item": "605c72ef1532071f0d6d1c68",
                    "count": 2
                }
            ],
            "totalPrice": 200
        };
        //mongoDB Connection
        await connectDB(process.env.MONGO_URI);
        // Create a new order using save() instead of create()
        const order = new Order(newOrder);

        // Save the order, which will trigger the pre-save hook to generate the orderId
        await order.save();
        // console.log("Order created sucessfully ", result);

    } catch (error) {
        console.log("Error in test file", error);
    }
    finally {
        await mongoose.connection.close();
    }
}
testOrderCreation();
