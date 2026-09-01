const Category = require("../../models/category.model");
const Subcategory = require("../../models/subcategory.model");
const Product = require("../../models/product.model");
const mongoose = require('mongoose');
const { storeScope, assertStore, idOf } = require("../../utils/storeAccess");

/**
 * Controller to get categories.
 * If an ID is provided in the query, it fetches a single category.
 * Otherwise, it fetches all categories.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getCategory = async (req, res) => {
    try {
        const { _id } = req.query;
        if (!_id) {
            const fetchedCategory = await Category.find(storeScope(req, "store"), "_id name status store cover").sort({ _id: -1 }).populate([
                {
                    path: 'store',
                    select: '_id name',
                }
            ]);
            return res.status(200).json({ success: true, data: fetchedCategory });
        }

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ success: false, message: "Invalid category id format" });
        }

        const fetchedCategory = await Category.findOne({ _id }).populate([
            {
                path: 'store',
                select: '_id name',
            }
        ]);
        if (!fetchedCategory) {
            return res.status(400).json({ success: false, message: "Category not found" });
        }
        if (!assertStore(req, res, idOf(fetchedCategory.store))) return;

        return res.status(200).json({ success: true, data: fetchedCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Controller to add a new category.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const addCategory = async (req, res) => {
    const data = req.body;
    if (!assertStore(req, res, data.store)) return;
    try {
        // Check if the data already exists
        const existingRecord = await Category.findOne({ name: data.name, store: data.store });

        if (existingRecord) {
            return res.status(400).send({ success: false, message: "Category already exists with this name" });
        }

        const newCategory = await Category.create(data);
        res.status(201).send({ success: true, message: "Category created successfully", data: newCategory });
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error.message });
    }
};

/**
 * Controller to update a category.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateCategory = async (req, res) => {
    const { _id, ...data } = req.body;
    if (!assertStore(req, res, data.store)) return;

    const existingCategory = await Category.findOne({
        name: data.name,
        _id: { $ne: _id },
    });

    if (existingCategory) {
        return res.status(400).send({
            success: false,
            message: "A category is already exist with this name",
        });
    }

    try {
        // Find and update the category record
        const updatedConfig = await Category.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the category",
        });
    }
};

/**
 * Controller to update the status of a category.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateCategoryStatus = async (req, res) => {
    const { _id, status } = req.body;

    try {
        const existing = await Category.findById(_id);
        if (!existing) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        if (!assertStore(req, res, idOf(existing.store))) return;

        const updatedConfig = await Category.findOneAndUpdate(
            { _id },
            { $set: { status: status } },
            { new: true, runValidators: true }
        );

        if (status === "deactive") {
            await cascadeDeactivateCategory(_id);
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Category status updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the category status",
        });
    }
};

async function cascadeDeactivateCategory(categoryId) {
    // Find and deactivate subcategories
    const subCategories = await Subcategory.find({ category: categoryId });
    const subCategoryIds = subCategories.map(sc => sc._id);

    await Subcategory.updateMany({ category: categoryId }, { status: "deactive" });

    // Deactivate products linked to these subcategories
    await Product.updateMany({ subCategory: { $in: subCategoryIds }, status: "active" }, { status: "deactive" });
}

const getCategoryByStoreId = async (req, res) => {
    const { store_id } = req.query;

    if (!store_id) return res.status(400).json({ error: 'Missing store_id' });
    if (!assertStore(req, res, store_id)) return;

    try {
        const categories = await Category.find({ store: store_id }, '_id name status');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
}

module.exports = {
    getCategory,
    addCategory,
    updateCategory,
    updateCategoryStatus,
    getCategoryByStoreId,
};
