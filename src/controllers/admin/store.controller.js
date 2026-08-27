const Category = require("../../models/category.model");
const Subcategory = require("../../models/subcategory.model");
const Product = require("../../models/product.model");
const Store = require("../../models/store.model");
const mongoose = require('mongoose');

/**
 * Controller to get stores.
 * If an ID is provided in the query, it fetches a single store.
 * Otherwise, it fetches all stores.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getStore = async (req, res) => {
    try {
        const { _id } = req.query;
        if (!_id) {
            const stores = await Store.find({}, '_id name status cover').sort({ _id: -1 });
            return res.status(200).json({ success: true, data: stores });
        }

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ success: false, message: "Invalid store id format" });
        }

        const store = await Store.findById(_id);
        if (!store) {
            return res.status(400).json({ success: false, message: "Store not found" });
        }
        return res.status(200).json({ success: true, data: store });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Controller to add a new store.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const addStore = async (req, res) => {
    const data = req.body;

    try {
        // Check if the data already exists
        const name = data.name.trim().toLowerCase();
        const address = data.address.trim().toLowerCase();
        const mobile = data.mobile.trim();

        const existingRecord = await Store.findOne({
            name,
            address,
            mobile
        });

        if (existingRecord) {
            return res.status(409).send({ message: "Store already exists with this name, mobile and address" });
        }

        const newStore = await Store.create(data);
        res.status(201).send({ success: true, message: "Store created successfully", data: newStore });
    } catch (error) {
        console.error("Error creating store:", error);
        res.status(400).send({ success: false, message: "Internal server error" });
    }
};

/**
 * Controller to update a store.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateStore = async (req, res) => {
    const { _id, ...data } = req.body;

    const existingStore = await Store.findOne({
        name: data.name,
        address: data.address,
        mobile: data.mobile,
        _id: { $ne: _id },
    });

    if (existingStore) {
        return res.status(400).send({
            success: false,
            message: "A store is already exist with this name and address",
        });
    }
    try {
        // Find and update the store record
        const updatedConfig = await Store.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Store updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the store",
        });
    }
};

/**
 * Controller to get the total store count.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getStoreCount = async (req, res) => {
    try {
        const totalStore = await Store.countDocuments();
        res.status(200).json({ success: true, total: totalStore });
    } catch (error) {
        console.error("Error fetching store count:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Controller to update the status of a store.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateStoreStatus = async (req, res) => {
    const { _id, status } = req.body;

    try {
        // Find and update the store record
        const updatedConfig = await Store.findOneAndUpdate(
            { _id },
            { $set: { status } },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }

        // Cascade deactivate if status is 'deactive'
        if (status === "deactive") {
            await cascadeDeactivateStore(_id);
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Store status updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the store status",
        });
    }
};

async function cascadeDeactivateStore(storeId) {
    // Update all categories of this store
    const categories = await Category.find({ store: storeId });
    const categoryIds = categories.map(c => c._id);

    await Category.updateMany({ store: storeId }, { status: "deactive" });

    // Update subcategories of these categories
    const subCategories = await Subcategory.find({ category: { $in: categoryIds } });
    const subCategoryIds = subCategories.map(sc => sc._id);

    await Subcategory.updateMany({ category: { $in: categoryIds } }, { status: "deactive" });

    // Update products of these subcategories
    await Product.updateMany({ subCategory: { $in: subCategoryIds }, status: "active" }, { status: "deactive" });
}


module.exports = {
    getStore,
    addStore,
    updateStore,
    getStoreCount,
    updateStoreStatus
};
