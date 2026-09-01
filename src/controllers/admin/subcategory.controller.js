const Subcategory = require("../../models/subcategory.model");
const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const mongoose = require('mongoose');
const { storeScope, assertStore, idOf } = require("../../utils/storeAccess");

const resolveStoreId = async (data) => {
    if (data.store) return data.store;
    if (!data.category) return null;
    const category = await Category.findById(data.category);
    return category?.store || null;
};

/**
 * Controller to get subcategories.
 * If an ID is provided in the query, it fetches a single subcategory.
 * Otherwise, it fetches all subcategories.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getSubcategory = async (req, res) => {
    try {
        const { _id } = req.query;
        if (!_id) {
            const fetchedSubcategory = await Subcategory.find(storeScope(req, "store"), "_id name category status cover").sort({ _id: -1 }).populate([
                {
                    path: 'category',        // Populate the category field of Subcategory
                    select: '_id name', // Optionally select fields from Category (e.g., 'name' and 'description')
                },
            ]);
            return res.status(200).json({ success: true, data: fetchedSubcategory });
        }

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ success: false, message: "Invalid subcategory id format" });
        }

        const fetchedSubcategory = await Subcategory.findOne({ _id }).populate([
            {
                path: 'category',        // Populate the category field of Subcategory
                select: '_id name', // Optionally select fields from Category (e.g., 'name' and 'description')
            },
        ]);;
        if (!fetchedSubcategory) {
            return res.status(400).json({ success: false, message: "Subcategory not found" });
        }
        if (!assertStore(req, res, idOf(fetchedSubcategory.store) || idOf(fetchedSubcategory.category?.store))) return;

        return res.status(200).json({ success: true, data: fetchedSubcategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Controller to add a new subcategory.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const addSubcategory = async (req, res) => {
    const data = req.body;
    data.store = await resolveStoreId(data);
    if (!assertStore(req, res, data.store)) return;
    try {
        // Check if the data already exists
        const existingRecord = await Subcategory.findOne({ name: data.name, category: data.category, store: data.store });

        if (existingRecord) {
            return res.status(400).send({ message: "Subcategory already exists with this name,category and store" });
        }

        const newSubcategory = await Subcategory.create(data);
        res.status(201).send({ success: true, message: "Subcategory created successfully", data: newSubcategory });
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error.message });
    }
};

/**
 * Controller to update a subcategory.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateSubcategory = async (req, res) => {
    const { _id, ...data } = req.body;
    data.store = await resolveStoreId(data);
    if (!assertStore(req, res, data.store)) return;

    const existingSubcategory = await Subcategory.findOne({
        name: data.name,
        category: data.category,
        store: data.store,
        _id: { $ne: _id },
    });

    if (existingSubcategory) {
        return res.status(400).send({
            success: false,
            message: "A subcategory is already exist with this name,category and store",
        });
    }

    try {
        // Find and update the subcategory record
        const updatedConfig = await Subcategory.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Subcategory not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Subcategory updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the subcategory",
        });
    }
};

/**
 * Controller to get subcategories by category ID.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
// const getSubcategoryByCatgeoryId = async (req, res) => {
//     try {
//         const { category, store } = req.body;

//         // Check if the provided ID is a valid ObjectId
//         if (!mongoose.Types.ObjectId.isValid(category) || !mongoose.Types.ObjectId.isValid(store)) {
//             return res.status(400).json({ success: false, message: "Invalid category and store id format" });
//         }

//         const fetchedSubcategory = await Subcategory.find({ category: category, store: store });
//         if (!fetchedSubcategory) {
//             return res.status(400).json({ success: false, message: "Subcategory not found" });
//         }

//         return res.status(200).json({ success: true, data: fetchedSubcategory });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

/**
 * Controller to update the status of a subcategory.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateSubcategoryStatus = async (req, res) => {
    const { _id, status } = req.body;

    try {
        const existing = await Subcategory.findById(_id);
        if (!existing) {
            return res.status(404).json({ success: false, message: "Subcategory not found" });
        }
        if (!assertStore(req, res, idOf(existing.store) || (await resolveStoreId(existing)))) return;

        const updatedConfig = await Subcategory.findOneAndUpdate(
            { _id },
            { $set: { status: status } },
            { new: true, runValidators: true }
        );

        if (status === "deactive") {
            await cascadeDeactivateSubcategory(_id);
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Subcategory status updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error);
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the subcategory status",
        });
    }
};

async function cascadeDeactivateSubcategory(subcategoryId) {
    // Deactivate products linked to this subcategory
    await Product.updateMany({ subCategory: subcategoryId, status: "active" }, { status: "deactive" });
}

const getSubCategoryByCategoryId = async (req, res) => {
    const { category_id } = req.query;

    if (!category_id) {
        return res.status(400).json({ error: 'Missing category_id' });
    }
    const category = await Category.findById(category_id);
    if (!category) {
        return res.status(400).json({ error: "Category not found" });
    }
    if (!assertStore(req, res, idOf(category.store))) return;

    try {
        const subcategories = await Subcategory.find({ category: category_id }, '_id name status');
        res.json(subcategories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};


module.exports = {
    getSubcategory,
    addSubcategory,
    updateSubcategory,
    updateSubcategoryStatus,
    getSubCategoryByCategoryId,
};
