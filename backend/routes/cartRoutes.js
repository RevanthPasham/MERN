const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCartByUser,removeFromCart
} = require("../controllers/cartController"); // 👈 CHECK THIS PATH

router.post("/add", addToCart);
router.get("/:userId", getCartByUser);
router.delete("/:userId/:productId",removeFromCart);

module.exports = router;
