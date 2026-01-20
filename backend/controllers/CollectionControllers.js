const {CollectionsModel}= require("../models/CollectionModels")

exports.getCollections= async(req,res)=>
{
    try
    {
        const CollectionsData= await CollectionsModel.find()
        res.json(CollectionsData)
    }
    catch(err)
    {
        res.status(500).json({message:err.message})
    }
}