const Product = require("../models/Product");
const Category = require("../models/Category");

const createProduct = async (req, res) => {
  try {
    if (req.user.role !== "SELLER") {
      return res
        .status(403)
        .json({ message: "Only sellers can create products" });
    }

    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const productData = { ...req.body, seller: req.user._id };
    const product = await Product.create(productData);
    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in creating product", error: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in creating category", error: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      status: "APPROVED",
      isActive: true,
      stock: { $gt: 0 },
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

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
    const product = await Product.findById(id).populate("category", "name");

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

const searchProducts = async (req, res) => {
  const { query, category } = req.query;
  try {
    let filter = { isActive: true, stock: { $gt: 0 } };

    if (category && category !== "") {
      const categoryDoc = await Category.findOne({
        name: new RegExp(`^${category.trim()}$`, "i"),
      });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    let products = await Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .exec();

    if (query && query.trim() !== "") {
      products = products.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase().trim())
      );
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({
      message: "Error in fetching products",
      error: err.message,
    });
  }
};

module.exports = {
  createProduct,
  createCategory,
  getAllProducts,
  getSingleProduct,
  searchProducts,
};
