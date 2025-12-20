const Comment= require("../models/CommentModel")

exports.addComment= async(req,res)=>
{
    try
    {
        const { productId } = req.params;   
        const{comments} = req.body

        const add=  await Comment.create(
            {
                productId,
                 comments: comments
            }
        )
        res.status(200).json({sucess:true,message:"comment added",data:add})
    }
    catch(err)
    {
        res.status(500).json({error :err.message})
       
    }

}
exports.getComments= async(req,res)=>
{
    try
    {
        const {productId} = req.params;
        const comment=await Comment.find({productId})
        res.status(200).json({success:true,message:"comments fetched",data:comment})
    }
    catch(err)
    {
        res.status(500).json({error :err.message})
    }
}