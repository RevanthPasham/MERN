const mongoose=require("mongoose")

const Collections= new mongoose.schema(
    {
        category:{type:[String],required:true}
    }
)

const CollectionsModel= mongoose.model("Collections",Collections)

module.exports={CollectionsModel}