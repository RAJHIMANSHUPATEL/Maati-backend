const Store = require("../../models/store.model");
const mongoose = require("mongoose");

/**
 * Controller to get all active stores or a single store by ID.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getStore = async (req, res) => {
  const { _id } = req.query;

  try {
    if (_id) {
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid store id format" });
      }

      const fetchedStore = await Store.findOne({
        _id,
        status: "active",
      }).select("-email -pin -commission -createdAt -updatedAt -__v");

      if (!fetchedStore) {
        return res
          .status(404)
          .json({ success: false, message: "Store not found" });
      }

      return res.status(200).json({ success: true, data: fetchedStore });
    }
    const stores = await Store.find({ status: "active" }).select(
      "-email -pin -commission -createdAt -updatedAt -__v"
    );

    return res.status(200).json({
      success: true,
      message: "Store fetched successfully",
      data: stores,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getStore };
