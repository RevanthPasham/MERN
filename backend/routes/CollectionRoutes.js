const express= require("express")



const router = express.Router();

const {getCollections,getCollectionsById}= require("../controllers/CollectionsControllers")

router.get("/Collections",getCollections)
router.get("/Collectios/:id",getCollectionsById)

module.exports= router