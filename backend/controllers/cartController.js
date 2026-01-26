const Cart = require("../models/Cart");
const Collectionmodel = require("../models/User").Collectionmodel;


exports.addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // find cart of user
    let cart = await Cart.findOne({ userId });

    // if cart does not exist → create new
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1 }]
      });
    } else {
      // check if product already exists in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // product exists → increase quantity
        cart.items[itemIndex].quantity += 1;
      } else {
        // product not exists → add new
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

exports.getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Collection"
    });
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(cart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ items: [] });
    }
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );
    await cart.save();
    res.status(200).json({ items: cart.items });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to remove item" });
  }
};