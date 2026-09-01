const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cashier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cashier_name: {
      type: String,
    },
    order_number: {
      type: String,
      required: true,
    },
    product_details: {
      type: String,
      required: true,
    },
    sub_total: {
      type: Number,
      required: true,
    },
    surcharge: {
      type: Number,
    },
    coupon_code: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    discount: {
      type: Number,
    },
    tip_amount: {
      type: Number,
    },
    grand_total: {
      type: Number,
      required: true,
    },
    payment_mode: {
      // cash, split, online
      type: String,
      required: true,
    },
    payment_status: {
      // pending, completed
      type: String,
      required: true,
    },
    change_amount: {
      type: Number,
    },
    tender_amount: {
      type: Number,
    },
    split_cash_amount: {
      type: Number,
    },
    split_card_amount: {
      type: Number,
    },
    reference_id: {
      type: String,
    },
    delivery_type: {
      type: String,
    },
    address: {
      type: String,
    },
    delivery_charge: {
      type: Number,
    },
    delivery_date: {
      type: String,
    },
    order_platform: {
      type: String,
      required: true,
    },
    order_status: {
      // hold, completed
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },

    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    unique_id: {
      type: String,
      required: true,
    },
    store_name: {
      type: String,
    },
    isPrinted: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
