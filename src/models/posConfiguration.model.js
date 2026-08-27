const mongoose = require("mongoose");

const posConfigurationSchema = new mongoose.Schema({
  store_ip: {
    type: String,
    required: true,
    match:
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, // Regular expression for IPv4 address
    trim: true,
  },
  mac_address: {
    type: String,
    required: true,
    match: /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/,
    trim: true,
    lowercase: true,
  },
  weight_scale_port: {
    type: String,
    required: true,
    trim: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  baud_rate: {
    type: Number,
    required: true,
    min: 0,
  },
  data_bits: {
    type: Number,
    required: true,
  },
  parity: {
    type: String,
    required: true,
    enum: ["none", "even", "odd"],
    default: "none",
    trim: true,
  },
  stop_bits: {
    type: Number,
    required: true,
  },
  flow_type: {
    type: Boolean,
    required: true,
  },
  printer_ip: {
    type: String,
    required: true,
    match:
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, // IPv4 regex
    trim: true,
  },
  printer_port: {
    type: Number,
    required: true,
    min: 0,
    max: 65535,
  },
  surcharge: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "deactive"],
    default: "active",
  },
  pos_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  pos_pin: {
    type: String,
    required: [true, "Pin is required"],
    trim: true,
  },
});

module.exports = mongoose.model("POSConfiguration", posConfigurationSchema);
