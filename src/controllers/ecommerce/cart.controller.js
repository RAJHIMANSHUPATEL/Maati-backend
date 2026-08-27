const Cart = require("../../models/cart.model");

/**
 * Controller to add or update items in the cart.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const addCart = async (req, res) => {
  try {
    const { store, user_id, product_details } = req.body;

    let cart = await Cart.findOne({ store, user_id });

    if (cart) {
      cart.product_details = product_details;
      await cart.save();
      return res
        .status(200)
        .json({
          success: true,
          message: "Product details added to existing cart.",
          data: cart,
        });
    } else {
      const newCart = new Cart({ store, user_id, product_details });
      await newCart.save();
      return res
        .status(201)
        .json({ success: true, message: "New cart created.", data: newCart });
    }
  } catch (error) {
    console.error("Error creating or updating cart:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred.",
        error: error.message,
      });
  }
};

/**
 * Controller to get cart details.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
// controllers/ecommerce/cart.controller.js
const getCart = async (req, res) => {
  try {
    const { store, user_id } = req.query;

    if (!store || !user_id) {
      return res.status(400).json({
        success: false,
        message: "store and user_id are required",
      });
    }

    const cart = await Cart.findOne({ store, user_id });

    if (cart) {
      return res.status(200).json({
        success: true,
        message: "Cart retrieved successfully.",
        data: cart,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found." });
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred.",
      error: error.message,
    });
  }
};


module.exports = { addCart, getCart };
