const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    cover: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
    },
    onlinePrice: {
        type: Number,
        required: true,
    },
    sellingPrice: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    discountGiven: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active',
    },
    variations: {
        type: [{
            name: {
                type: String,
                required: true,
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
                required: true,
            }
        }],
        default: []
    },
    size: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true,
    },
    in_offer: {
        type: Boolean,
        default: true,
    },
    stockStatus: {
        type: Boolean,
        default: true,
    },
    quantityUnit: {
        type: String,
    },
    quantity: {
        type: Number,
        required: true,
    },
    posPrice: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
