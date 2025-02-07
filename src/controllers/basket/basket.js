const { Customer, Product } = require("../../models");
const { Basket } = require("../../models/basket");

const fetchBasketItems = async (req, res) => {
    const { userId } = req.body;
    try {
        if (!userId) {
            return res.status(404).send({
                status: false,
                message: "userId is required"
            })
        }
        let result = await Basket.findOne({ userId })
            .populate("userId")
            .populate("productId");

        return res.status(200).send({
            status: true,
            message: "Fetching Basket Items",
            data: result
        })

    } catch (error) {
        console.log("Logging Error ", error);

        return res.status(404).send({
            status: false,
            message: "Error during fetching items from basket",
            error
        })
    }

}

const createBasketHandler = async (req, res) => {
    const { userId, quantity, productId } = req.body;
    try {

        if (!userId || !quantity || !productId) {
            return res.status(404).send({
                status: false,
                message: "All fields is required"
            })
        }

        let newBasketItem = {
            userId,
            quantity,
            productId
        }
        let result = await Basket.create(newBasketItem);
        return res.status(200).send({
            status: true,
            message: "Item send to basket successfully",
            data: result
        });

    } catch (error) {
        console.log("Logging Basket Error ", error);
        return res.status(404).send({
            status: false,
            message: "Error during creat new item from basket",
            error
        })
    }
}
module.exports = {
    fetchBasketItems,
    createBasketHandler
}