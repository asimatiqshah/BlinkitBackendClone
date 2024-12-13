const { default: mongoose } = require("mongoose");
const { Category, Product } = require("./src/models");
const { connectDB } = require("./src/config/connect");
const { categories, products } = require("./dummySeedData");
require('dotenv').config();

const seedDatabase= async ()=>{
    try {
        //connection
        await connectDB(process.env.MONGO_URI);
        // await Product.deleteMany({});
        // await Category.deleteMany({});
        // await Category.insertMany(categories);
        // let result = categories.reduce((current,category)=>{
        //     category[category.name] =  category.
        //     return category;
        // },[]);

        let categories = await Category.find({});
        let result = categories.reduce((total,category)=>{
            total[category.name] = category._id;
            return total;
        },{});
        const productWithCategoryID = products.map((item,index)=>(
            {
                ...item,
                category:result[item.category]
            }
        ));

        await Product.insertMany(productWithCategoryID);
        

    } catch (error) {
        console.log('Error in seeding data');
    }finally{
        mongoose.connection.close();
    }
}

seedDatabase();