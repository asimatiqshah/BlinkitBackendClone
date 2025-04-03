// Import the Express module
const express = require('express');
const morgan = require('morgan');
const http = require("http");
const { Server } = require('socket.io');
const cors = require('cors');
const { connectDB } = require('./src/config/connect');
const { Customer, Admin, DeliveryPartner, Branch } = require('./src/models/index.js');

const authRoutes = require('./src/routes/auth.js');
const { registerRoutes } = require('./src/routes/index.js');
const dotenv = require('dotenv').config();

// Initialize the Express app and socket.io
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ["websocket"],
});

// Define the port and hostname
const PORT = 3000;
const HOSTNAME = '0.0.0.0';

//database connection
const uri = process.env.MONGO_URI;
connectDB(uri);

//middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use((req,res,next)=>{
    req.io = io;
    next();
});

// app.use('/auth',authRoutes);

// Register  Routes
registerRoutes(app);

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send("Hello World");
})

//Testing Route
app.post('/customerAddCheck', async (req, res) => {

    //Customer
    // let result = await Customer.create({
    //     name: "Amit Sharma",
    //     phone: 9876543211,
    //     role: "Customer",
    //     isActivated: false,
    //     liveLocation: {
    //         latitude: 28.7041,
    //         longitude: 77.1025
    //     },
    //     address: "Flat No. 12B, Green Apartments, Delhi"
    // });


    //admin
    // let result = await Admin.create({
    //     name: "Ravi Kapoor",
    //         email: "ravi.kapoor@admin.com",
    //         password: "SecurePass@123", // Note: Hash this password in production
    //         phone: 9998877766,
    //         role: "Admin",
    //         isActivated: true
    // });


    //Delivery Partner
    // let result = await DeliveryPartner.create({
    //     name: "Rajesh Kumar",
    //     email: "rajesh.kumar@delivery.com",
    //     password: "DeliverSecure@456", // Hash this in production
    //     phone: 9988776655,
    //     role: "DeliveryPartner",
    //     isActivated: true,
    //     liveLocation: {
    //         latitude: 19.0760,
    //         longitude: 72.8777
    //     },
    //     address: "25, Seaside Lane, Mumbai",
    //     branch: "648e7a1234f0d2b6a3d7c9f1"
    // });


    //Branches
    // let result = await Branch.create({

    //         name: "Mumbai Central Hub",
    //         location: {
    //             latitude: 19.0760,
    //             longitude: 72.8777
    //         },
    //         address: "Central Business District, Mumbai",
    //         deliveryPartners: [
    //             "6747273c36267f27714061f7", // Delivery partner ObjectId as string
    //         ]
    // });

});



// Start the server
app.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})