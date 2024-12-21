const { Category } = require("../../models");

const getAllcategories = async (req,res)=>{
    try {
        const categories = await Category.find();
        return res.status(200).send({
            status:true,
            categories
        });
    } catch (error) {
        return res.status(500).send({message:"An error occured",error})
    }
}

module.exports={
    getAllcategories
}