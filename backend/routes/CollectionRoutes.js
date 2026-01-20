const {getCollections}= require("../controllers//CollectionControllers")


const express= require("express");
const router=express.Router()

router.get("/Collections",getCollections)

module.exports=router