const Cart = require("../models/Cart");

const addToCart = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    let cart = await Cart.findOne({ user: req.user.id });
    let message = "Product added to cart successfully";

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        products: [{ product: productId, quantity: 1 }],
      });
    } else {
      const existingProduct = cart.products.find(
        (item) => item.product.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
        message = "Product already in cart, quantity updated";
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();
    }

    const populatedCart = await cart.populate("products.product");

    res.status(200).json({
      message,
      products: populatedCart.products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
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
    const cart = await Cart.findOne({ user: req.user.id });
    cart.products = cart.products.filter(
      (product) => product.product.toString() !== productId
    );
    await cart.save();
    const populatedCart = await cart.populate("products.product");
    res.status(200).json({
      message: "Product removed from cart successfully",
      products: populatedCart.products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    const productIndex = cart.products.findIndex(
      (product) => product.product.toString() === productId
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      const populatedCart = await cart.populate("products.product");
      res.status(200).json({
        message: "Quantity updated successfully",
        products: populatedCart.products,
      });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart, updateQuantity };
