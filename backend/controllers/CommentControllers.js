const Comment= require("../models/CommentModel")
const {User} = require("../models/User")

exports.addComment= async(req,res)=>
{
    try
    {
        

      const { productId } = req.params;
      const userId = req.user.userId; // f
    const { comment ,star} = req.body; // ["nice"]

    const updated = await Comment.create({
      productId,
      userId,
      comment,
      star
    }
    );

    res.status(200).json({
      success: true,
      message: "Comment added",
      data: updated
    });
       
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
        const comment=await Comment.find({productId}).populate("userId", "name picture");

        res.status(200).json({success:true,message:"comments fetched",data:comment})
    }
    catch(err)
    {
        res.status(500).json({error :err.message})
    }
}