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



exports.getCollectionProducts = async (req, res) => {
  try {
    const { name } = req.params;

    // Projection used correctly
    const collection = await CollectionsModel.findOne(
      { name },
      { category: 1 }
    );

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Extract array from projected doc
    const categories = collection.category;

    const products = await ProductsModel.find({
      category: { $in: categories }
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
