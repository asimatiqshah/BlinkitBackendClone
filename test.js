const mongoose = require("mongoose");
const { Counter } = require("./src/models/counter");
const { Order } = require("./src/models/order");
const { connectDB } = require("./src/config/connect");
const { Basket } = require("./src/models/basket");
const { Customer } = require("./src/models/user");
require('dotenv').config();

// const testOrderCreation = async () => {
//     try {
//         let newOrder = {
//             "customer": "605c72ef1532071f0d6d1c64",
//             "deliveryPartner": "605c72ef1532071f0d6d1c65",
//             "branch": "605c72ef1532071f0d6d1c66",
//             "item": [
//                 {
//                     "id": "605c72ef1532071f0d6d1c67",
//                     "item": "605c72ef1532071f0d6d1c68",
//                     "count": 2
//                 }
//             ],
//             "totalPrice": 200
//         };
//         //mongoDB Connection
//         await connectDB(process.env.MONGO_URI);
//         // Create a new order using save() instead of create()
//         const order = new Order(newOrder);

//         // Save the order, which will trigger the pre-save hook to generate the orderId
//         await order.save();
//         // console.log("Order created sucessfully ", result);

//     } catch (error) {
//         console.log("Error in test file", error);
//     }
//     finally {
//         await mongoose.connection.close();
//     }
// }

// testOrderCreation();


// const testBasketCreation = async()=>{
//     try { 
//         let newBasketItem = {
//             "productId": "675c21bdef0fc061b53298c8",
//             "quantity": 2,
//             "userId": "6747233018711451a1ddfe58"
//         }
//         await connectDB(process.env.MONGO_URI);
//         let result = await Basket.create(newBasketItem);
//         console.log("sucessfully added ", result);

//     } catch (error) {
//         console.log("Error in basket creation",error);
//     }
// }
// testBasketCreation();

//cmd - > node test.js  


const fetchBasketItems = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        let result = await Basket.findOne({ userId: "6747233018711451a1ddfe58"}) // Replace with an actual ObjectId
        .populate("userId") // Populate customer details
        .populate("productId");
        console.log(result);
        
    } catch (error) {
        console.log("Error fetching basket details in test.js", error);
    }
    finally {
        await mongoose.connection.close();
    }
}
Customer
fetchBasketItems();