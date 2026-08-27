const PosConfiguration = require("../../models/posConfiguration.model");

/**
 * Controller to get POS configuration by MAC address.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getPosConfigurationByMac = async (req, res) => {
    try {
        const { mac_address } = req.body;

        const fetchedPosConfiguration = await PosConfiguration.findOne({ mac_address: mac_address, status: "active" }).populate("store");

        if (!fetchedPosConfiguration) {
            return res.status(400).json({ success: false, message: "POS Configuration not found" });
        }
        if (fetchedPosConfiguration.store.status === "deactive") {
            return res.status(400).json({ success: false, message: "Store is deactivated" });
        }

        return res.status(200).json({ success: true, data: fetchedPosConfiguration });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    getPosConfigurationByMac
};