const {collectionsmodel} = require("../models/CollectionsModel")



exports.getCollections= async(req,res)=>
{
    const collectionsData= await collectionsmodel.find()
    res.json(collectionsData)
}

exports.getCollectionsById= async(req,res)=>
{
    const getCollectionId= await collectionsmodel.findById(req.params.id)
    res.json(getCollectionId)
}