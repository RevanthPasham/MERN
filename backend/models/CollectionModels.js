const mongoose=require("mongoose")

const Collections= new mongoose.Schema(
    {   
        imageUrl:{type:String,required:true},
        category:{type:[String],required:true},
        discription:{type:String,required:true},
        name:{type:String,required:true}
        
    }
)

const CollectionsModel= mongoose.model("Collections",Collections)

module.exports={CollectionsModel}