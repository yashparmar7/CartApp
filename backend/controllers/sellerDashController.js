const Product = require("../models/Product");

const getMyProducts = async (req, res) => {
  try {
    if (req.user.role !== "SELLER") {
      return res.status(403).json({ message: "Access denied" });
    }

    const products = await Product.find({
      seller: req.user._id,
      isDeleted: false,
    })
      .populate("category")
      .populate("seller")
      .sort({ createdAt: -1 });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in fetching seller products",
      error: err.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      title,
      brand,
      description,
      price,
      mrp,
      stock,
      category,
      offers,
      delivery,
    } = req.body;

    if (
      !title ||
      !brand ||
      !description ||
      price === "" ||
      isNaN(Number(price)) ||
      mrp === "" ||
      isNaN(Number(mrp)) ||
      !category
    ) {
      return res.status(400).json({
        message: "Please provide all required fields with valid values",
      });
    }

    // images
    let images = [];
    if (req.files?.length) {
      images = req.files.map((file) => file.path);
    }

    // normalize inputs
    const parsedOffers = Array.isArray(offers)
      ? offers
      : typeof offers === "string"
      ? offers.split(",").map((o) => o.trim())
      : [];

    const parsedDelivery =
      typeof delivery === "string" ? JSON.parse(delivery) : delivery;

    const productData = {
      title,
      brand,
      description,
      seller: req.user._id,
      pricing: {
        price: Number(price),
        mrp: Number(mrp),
      },
      stock: Number(stock) || 0,
      category,
      offers: parsedOffers,
      delivery: parsedDelivery || undefined,
      status: "PENDING",
      isActive: false,
    };

    if (images.length > 0) {
      productData.image = images;
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating product",
      error: err.message,
    });
  }
};

module.exports = { getMyProducts, createProduct };
