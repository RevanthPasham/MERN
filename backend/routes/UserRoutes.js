const express = require('express');


const router =express.Router();
const {login,register ,createcatogory,googleLogin,getcattogory,createCollection,SearchProduct,getRelatedCollections,getCollections,getSingleCollection}= require("../controllers/UserControllers");



router.post("/register", register);
router.post("/category",createcatogory)
router.get("/category",getcattogory)
router.post("/login", login);
router.post("/collections",createCollection)
router.get("/collections/:id/related",getRelatedCollections)
router.get("/search",SearchProduct)
router.post("/auth/google-login", googleLogin);



module.exports=router;