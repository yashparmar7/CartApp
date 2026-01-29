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

    // Top Deal validation
    if (req.body.isTopDeal === true || req.body.isTopDeal === "true") {
      if (!req.body.topDealStart || !req.body.topDealEnd) {
        return res.status(400).json({
          message:
            "Top Deal start and end times are required when marking as Top Deal",
        });
      }
      const start = new Date(req.body.topDealStart);
      const end = new Date(req.body.topDealEnd);
      if (end <= start) {
        return res.status(400).json({
          message: "Top Deal end time must be greater than start time",
        });
      }
    } else {
      // Clear Top Deal dates if not a Top Deal
      req.body.topDealStart = null;
      req.body.topDealEnd = null;
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

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if ("isTopDeal" in req.body) {
      req.body.isTopDeal =
        req.body.isTopDeal === true || req.body.isTopDeal === "true";
    }

    if (req.user.role !== "SELLER") {
      return res
        .status(403)
        .json({ message: "Only sellers can update products" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own products" });
    }

    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
    }

    // Top Deal validation
    if (req.body.isTopDeal === true || req.body.isTopDeal === "true") {
      if (!req.body.topDealStart || !req.body.topDealEnd) {
        return res.status(400).json({
          message:
            "Top Deal start and end times are required when marking as Top Deal",
        });
      }
      const start = new Date(req.body.topDealStart);
      const end = new Date(req.body.topDealEnd);
      if (end <= start) {
        return res.status(400).json({
          message: "Top Deal end time must be greater than start time",
        });
      }
    } else if (req.body.isTopDeal === false || req.body.isTopDeal === "false") {
      // Clear Top Deal dates if not a Top Deal
      req.body.topDealStart = null;
      req.body.topDealEnd = null;
    }
    // If isTopDeal is not provided, preserve existing values

    const updateData = { ...req.body };
    // Reset status to PENDING if product was APPROVED and is being updated
    if (product.status === "APPROVED") {
      updateData.status = "PENDING";
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("category", "name");

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in updating product", error: err.message });
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
      isDeleted: false,
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
    let filter = {
      isActive: true,
      isDeleted: false,
      stock: { $gt: 0 },
    };

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
        product.title.toLowerCase().includes(query.toLowerCase().trim()),
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

const getTopDeals = async (req, res) => {
  try {
    const now = new Date();

    const query = {
      status: "APPROVED",
      isActive: true,
      isDeleted: false,
      stock: { $gt: 0 },
      $and: [
        {
          $or: [
            { isTopDeal: true },
            { "pricing.discountPercentage": { $gte: 30 } },
          ],
        },
        { "ratings.average": { $gte: 4 } },
        { stock: { $gt: 10 } },
        {
          $or: [
            { topDealStart: null },
            {
              topDealStart: { $lte: now },
              topDealEnd: { $gte: now },
            },
          ],
        },
      ],
    };

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ "pricing.discountPercentage": -1, soldCount: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching top deals",
      error: err.message,
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  createCategory,
  getAllProducts,
  getSingleProduct,
  searchProducts,
  getTopDeals,
};
