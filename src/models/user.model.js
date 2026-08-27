const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
    "first_name": {
        type: String,
        required: true,
        trim: true
    },
    "last_name": {
        type: String,
        trim: true
    },
    "email": {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, 'Please fill a valid email address'],
    },
    "password": {
        type: String,
        required: true,
    },
    "gender": {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    "type": {
        type: String,
        required: true,
    },
    "status": {
        type: String,
        required: true,
        enum: ['active', 'deactive'],
        default: "active"
    },
    "cover": {
        type: String,
        trim: true,
    },
    "mobile": {
        type: String,
        required: true,
        match: [/^\+?\d{10,15}$/, "Please enter a valid mobile number"],
    },
    "country_code": {
        type: String,
        required: true,
        trim: true,
    },
    "address": [addressSchema]
},
    {
        timestamps: true
    })


// 🔐 Automatically remove password when converting to JSON
userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    }
});

// Or if you also use toObject(), apply to both
userSchema.set("toObject", {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    }
});

module.exports = mongoose.model("User", userSchema);
