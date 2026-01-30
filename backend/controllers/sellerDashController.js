const Product = require("../models/Product");
const Order = require("../models/Order");

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

    // Calculate dynamic order count for each product
    const productsWithOrderCount = await Promise.all(
      products.map(async (product) => {
        const orderCount = await Order.countDocuments({
          "items.product": product._id,
        });
        return {
          ...product.toObject(),
          dynamicOrderCount: orderCount,
        };
      }),
    );

    res.status(200).json({
      success: true,
      products: productsWithOrderCount,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in fetching seller products",
      error: err.message,
    });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    if (req.user.role !== "SELLER") {
      return res.status(403).json({ message: "Access denied" });
    }

    const sellerProducts = await Product.find({
      seller: req.user._id,
      isDeleted: false,
    }).select("_id");

    const productIds = sellerProducts.map((p) => p._id);

    const orders = await Order.find({
      "items.product": { $in: productIds },
    })
      .populate("user", "userName email")
      .populate("items.product", "title image pricing.price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      message: "Error in fetching seller orders",
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

const updateProduct = async (req, res) => {
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
      isTopDeal,
      topDealStart,
      topDealEnd,
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

    // Find existing product
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if seller owns the product
    if (existingProduct.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Top Deal validation
    if (isTopDeal === true || isTopDeal === "true") {
      if (!topDealStart || !topDealEnd) {
        return res.status(400).json({
          message:
            "Top Deal start and end times are required when marking as Top Deal",
        });
      }
      const start = new Date(topDealStart);
      const end = new Date(topDealEnd);
      if (end <= start) {
        return res.status(400).json({
          message: "Top Deal end time must be greater than start time",
        });
      }
    } else if (isTopDeal === false || isTopDeal === "false") {
      // Clear Top Deal dates if not a Top Deal
      req.body.topDealStart = null;
      req.body.topDealEnd = null;
    }

    // Handle images: remove specified images and append new ones
    let updatedImages = existingProduct.image || [];

    // Remove images that are in removedImages array
    if (req.body.removedImages) {
      const removedImages = Array.isArray(req.body.removedImages)
        ? req.body.removedImages
        : [req.body.removedImages];
      updatedImages = updatedImages.filter(
        (img) => !removedImages.includes(img),
      );
    }

    // Append new images
    if (req.files?.length) {
      const newImages = req.files.map((file) => file.path);
      updatedImages = [...updatedImages, ...newImages];
    }

    // Normalize inputs
    const parsedOffers = Array.isArray(offers)
      ? offers
      : typeof offers === "string"
        ? offers.split(",").map((o) => o.trim())
        : existingProduct.offers;

    const parsedDelivery =
      typeof delivery === "string"
        ? JSON.parse(delivery)
        : delivery || existingProduct.delivery;

    const discount = Math.round(
      ((Number(mrp) - Number(price)) / Number(mrp)) * 100,
    );

    const updateData = {
      title,
      brand,
      description,
      pricing: {
        price: Number(price),
        mrp: Number(mrp),
        discountPercentage: discount,
      },
      stock: Number(stock) || existingProduct.stock,
      category,
      offers: parsedOffers,
      delivery: parsedDelivery,
      image: updatedImages,
      status: "PENDING",
      isActive: false,
      // Top Deal fields
      isTopDeal: isTopDeal === true || isTopDeal === "true" ? true : false,
      topDealStart: isTopDeal ? topDealStart : null,
      topDealEnd: isTopDeal ? topDealEnd : null,
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    })
      .populate("category")
      .populate("seller");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in updating product",
      error: err.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error in deleting product",
      error: err.message,
    });
  }
};

module.exports = {
  getMyProducts,
  getSellerOrders,
  createProduct,
  updateProduct,
  deleteProduct,
};
