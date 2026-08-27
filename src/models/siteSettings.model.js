const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    supportEmail: {
      type: String,
      default: "",
    },
    supportPhone: {
      type: String,
      default: "",
    },
    currencySymbol: {
      type: String,
      default: "₹",
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
