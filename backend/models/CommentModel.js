const mongoose= require("mongoose")

const CommentSchema= new mongoose.Schema(
    {
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Collection",
            required:true
        },
        comments:{type:[String]}
    }
)

module.exports= mongoose.model("Comment", CommentSchema)