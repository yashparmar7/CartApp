const Category = require("../models/Category");

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

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean().exec();
    res.status(200).json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in fetching categories", error: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(category);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in updating category", error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in deleting category", error: err.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
