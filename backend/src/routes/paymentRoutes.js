const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/paymentControllers");

router.post("/create-order", createOrder);


module.exports = router;
