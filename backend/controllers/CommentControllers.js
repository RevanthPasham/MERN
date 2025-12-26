const Comment= require("../models/CommentModel")

exports.addComment= async(req,res)=>
{
    try
    {
        

      const { productId } = req.params;
    const { comments } = req.body; // ["nice"]

    const updated = await Comment.findOneAndUpdate(
      { productId },
      { $push: { comments: { $each: comments } } }, // 🔥 APPEND
      { new: true, upsert: true } // 🔥 create if not exists
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
        const comment=await Comment.find({productId})
        res.status(200).json({success:true,message:"comments fetched",data:comment})
    }
    catch(err)
    {
        res.status(500).json({error :err.message})
    }
}