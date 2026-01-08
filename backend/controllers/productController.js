const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const sellerExists = await SellerRequest.findById(req.body.seller);
    if (!sellerExists) {
      return res.status(400).json({ message: "Invalid seller ID" });
    }

    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const product = await Product.create(req.body);
    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in creating product", error: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      status: "APPROVED",
      isActive: true,
      stock: { $gt: 0 },
    });
    // .populate("category", "name")
    // .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: err.message,
    });
  }
};

const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    // .populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching product",
      error: err.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
};
