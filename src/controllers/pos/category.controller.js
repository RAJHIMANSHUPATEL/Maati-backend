const Category = require("../../models/category.model");

/**
 * Controller to get categories for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getCategory = async (req, res) => {
    try {
        const data = await Category.find().sort({ _id: -1 });
        return res.status(200).json({ success: true, message: "Category get successfully", data: data });

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


module.exports = { getCategory };