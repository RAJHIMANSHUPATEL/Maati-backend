const { default: mongoose } = require("mongoose");
const SubMenu = require("../../models/subMenu.model");
const Subcategory = require("../../models/subcategory.model");

/**
 * Controller to get menu for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getMenu = async (req, res) => {
  try {
    const { store } = req.query;

    if (!mongoose.Types.ObjectId.isValid(store)) {
      return res.status(400).json({
        success: false,
        message: "Invalid store ID format",
      });
    }

    const data = await SubMenu.findOne(
      { store },
      "-createdAt -updatedAt -__v"
    ).populate({ path: "subMenu", select: "-createdAt -updatedAt -__v" });

    if (!data) {
      return res
        .status(200)
        .json({ success: true, message: "Menu fetched successfully", data : [] });
    }

    //getting isEcommerce category data..
    const filteredData = data.subMenu.filter((sub) => sub.isEcommerce === true);

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
      message: "Menu fetched successfully",
      data: {
        _id: data._id,
        name: data.name,
        store: data.store,
        subMenu: dataWithSubCat,
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getMenu };
