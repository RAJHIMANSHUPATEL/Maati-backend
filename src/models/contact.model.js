const mongoose = require("mongoose");

const ContactUsSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
        trim: true,
  maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Please fill a valid email address",
      ],
    },
    contact: {
      type: String,
      required: true,
      match: [
        /^\+?[1-9]\d{1,14}$/,
        "Please enter a valid contact number",
      ],
    },
    notes: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ContactUs", ContactUsSchema);
