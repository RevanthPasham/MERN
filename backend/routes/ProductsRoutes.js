const express= require("express")



const router = express.Router();

const {getProducts,getProductsById}= require("../controllers/ProductsControllers")

router.get("/Products",getProducts)
router.get("/Products/:id",getProductsById)

module.exports= router