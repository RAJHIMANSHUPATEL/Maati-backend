const mongoose = require("mongoose");

const barcodeProductSchema = new mongoose.Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    cover: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        default: []
    },
    original_price: {
        type: Number,
        required: true,
    },
    sell_price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    descriptions: {
        type: String,
    },
    rating: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active',
    },
    size: {
        type: String,
        default: "novariations"
    },
    variations: {
        type: String,
        default: "[]"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    sub_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
    },
    in_offer: {
        type: Boolean,
        default: false,
    },
    in_stock: {
        type: Boolean,
        default: true,
    },
    unit: {
        type: String,
    },
    quantity: {
        type: Number,
        default: 0
    },
    stock_quantity: {
        type: Number,
        default: 0
    },
    barcode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('BarcodeProduct', barcodeProductSchema);
