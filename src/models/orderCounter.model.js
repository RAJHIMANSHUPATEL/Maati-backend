const mongoose = require("mongoose");

const orderCounterSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    dateKey: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

orderCounterSchema.index({ storeId: 1, dateKey: 1 }, { unique: true });

module.exports = mongoose.model("OrderCounter", orderCounterSchema);
