const Cart = require("../models/Cart");

const addToCart = async (req, res) => {
  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        products: [{ product: productId, quantity: 1 }],
      });
    } else {
      cart.products.push({ product: productId, quantity: 1 });
      await cart.save();
    }

    const populatedCart = await cart.populate("products.product");

    res.status(200).json({
      message: "Product added to cart successfully",
      products: populatedCart.products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate(
      "products.product"
    );
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.userId });
    cart.products = cart.products.filter(
      (product) => product.product.toString() !== productId
    );
    await cart.save();
    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart };
