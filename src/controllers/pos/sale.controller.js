const mongoose = require("mongoose");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const { nextOrderIdentifiers } = require("../../utils/orderNumber");
const {
  decrementStock,
  restoreStock,
  parseProductDetails,
} = require("../ecommerce/order.controller");
const { isOwner, storeIds } = require("../../middlewares/adminAuth.middleware");

const WEIGHTED = new Set(["kilogram", "gram", "liter", "millilitre"]);

const startOfTodayIst = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year").value;
  const m = parts.find((p) => p.type === "month").value;
  const d = parts.find((p) => p.type === "day").value;
  return new Date(`${y}-${m}-${d}T00:00:00+05:30`);
};

const isWeightedUnit = (unit) => WEIGHTED.has(String(unit || "").toLowerCase());

const roundMoney = (n) => Math.round(Number(n) * 100) / 100;

const buildSaleLines = async (rawItems, storeId) => {
  if (!Array.isArray(rawItems) || !rawItems.length) {
    throw new Error("Bag is empty");
  }

  const lines = [];
  for (const raw of rawItems) {
    const productId = raw.product;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product in bag");
    }
    const product = await Product.findById(productId);
    if (!product || product.status !== "active") {
      throw new Error("A product in the bag is no longer available");
    }
    if (String(product.store) !== String(storeId)) {
      throw new Error("Some items are from a different store");
    }
    if (!product.stockStatus) {
      throw new Error(`${product.name} is sold out`);
    }

    const weighted = isWeightedUnit(product.quantityUnit);
    const quantity = weighted ? 1 : Math.round(Number(raw.quantity || 0));
    const weight = weighted ? Number(raw.weight || 0) : undefined;

    if (!weighted && quantity < 1) {
      throw new Error(`Enter a quantity for ${product.name}`);
    }
    if (weighted && !(weight > 0)) {
      throw new Error(`Enter a weight for ${product.name}`);
    }
    if (Number(product.quantity) < quantity) {
      throw new Error(`${product.name} does not have enough stock`);
    }

    const unitPrice = Number(product.posPrice);
    const lineTotal = roundMoney(weighted ? unitPrice * weight : unitPrice * quantity);
    lines.push({
      product: product._id,
      name: product.name,
      price: unitPrice,
      quantity,
      weight: weighted ? weight : undefined,
      image: product.cover,
      unit: product.quantityUnit,
      line_total: lineTotal,
    });
  }
  return lines;
};

const createSale = async (req, res) => {
  try {
    const store = req.pos.store;
    const lines = await buildSaleLines(req.body.items, req.pos.storeId);
    const subTotal = roundMoney(lines.reduce((sum, line) => sum + line.line_total, 0));
    const surcharge = Number(req.pos.surcharge || 0);
    const grandTotal = roundMoney(subTotal + surcharge);
    const tender = Number(req.body.tender_amount);
    if (!(tender >= grandTotal)) {
      return res.status(400).json({
        success: false,
        message: "Tendered amount is less than the total",
      });
    }
    const changeAmount = roundMoney(tender - grandTotal);
    const { orderNumber, uniqueId } = await nextOrderIdentifiers(req.pos.storeId);
    const address = store.address || store.name || "Walk-in";

    const payload = {
      store_id: req.pos.storeId,
      order_number: orderNumber,
      unique_id: uniqueId,
      product_details: JSON.stringify(lines),
      sub_total: subTotal,
      surcharge,
      delivery_charge: 0,
      discount: 0,
      grand_total: grandTotal,
      payment_mode: "cash",
      payment_status: "completed",
      tender_amount: roundMoney(tender),
      change_amount: changeAmount,
      address,
      delivery_type: "walk_in",
      order_platform: "pos",
      order_status: "completed",
      notes: req.body.notes || "",
      store_name: store.name,
      isPrinted: false,
      cashier_id: req.pos.cashierId,
      cashier_name: req.pos.cashierName,
    };

    const order = await Order.create(payload);
    try {
      await decrementStock(lines, order._id);
    } catch (stockError) {
      await Order.findByIdAndDelete(order._id);
      return res
        .status(400)
        .json({ success: false, message: stockError.message });
    }

    return res.status(201).json({
      success: true,
      message: "Sale completed",
      data: order,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const listTodaySales = async (req, res) => {
  try {
    const start = startOfTodayIst();
    const orders = await Order.find({
      store_id: req.pos.storeId,
      order_platform: "pos",
      createdAt: { $gte: start },
    }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const voidSale = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid sale" });
    }
    const order = await Order.findById(id);
    if (!order || String(order.store_id) !== String(req.pos.storeId)) {
      return res.status(404).json({ success: false, message: "Sale not found" });
    }
    if (order.order_platform !== "pos") {
      return res.status(400).json({ success: false, message: "Not a POS sale" });
    }
    if (order.order_status === "cancelled") {
      return res.status(400).json({ success: false, message: "Already voided" });
    }
    const start = startOfTodayIst();
    if (new Date(order.createdAt) < start) {
      return res.status(400).json({
        success: false,
        message: "Only today's sales can be voided",
      });
    }

    const role = req.pos.staffRole;
    if (role === "cashier") {
      const pin = String(req.body?.pin || "");
      const managers = await User.find({
        status: "active",
        type: { $in: ["owner", "admin", "manager"] },
        staff_pin: pin,
      });
      const override = managers.find(
        (user) => isOwner(user) || storeIds(user).includes(String(req.pos.storeId))
      );
      if (!override) {
        return res.status(403).json({
          success: false,
          message: "Manager PIN required to void",
        });
      }
    }

    const items = parseProductDetails(order.product_details);
    await restoreStock(items, order._id);
    order.order_status = "cancelled";
    order.payment_status = "pending";
    await order.save();

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const markPrinted = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid sale" });
    }
    const order = await Order.findOneAndUpdate(
      {
        _id: id,
        store_id: req.pos.storeId,
        order_platform: "pos",
      },
      { $set: { isPrinted: true } },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: "Sale not found" });
    }
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createSale, listTodaySales, voidSale, markPrinted };
