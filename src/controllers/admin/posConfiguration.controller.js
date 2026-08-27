const PosConfiguration = require("../../models/posConfiguration.model");
const mongoose = require('mongoose');

/**
 * Controller to get POS configurations.
 * If an ID is provided in the query, it fetches a single POS configuration.
 * Otherwise, it fetches all POS configurations.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getPosConfiguration = async (req, res) => {
    try {
        const { _id } = req.query;
        if (!_id) {
            const fetchedPosConfiguration = await PosConfiguration.find({}, "_id pos_name status store").sort({ _id: -1 }).populate([
                {
                    path: 'store',
                    select: '_id name',
                }
            ]);
            return res.status(200).json({ success: true, data: fetchedPosConfiguration });
        }

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ success: false, message: "Invalid posConfiguration id format" });
        }

        const fetchedPosConfiguration = await PosConfiguration.findOne({ _id }).populate([
            {
                path: 'store',
                select: '_id name',
            }
        ]);
        if (!fetchedPosConfiguration) {
            return res.status(404).json({ success: false, message: "PosConfiguration not found" });
        }

        return res.status(200).json({ success: true, data: fetchedPosConfiguration });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Controller to add a new POS configuration.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const addPosConfiguration = async (req, res) => {
    const data = req.body;
    try {
        // Check if the data already exists
        const existingRecord = await PosConfiguration.findOne({ mac_address: data.mac_address });

        if (existingRecord) {
            return res.status(400).send({ success: false, message: "Pos Configuration already exists with this mac address" });
        }

        const newPosConfiguration = await PosConfiguration.create(data);
        return res.status(201).send({ success: true, message: "Pos Configuration created successfully", data: newPosConfiguration });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: error.message });
    }
};

/**
 * Controller to update a POS configuration.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updatePosConfiguration = async (req, res) => {
    const { _id, ...data } = req.body;

    if (!_id) {
        return res.status(400).json({ success: false, message: "_id is required for update" });
    }

    const existingPosConfiguration = await PosConfiguration.findOne({
        mac_address: data.mac_address,
        _id: { $ne: _id },
    });

    if (existingPosConfiguration) {
        return res.status(400).send({
            success: false,
            message: "A posConfiguration is already exist with this MAC address",
        });
    }

    try {
        // Find and update the posConfiguration record
        const updatedConfig = await PosConfiguration.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "PosConfiguration not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "PosConfiguration updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the posConfiguration",
        });
    }
};

/**
 * Controller to update the status of a POS configuration.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updatePosConfigurationStatus = async (req, res) => {
    const { _id, status } = req.body;

    try {
        // Find and update the posConfiguration record
        const updatedConfig = await PosConfiguration.findOneAndUpdate(
            { _id },
            { $set: { status: status } },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "PosConfiguration not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "PosConfiguration status updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the posConfiguration status",
        });
    }
};

module.exports = {
    getPosConfiguration,
    addPosConfiguration,
    updatePosConfiguration,
    updatePosConfigurationStatus,
};
