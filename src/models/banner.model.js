const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true
    },
    images: [
      {
        url: {
          type: String,  // URL for the image
          required: true
        },
        altText: {
          type: String,  // Optional text for alt tag
          required: true
        },
        link: {
          type: String,  // Optional URL to link the image to
          default: ''
        },
        text: {
          type: String,  // The text to show on the image if showText is true
          default: '',
          required: true
        }
      }
    ],
    status: {
      type: String,
      required: true,
      enum: ['active', 'deactive'],
      default: 'active',
    },
    position: {
      type: String,
      required: true,
      trim: true,
      enum: ['top', 'bottom', 'between'],
    },
    page: {
      type: String,
      required: true,
      trim: true,
      enum: ['home', 'catalogue'],
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Banner", bannerSchema);
