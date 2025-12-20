const express= require("express");
const router= express.Router();

const {addAddress,getAdddress,updateAddress,deleteAddress}= require("../controllers/addressControllers")

router.post("/add",addAddress)
router.get("/add/:userId",getAdddress)
router.put("/add/:userId",updateAddress)
router.delete("/add/:userId",deleteAddress)

module.exports= router;