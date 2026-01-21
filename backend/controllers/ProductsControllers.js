const {ProductsModel} = require("../models/ProductsModel")

const {CollectionsModel}= require("../models/CollectionModels")

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


exports.getCollectionProducts= async(req,res)=>
{
   try
   {
     const {name}= req.params

     
    const collections= await CollectionsModel.find({name})
    if(!collections)
    {
        return res.status(404).json({message:"Collction not found"})
    }

    const categories= collections.category
    const produxts= await ProductsModel.find({category:{$in:categories}})
   }
   catch(error)
   {
    res.status(500).json({eroor:error.message})
   }

}   