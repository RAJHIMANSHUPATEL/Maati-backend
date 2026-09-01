const mongoose = require("mongoose");
const Category = require("../../models/category.model");
const Product = require("../../models/product.model");
const BarcodeProduct = require("../../models/barcodeProduct.model");

const PRODUCT_FIELDS =
  "name cover posPrice quantityUnit stockStatus quantity category subCategory status";

const listCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      store: req.pos.storeId,
      status: "active",
    })
      .select("name cover")
      .sort({ name: 1 });
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const listProducts = async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter = { store: req.pos.storeId, status: "active" };
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid category" });
      }
      filter.category = category;
    }
    if (q && String(q).trim()) {
      filter.name = { $regex: String(q).trim(), $options: "i" };
    }
    const products = await Product.find(filter)
      .select(PRODUCT_FIELDS)
      .sort({ name: 1 })
      .limit(200);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const lookupBarcode = async (req, res) => {
  try {
    const barcode = String(req.body.barcode || "").trim();
    if (!barcode) {
      return res
        .status(400)
        .json({ success: false, message: "Barcode is required" });
    }

    const coded = await BarcodeProduct.findOne({
      barcode,
      store: req.pos.storeId,
      status: "active",
    });
    if (!coded) {
      return res
        .status(404)
        .json({ success: false, message: "No product for this barcode" });
    }

    const product = await Product.findOne({
      store: req.pos.storeId,
      status: "active",
      name: coded.name,
    }).select(PRODUCT_FIELDS);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Barcode is not linked to a catalog product",
      });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { listCategories, listProducts, lookupBarcode };
