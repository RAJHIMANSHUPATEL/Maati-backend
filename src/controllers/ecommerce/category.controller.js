const { default: mongoose } = require("mongoose");
const Category = require("../../models/category.model");

/**
 * Controller to get categories for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getCategory = async (req, res) => {
  const { store } = req.query;
  try {
    if (!mongoose.Types.ObjectId.isValid(store)) {
      return res.status(400).json({
        success: false,
        message: "Invalid store ID format",
      });
    }
    const categories = await Category.find({ store, status: "active", isEcommerce: true }).sort({
      _id: -1,
    }).select("-__v -createdAt -updatedAt -status -isEcommerce");
    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getCategory };
