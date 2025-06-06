// Flow Of Routing  (All Steps Necessary and link to each other)
// ==============================================================
// 1. routes / auth.js
// centralize all routes in one place OR add prefix
// 2. routes / index.js  -->  prefix + authRoutes --> which means bind them in one function    http://localhost:3000/api/user
// 3. now call it in app.js

const authRoutes = require('./auth.js');
const productRoutes = require('./product.js');
const orderRoutes = require('./order.js');
const basketRoutes = require('./basket.js');
const registerRoutes = (app)=>{
    const prefix = "/api"; // Define a prefix for all the routes
    app.use(prefix,authRoutes); // Register the auth routes with the prefix
    app.use(prefix,productRoutes);
    app.use(prefix,orderRoutes);
    app.use(prefix,basketRoutes);
}

module.exports={
    registerRoutes
}
