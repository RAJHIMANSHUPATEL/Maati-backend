const { default: mongoose } = require("mongoose");
const PolicyPage = require("../../models/policyPage.model");

/**
 * Controller to get policy pages for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getPolicyPagesList = async (req, res) => {
  try {
    const data = await PolicyPage.find({ status: "active" }, "_id title");
    return res.status(200).json({
      success: true,
      message: "PolicyPages fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Controller to get a policy page by title for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getPolicyPageById = async (req, res) => {
  const { _id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  try {
    const data = await PolicyPage.findOne({ _id, status: "active" }).lean();
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "PolicyPage not found" });
    }
    return res.status(200).json({
      success: true,
      message: "PolicyPage fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getPolicyPagesList, getPolicyPageById };
