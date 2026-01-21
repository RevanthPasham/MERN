const mongoose = require("mongoose")


const Products = new mongoose.Schema(
    {
        name:{type:String,required:true},
        price:{type:[Number],required:true},
        url:{type:[String],required:true},
        weight:{type:[String],required:true},
        discount:{type:[String],required:true},
        category:{type:[String],required:true}
    }
)

const ProductsModel=mongoose.model("Products",Products)

module.exports={ProductsModel};