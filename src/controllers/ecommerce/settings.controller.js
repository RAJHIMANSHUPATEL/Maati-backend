const { getOrCreateSettings } = require("../admin/settings.controller");

const getPublicSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    return res.status(200).json({
      success: true,
      data: {
        supportEmail: settings.supportEmail,
        supportPhone: settings.supportPhone,
        currencySymbol: settings.currencySymbol || "₹",
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getPublicSettings };
