const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    coupon_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discount_type: {
      type: String,
      enum: ["flat", "percent"],
      default: "percent",
      required: true,
    },
    discount_value: {
      type: Number,
      default: 0,
      min: 0,
      required: true,
      validate: {
        validator: function (value) {
          if (this.discount_type === "percent") return value <= 100;
        },
        message: "Percentage discount cannot exceed 100",
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "deactive"],
      default: "active",
    },
    exp_date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
