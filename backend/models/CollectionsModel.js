const mongoose = require("mongoose")


const Collection = new mongoose.Schema(
    {
        name:{type:String,required:true},
        price:{type:[Number],required:true},
        url:{type:[String],required:true},
        weight:{type:[String],required:true},
        discount:{type:[String],required:true},
        ctagory:{type:[String],required:true}
    }
)

const Collectionsmodel=mongoose.model("Collection",Collection)

module.exports={Collectionsmodel};