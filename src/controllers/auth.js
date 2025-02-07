require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Customer, DeliveryPartner } = require('../models/user.js');

//IT'S NOT ROUTE IT'S A FUNCTION
const generateTokens = (user) => {
    //access token    
    const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );
    //refresh token
    const refreshToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )
    return {
        accessToken,
        refreshToken
    }

}

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(404).send({
            status: false,
            message: "Refresh Token is required"
        })
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        //check in database
        let user;
        if (decoded.role == "Customer") {
            user = await Customer.findOne({ _id: decoded.userId });
        } else if (decoded.role == "DeliveryPartner") {
            user = await DeliveryPartner.findOne({ _id: decoded.userId });
        } else {
            return res.status(400).send({
                status: false,
                message: "Invalid Role"
            })
        }
        //If decoded get the data from but not present in database.
        //Now None of the condition true we through error
        if (!user) {
            return res.status(403).send({
                status: false,
                message: "Invalid Referesh Token"
            })
        }
        //Now generate tokens
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
        console.log("123");
        return res.status(200).send({
            status: true,
            message: "Token Refreshed Successfully",
            user,
            accessToken,
            refreshToken: newRefreshToken
        })
    } catch (error) {
        return res.status(403).send({
            status: false,
            message: "Authentication failed: Invalid refresh token"
        })
    }
}


const loginCustomer = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).send({
                status: false,
                message: "Phone number is required"
            })
        }
        let customer = await Customer.findOne({ phone });        
        if (!customer) {
            customer = await Customer.create({
                phone,
                role: "Customer",
                isActivated: true
            });
        }

        const { accessToken, refreshToken } = generateTokens(customer);
        console.log(customer);
        return res.status(200).send({
            status: true,
            message: "Customer Created and Login In",
            customer,
            accessToken,
            refreshToken
        })

    } catch (error) {

        return res.status(500).send({
            message: "An error occured",
            error
        })

    }

    // const {accessToken,refreshToken} = generateTokens(userlist);
    // console.log(`accessToken: ${accessToken}`);
    // console.log(`refreshToken: ${refreshToken}`);
}

const loginDeliveryPartner = async (req, res) => {
    try {
        const { email, password } = req.body;
        //Check Values Exists
        if (!email || !password) {
            return res.status(400).send({
                status: false,
                message: "Email and Password is required"
            })
        }
        let deliveryPartner = await DeliveryPartner.findOne({ email });
        //Check In Database
        if (!deliveryPartner) {
            return res.status(400).send({
                status: false,
                message: "Delivery Partner not exists"
            })
        }

        //Password
        const isMatch = deliveryPartner.password === password;
        if (!isMatch) {
            return res.status(400).send({
                status: false,
                message: "Invalid Credentials"
            })
        }

        const { accessToken, refreshToken } = generateTokens(deliveryPartner);
        return res.status(200).send({
            status: true,
            message: "Login Sucessfully",
            deliveryPartner,
            accessToken,
            refreshToken
        })

    } catch (error) {
        return res.status(500).send({
            message: "An error occured",
            error
        })
    }
}

//WE'R FETCHING DATA FROM TOKEN SO WE NEED jwt STORE DETAILS FROM USER
const fetchUser = async (req, res) => {
    try {
        console.log("Now in fetchUser");
        
        //it's not req.body here because we are setting req.user token decrypt valure from middlware
        const { userId, role } = req.user;
        if (!userId || !role) {
            return res.status(404).send({
                status: false,
                message: "userId and role fields required"
            })
        }
        let user;
        if (role === "Customer") {
            user = await Customer.findOne({ _id: userId });
        } else if (role === "DeliveryPartner") {
            user = await DeliveryPartner.findOne({ _id: userId });
        } else {
            return res.status(403).send({
                status: false,
                message: "Invalid Role"
            })
        }
        //Successfully
        return res.status(200).send({
            status: true,
            message: "Successfully fetched user details.",
            user
        })
    } catch (error) {
        return res.status(500).send({status:false,message:"An error occured while fetching user",error})
    }
}


module.exports = {
    loginCustomer,
    loginDeliveryPartner,
    refreshToken,
    fetchUser
}