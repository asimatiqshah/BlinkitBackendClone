const { Product } = require("../../models/product");

const getProductsByCategoryId = async (req,res)=>{
    const {categoryId} = req.params;
    console.log("This categoryId extract from prams",categoryId);

    try {
        const products =  await Product.find({category:categoryId})
        .select('-category')
        .exec();

        return res.status(200).send({
            status:true,
            products
        });
    } catch (error) {
        return res.status(500).send({message:"An error occured",error})
    }
}

module.exports = {
    getProductsByCategoryId
}
