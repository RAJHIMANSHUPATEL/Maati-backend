const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "mobile": {
        type: String,
        required: true,
    },
    "abn": {
        type: String,
        required: true
    },
    "address": {
        type: String,
        required: true
    },
    "notes": {
        type: String
    },
    "cover": {
        type: String,
        required: true,
        trim: true,
    },
    "status": {
        type: String,
        required: true,
        enum: ["active", "deactive"],
        default: "active"
    },
    "commission": {
        type: Number,
        required: true
    },
    "open_time": {
        type: String,
        required: true
    },
    "close_time": {
        type: String,
        required: true
    },
    "isClosed": {
        type: Boolean,
    },
    "certificate_url": {
        type: String,
    },
    "certificate_type": {
        type: String,
    },
    "city": {
        type: String,
        required: true
    },
    "email": {
        type: String,
        required: true
    },
    "pin": {
        type: String,
        required: true
    },
    "deliveryCharges": {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Store", storeSchema);
