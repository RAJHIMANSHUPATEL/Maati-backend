const Coupon = require("../../models/coupon.model");
const mongoose = require('mongoose');

/**
 * Controller to get coupons.
 * If an ID is provided in the query, it fetches a single coupon.
 * Otherwise, it fetches all coupons.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getCoupon = async (req, res) => {
    try {
        const { _id } = req.query;
        if (!_id) {
            const fetchedCoupon = await Coupon.find({}, "_id status store couponCode").sort({ _id: -1 }).populate('store', '_id name');
            return res.status(200).json({ success: true, data: fetchedCoupon });
        }

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ success: false, message: "Invalid coupon id format" });
        }

        const fetchedCoupon = await Coupon.findOne({ _id }).populate('store', '_id name');
        if (!fetchedCoupon) {
            return res.status(400).json({ success: false, message: "Coupon not found" });
        }

        return res.status(200).json({ success: true, data: fetchedCoupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Controller to add a new coupon.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const addCoupon = async (req, res) => {
    const data = req.body;
    try {
        // Check if the data already exists
        const existingCoupon = await Coupon.findOne({ couponCode: data.couponCode });

        if (existingCoupon) {
            return res.status(409).send({ success: false, message: "Coupon already exists with this code" });
        }

        const newCoupon = await Coupon.create(data);
        res.status(201).send({ success: true, message: "Coupon created successfully", data: newCoupon });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: error.message });
    }
};

/**
 * Controller to update a coupon.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateCoupon = async (req, res) => {
    const { _id, ...data } = req.body;

    const existingCoupon = await Coupon.findOne({
        couponCode: data.couponCode,
        _id: { $ne: _id },
    });

    if (existingCoupon) {
        return res.status(409).send({
            success: false,
            message: "A coupon is already exist with this code",
        });
    }

    try {
        // Find and update the coupon record
        const updatedConfig = await Coupon.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the coupon",
        });
    }
};

/**
 * Controller to update the status of a coupon.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateCouponStatus = async (req, res) => {
    const { _id, status } = req.body;

    try {
        // Find and update the coupon record
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            { _id },
            { $set: { status } },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedCoupon) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Coupon status updated successfully",
            data: updatedCoupon, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the coupon status",
        });
    }
};

module.exports = {
    getCoupon,
    addCoupon,
    updateCoupon,
    updateCouponStatus
};
