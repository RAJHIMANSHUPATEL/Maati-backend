const Banner = require("../../models/banner.model");
const mongoose = require('mongoose');

/**
 * Controller to get banners.
 * If an ID is provided in the query, it fetches a single banner.
 * Otherwise, it fetches all banners.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getBanner = async (req, res) => {
    try {
        const { _id } = req.query;
        if (!_id) {
            const fetchedBanner = await Banner.find({}, "_id name status store page")
                .sort({ _id: -1 })
                .populate([
                    {
                        path: 'store',
                        select: '_id name',
                    }
                ]);
            return res.status(200).json({ success: true, data: fetchedBanner });
        }

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ success: false, message: "Invalid banner id format" });
        }

        const fetchedBanner = await Banner.findOne({ _id }).populate([
            {
                path: 'store',
                select: '_id name',
            }
        ]);
        if (!fetchedBanner) {
            return res.status(400).json({ success: false, message: "Banner not found" });
        }

        return res.status(200).json({ success: true, data: fetchedBanner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Controller to add a new banner.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const addBanner = async (req, res) => {
    const data = req.body;
    try {
        // Check if the data already exists
        const existingRecord = await Banner.findOne({
            store: data.store,
            name: data.name,
            page: data.page,
            position: data.position
        });

        if (existingRecord) {
            return res.status(400).send({ success: false, message: "Banner already exists with this data" });
        }

        const newBanner = await Banner.create(data);

        res.status(201).send({ success: true, message: "Banner created successfully", data: newBanner });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: error.message });
    }
};

/**
 * Controller to update a banner.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateBanner = async (req, res) => {
    const { _id, ...data } = req.body;

    const existingBanner = await Banner.findOne({
        store: data.store,
        name: data.name,
        page: data.page,
        position: data.position,
        _id: { $ne: _id },
    });

    if (existingBanner) {
        return res.status(400).send({
            success: false,
            message: "A banner already exist with this data",
        });
    }

    try {
        // Find and update the banner record
        const updatedConfig = await Banner.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Banner not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            data: updatedConfig,
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the banner",
        });
    }
};

/**
 * Controller to update the status of a banner.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateBannerStatus = async (req, res) => {
    const { _id, status } = req.body;

    try {
        // Find and update the category record
        const updatedConfig = await Banner.findOneAndUpdate(
            { _id },
            { $set: { status } },
            { new: true }
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Banner not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Banner status updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the banner status",
        });
    }
};

module.exports = {
    getBanner,
    addBanner,
    updateBanner,
    updateBannerStatus
};
