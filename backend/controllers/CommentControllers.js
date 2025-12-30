const Comment= require("../models/CommentModel")
const {User} = require("../models/User")
const mongoose = require("mongoose");


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

exports.getComments=async (req,res)=>
{
  try
  {
    const {productId} = req.params;

    const result= await Comment.find({productId}).populate("userId","name picture")
    res.status(200).json({data:result})

  }
  catch(error)
  {
    res.status(500).json({error:error.message
    })
  }
}
exports.getSummary= async(req,res)=>
{
    try
    {
        const {productId} = req.params;
        const comment=await Comment.aggregate([
          {$match:{productId: new mongoose.Types.ObjectId(productId)}},
          {$group:{
            _id:"$productId",
            avgRating:{$avg:"$star"},
            totalRating:{$sum:1}
          
        }}
        ])

        if(comment.length===0)
        {
           return res.status(200).json({
             avgRating: 0,
             totalRating: 0,
          })
        }

        res.json({
          avgRating:Number(comment[0].avgRating.toFixed(1)),
          totalRating:comment[0].totalRating

        })

    }
    catch(err)
    {
        res.status(500).json({error :err.message})
    }
}