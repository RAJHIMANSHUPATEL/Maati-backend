const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "cover": {
        type: String,
        required: true,
        trim: true,
    },
    "category": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    "status": {
        type: String,
        enum: ["active", "deactive"],
        default: "active"
    }
}, { timestamps: true });

module.exports = mongoose.model("Subcategory", subcategorySchema);
