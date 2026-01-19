const {Collectionsmodel} = require("../models/CollectionsModel")



exports.getCollections= async(req,res)=>
{
    const CollectionsData= await Collectionsmodel.find()
    res.json(CollectionsData)
}

exports.getCollectionsById= async(req,res)=>
{
    const getCollectionId= await Collectionsmodel.findById(req.params.id)
    res.json(getCollectionId)
}