const express= require("express")



const router = express.Router();

const {getProducts,getProductsById,getCollectionProducts}= require("../controllers/ProductsControllers")

router.get("/Products",                  getProducts)
router.get("/Products/:id",              getProductsById)
router.get("/Products/Collections/:name",getCollectionProducts)

module.exports= router