const {ProductsModel} = require("../models/ProductsModel")



exports.getProducts= async(req,res)=>
{
    const CollectionsData= await ProductsModel.find()
    res.json(CollectionsData)
}

exports.getProductsById= async(req,res)=>
{
    const getCollectionId= await ProductsModel.findById(req.params.id)
    res.json(getCollectionId)
}
