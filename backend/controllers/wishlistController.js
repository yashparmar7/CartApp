const WishList = require("../models/WishList");

const getWishlist = async (req, res) => {
  try {
    const wishlist = await WishList.findOne({ user: req.user.id }).populate({
      path: "products.product",
      model: "Product",
    });
    if (!wishlist) {
      return res.status(200).json([]);
    }
    res.status(200).json(wishlist.products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    let wishlist = await WishList.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new WishList({ user: req.user.id, products: [] });
    }
    const productExists = wishlist.products.some(
      (item) => item.product.toString() === id,
    );
    if (productExists) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
    wishlist.products.push({ product: id });
    await wishlist.save();
    const populatedWishlist = await WishList.findById(wishlist._id).populate({
      path: "products.product",
      model: "Product",
    });
    res.status(200).json({
      message: "Product added to wishlist",
      product:
        populatedWishlist.products[populatedWishlist.products.length - 1],
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const wishlist = await WishList.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    wishlist.products = wishlist.products.filter(
      (item) => item.product.toString() !== id,
    );
    await wishlist.save();
    res.status(200).json({ message: "Product removed from wishlist", _id: id });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
