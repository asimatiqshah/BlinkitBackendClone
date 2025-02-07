const { Customer, DeliveryPartner } = require("../../models/user");

const updateUser = async (req, res) => {
    //1. GET USER ID FROM HEADER
    //2. GET USER UPDATED/CHANGED DATA OBJECT
    //3. FIND USER EITHER DELIVERY PARTNER/CUSTOMER
    try {
        const { userId } = req.user;  //it consist databse id
        const updatedData = req.body;

        //HERE WE DON'T KNOW ABOUT USER? SO WHICH MODEL WE USE?
        let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId);

        if (!user) {
            return res.status(404).send({ message: "user not found" })
        }

        //WE GOT USER DETAILS FROM USERID BUT WE STILL DON'T KNOW ABUT USER MODAL?
        let userModal;
        if (user.role == "DeliveryPartner") {
            userModal = DeliveryPartner;
        } else if (user.role == "Customer") {
            userModal = Customer;
        } else {
            return res.status(404).send({ message: "Invalid user role" })
        }

        //NOW WE GO FOR UPDATE DETAILS
        const userUpdatedInfo = await userModal.findByIdAndUpdate(
            userId,
            updatedData,
            { runValidators: true, new: true },
        );

        if (!userUpdatedInfo) {
            return res.status(404).send({ message: "user not found" })
        }

        //SUCESS MESSAGE
        return res.status(200).send({
            status: true,
            message: "user updated sucessfully",
            user: userUpdatedInfo
        })

    } catch (error) {
        return res.status(500).send({ message: "failled to update user",error })
    }
}

module.exports = {
    updateUser
}