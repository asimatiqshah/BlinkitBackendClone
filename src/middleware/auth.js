
require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyToken = async (req, res,next) => {
    try {
        const authHeader = req.headers['authorization'];
        //startsWith javascript method for string
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send({ message: 'Access Token Required' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        console.log(decoded);
        next();
    } catch (error) {
        return res.status(403).send({
            message: "Invalid Token or Expired Token"
        })
    }
}
module.exports={
    verifyToken
}