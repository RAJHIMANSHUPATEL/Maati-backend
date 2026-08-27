const PolicyPage = require("../../models/policyPage.model");
const mongoose = require('mongoose');

/**
 * Controller to get policy pages.
 * If an ID is provided in the query, it fetches a single policy page.
 * Otherwise, it fetches all policy pages.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getPolicyPage = async (req, res) => {
    try {
        const { _id } = req.query;

        // If no ID is provided, return all policy pages (sorted by latest)
        if (!_id) {
            const fetchedPolicyPage = await PolicyPage.find({}, "_id title status").sort({ _id: -1 });
            return res.status(200).json({ success: true, data: fetchedPolicyPage });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ success: false, message: "Invalid policyPage id format" });
        }

        // Find single policy page by ID
        const fetchedPolicyPage = await PolicyPage.findOne({ _id });
        if (!fetchedPolicyPage) {
            return res.status(404).json({ success: false, message: "Policy Page not found" });
        }

        return res.status(200).json({ success: true, data: fetchedPolicyPage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Controller to add a new policy page.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const addPolicyPage = async (req, res) => {
    const data = req.body;
    try {
        // Check if the data already exists
        const existingRecord = await PolicyPage.findOne({ title: data.title });

        if (existingRecord) {
            return res.status(400).send({ success: false, message: "Policy Page already exists with this title" });
        }

        const newPolicyPage = await PolicyPage.create(data);
        res.status(201).send({ success: true, message: "Policy Page created successfully", data: newPolicyPage });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: error.message });
    }
};

/**
 * Controller to update a policy page.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updatePolicyPage = async (req, res) => {
    const { _id, ...data } = req.body;

    const existingPolicyPage = await PolicyPage.findOne({
        title: data.title,
        _id: { $ne: _id },
    });

    if (existingPolicyPage) {
        return res.status(400).send({
            success: false,
            message: "A policy page is already exist with this title",
        });
    }

    try {
        // Find and update the policyPage record
        const updatedConfig = await PolicyPage.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Policy Page not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Policy Page updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the policyPage",
        });
    }
};

/**
 * Controller to update the status of a policy page.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updatePolicyPageStatus = async (req, res) => {
    const { _id, status } = req.body;

    try {
        // Find and update the policyPage record
        const updatedPolicyPage = await PolicyPage.findOneAndUpdate(
            { _id },
            { $set: { status: status } },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedPolicyPage) {
            return res.status(404).json({ success: false, message: "Policy Page not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Policy Page status updated successfully",
            data: updatedPolicyPage, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the policyPage status",
        });
    }
};

module.exports = {
    getPolicyPage,
    addPolicyPage,
    updatePolicyPage,
    updatePolicyPageStatus
};
