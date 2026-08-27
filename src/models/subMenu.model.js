const mongoose = require("mongoose");

const subMenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    "subMenu": {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        }],
        required: true
    },
    status: {
        type: String,
        enum: ["active", "deactive"],
        default: "active"
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model("SubMenu", subMenuSchema);
