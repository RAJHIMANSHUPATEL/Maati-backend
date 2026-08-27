const Product = require("../../models/product.model");
const mongoose = require("mongoose");

/**
 * Controller to get products.
 * If an ID is provided in the query, it fetches a single product.
 * Otherwise, it fetches all products.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getProducts = async (req, res) => {
    try {
        const { _id } = req.query;
        if (!_id) {
            const fetchedProduct = await Product.find({}, "_id name category onlinePrice status cover quantity stockStatus store")
                .populate({
                    path: "store",
                    select: "_id name status"
                }).populate({
                    path: 'category',     // Populate the virtual field 'subcategories'
                    select: '_id name status',            // Select the fields you want from Subproduct (e.g., 'name')
                }).populate({
                    path: 'subCategory',     // Populate the virtual field 'subcategories'
                    select: '_id name status',            // Select the fields you want from Subproduct (e.g., 'name')
                }).sort({ _id: -1 });
            return res.status(200).json({ success: true, data: fetchedProduct });
        }

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ success: false, message: "Invalid product id format" });
        }

        const fetchedProduct = await Product.findOne({ _id }).populate({
            path: "store",
            select: "_id name status"
        }).populate({
            path: 'category',     // Populate the virtual field 'subcategories'
            select: '_id name status',            // Select the fields you want from Subproduct (e.g., 'name')
        }).populate({
            path: 'subCategory',     // Populate the virtual field 'subcategories'
            select: '_id name status',            // Select the fields you want from Subproduct (e.g., 'name')
        });
        if (!fetchedProduct) {
            return res.status(400).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({ success: true, data: fetchedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Controller to add a new product.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const addProduct = async (req, res) => {
    const data = req.body;
    try {
        // Check if the data already exists
        const existingRecord = await Product.findOne({ name: data.name, store: data.store, category: data.category });

        if (existingRecord) {
            return res.status(400).send({ success: false, message: "Product already exists with this name, store and category" });
        }

        const newProduct = await Product.create(data);
        res.status(201).send({ success: true, message: "Product created successfully", data: newProduct });
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error.message });
    }
};

/**
 * Controller to update a product.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateProduct = async (req, res) => {
    const { _id, ...data } = req.body;

    const existingProduct = await Product.findOne({
        name: data.name,
        store: data.store,
        category: data.category,
        _id: { $ne: _id },
    });

    if (existingProduct) {
        return res.status(400).send({
            success: false,
            message: "A product is already exist with this name,store and category",
        });
    }

    try {
        // Find and update the product record
        const updatedConfig = await Product.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the product",
        });
    }
};

/**
 * Controller to get the total product count.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getProductCount = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        res.status(200).json({ success: true, total: totalProducts });
    } catch (error) {
        console.error("Error fetching product count:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Controller to get products by category.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getProductsByCategory = async (req, res) => {
    try {
        const productCount = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    Product: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "categories",  // This is the name of the collection you're referencing
                    localField: "_id",    // The field in Product that matches the foreign key in Category
                    foreignField: "_id",  // The field to match in the Category collection
                    as: "categoryInfo"    // The name of the new array field to add in the output
                }
            },
            {
                $unwind: "$categoryInfo" // Flatten the categoryInfo array so we can access it easily
            },
            {
                $project: {  // Optionally format the output
                    _id: 1,
                    Product: 1,
                    name: "$categoryInfo.name"  // Assuming your category document has a 'name' field
                }
            }
        ]);
        res.status(200).json({
            success: true,
            productCount: productCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

/**
 * Controller to update the status of a product.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateProductStatus = async (req, res) => {
    const { _id, status } = req.body;

    try {
        // Find and update the product record
        const updatedConfig = await Product.findOneAndUpdate(
            { _id },
            { $set: { status: status } },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Product status updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the product status",
        });
    }
};

const adjustStock = async (req, res) => {
    const { _id, quantity, reason, note } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ success: false, message: "Invalid product id" });
        }
        const nextQty = Number(quantity);
        if (!Number.isFinite(nextQty) || nextQty < 0) {
            return res.status(400).json({ success: false, message: "Quantity must be a non-negative number" });
        }

        const product = await Product.findById(_id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const delta = nextQty - Number(product.quantity || 0);
        product.quantity = nextQty;
        product.stockStatus = nextQty > 0;
        await product.save();

        const StockMovement = require("../../models/stockMovement.model");
        await StockMovement.create({
            product: _id,
            delta,
            quantityAfter: nextQty,
            reason: reason || "manual_adjust",
            note: note || "",
            admin: req.admin?._id,
        });

        return res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            data: product,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message || "Failed to adjust stock" });
    }
};

const getLowStock = async (req, res) => {
    try {
        const SiteSettings = require("../../models/siteSettings.model");
        const settings = await SiteSettings.findOne();
        const threshold = Number(req.query.threshold ?? settings?.lowStockThreshold ?? 5);
        const products = await Product.find({ quantity: { $lte: threshold } })
            .populate("store", "_id name")
            .populate("category", "_id name")
            .sort({ quantity: 1 });
        return res.status(200).json({
            success: true,
            threshold,
            total: products.length,
            data: products,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    getProducts,
    addProduct,
    updateProduct,
    getProductCount,
    getProductsByCategory,
    updateProductStatus,
    adjustStock,
    getLowStock,
};
