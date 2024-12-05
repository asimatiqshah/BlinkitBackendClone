const mongoose  = require("mongoose");

const connectDB = (url)=>{
    mongoose
    .connect(url,{dbName:'BlinkitCloneDatabase'})
    .then((response)=>{
        console.log("MongoDB Connected Successfully")
    })
    .catch((err)=>{
        console.log("Database Not Connected",err)
    })
}

module.exports={
    connectDB
}