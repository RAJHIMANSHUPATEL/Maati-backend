const Banner = require("../../models/banner.model");

/**
 * Controller to get banners for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getBanner = async (req, res) => {
  const { storeId, page } = req.body;

  try {
    const banners = await Banner.find({
      store: storeId,
      page,
      status: "active",
    });

    if (banners.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No banners for this store",
        data: [],
      });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Banner fetched successfully",
        data: banners,
      });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getBanner };
