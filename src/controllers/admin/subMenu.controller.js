const SubMenu = require("../../models/subMenu.model");
const mongoose = require("mongoose");


// Get SubMenu(s)
const getSubMenu = async (req, res) => {
    try {
        const { _id } = req.query;

        if (_id) {
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return res.status(400).json({ success: false, message: "Invalid SubMenu ID" });
            }

            const submenu = await SubMenu.findById(_id)
                .populate("store", "_id name")  // Assuming store has a `name` field
                .populate("subMenu", "_id name"); // Populate categories

            if (!submenu) {
                return res.status(404).json({ success: false, message: "SubMenu not found" });
            }

            return res.status(200).json({ success: true, data: submenu });
        }

        const submenus = await SubMenu.find()
            .populate("store", "_id name")
            .populate("subMenu", "_id name")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: submenus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// 2. Add SubMenu
const addSubMenu = async (req, res) => {
    try {
        const { name, store, subMenu } = req.body;

        // Check if a SubMenu already exists for this store
        const existing = await SubMenu.findOne({ store });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "SubMenu already exists for this store",
            });
        }

        const newSubMenu = new SubMenu({ name, store, subMenu });

        await newSubMenu.save();

        return res.status(201).json({
            success: true,
            message: "SubMenu created successfully",
            data: newSubMenu
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || "Failed to add SubMenu" });
    }
};

/**
 * Controller to update a sub-menu.
 * If no matching record is found, it creates a new one.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateSubMenu = async (req, res) => {
    const { _id, name, store, subMenu } = req.body;

    try {
        // Validate SubMenu ID
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ success: false, message: "Invalid SubMenu ID" });
        }

        // Check if another SubMenu already uses the same store ID
        if (store) {
            const duplicate = await SubMenu.findOne({ store, _id: { $ne: _id } });

            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: "Another SubMenu already exists for this store",
                });
            }
        }

        // Proceed with update
        const updated = await SubMenu.findByIdAndUpdate(
            _id,
            { $set: { ...(name && { name }), ...(store && { store }), ...(subMenu && { subMenu }) } },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "SubMenu not found" });
        }

        res.status(200).json({
            success: true,
            message: "SubMenu updated successfully",
            data: updated,
        });
    } catch (error) {
        console.error("Update failed:", error);
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the subMenu",
        });
    }
};

// 4. Update SubMenu Status
const updateSubMenuStatus = async (req, res) => {
    try {
        const { _id, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ success: false, message: "Invalid SubMenu ID" });
        }

        const submenu = await SubMenu.findByIdAndUpdate(
            _id,
            { status },
            { new: true, runValidators: true }
        );

        if (!submenu) {
            return res.status(404).json({ success: false, message: "SubMenu not found" });
        }

        res.status(200).json({
            success: true,
            message: `SubMenu status updated to ${status}`,
            data: submenu,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
};

module.exports = {
    getSubMenu,
    addSubMenu,
    updateSubMenu,
    updateSubMenuStatus,
};
