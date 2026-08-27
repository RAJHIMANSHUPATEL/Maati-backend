const { default: mongoose } = require("mongoose");
const Category = require("../../models/category.model");
const Subcategory = require("../../models/subcategory.model");

/**
 * Controller to get subcategories by store ID and category ID for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const subCategoryByStore = async (req, res) => {
  try {
    const { store } = req.query;

    if (!mongoose.Types.ObjectId.isValid(store)) {
      return res.status(400).json({
        success: false,
        message: "Invalid store ID format",
      });
    }

    const data = await Category.find({ store }, "-createdAt -updatedAt -__v");
    //getting isEcommerce category data..
    const filteredData = data.filter((cat) => cat.isEcommerce === true);

    const dataWithSubCat = await Promise.all(
      filteredData.map(async (category) => {
        const subcategories = await Subcategory.find({
          category: category._id,
          status: "active",
        }).select("-createdAt -updatedAt -__v");
        return {
          ...category.toObject(),
          subcategories,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Categories and Sub Categories fetched successfully",
      data: dataWithSubCat,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { subCategoryByStore };
