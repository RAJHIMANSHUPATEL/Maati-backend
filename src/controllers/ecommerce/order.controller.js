const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const Store = require("../../models/store.model");
const StockMovement = require("../../models/stockMovement.model");
const mongoose = require("mongoose");
const { nextOrderIdentifiers } = require("../../utils/orderNumber");
const { findValidCoupon, computeDiscount } = require("../../utils/coupon");

const parseProductDetails = (raw) => {
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const validateOrderItems = async (items, storeId) => {
  for (const item of items) {
    const productId = item.product;
    const qty = Number(item.quantity || 1);
    if (!productId || !mongoose.Types.ObjectId.isValid(productId) || qty <= 0) {
      throw new Error("Invalid product line in order");
    }
    const product = await Product.findById(productId);
    if (!product || product.status !== "active") {
      throw new Error(
        "A product in your bag is no longer available. Empty the bag and add the items again."
      );
    }
    if (String(product.store) !== String(storeId)) {
      throw new Error(
        "Some items are from a different store. Empty the bag and add items from this store."
      );
    }
    if (Number(product.quantity) < qty) {
      throw new Error(`${product.name} does not have enough stock.`);
    }
  }
};

const decrementStock = async (items, orderId) => {
  const applied = [];
  try {
    for (const item of items) {
      const productId = item.product;
      const qty = Number(item.quantity || 1);
      const updated = await Product.findOneAndUpdate(
        { _id: productId, quantity: { $gte: qty } },
        { $inc: { quantity: -qty } },
        { new: true }
      );
      if (!updated) {
        throw new Error("Insufficient stock for one or more products");
      }
      if (updated.quantity <= 0) {
        updated.stockStatus = false;
        await updated.save();
      }
      applied.push({ productId, qty, quantityAfter: updated.quantity });
      await StockMovement.create({
        product: productId,
        delta: -qty,
        quantityAfter: updated.quantity,
        reason: "order",
        order: orderId,
      });
    }
  } catch (error) {
    for (const line of applied) {
      await Product.findByIdAndUpdate(line.productId, {
        $inc: { quantity: line.qty },
        $set: { stockStatus: true },
      });
    }
    throw error;
  }
};

const restoreStock = async (items, orderId) => {
  for (const item of items) {
    const productId = item.product;
    const qty = Number(item.quantity || 1);
    if (!productId || qty <= 0) continue;
    const updated = await Product.findByIdAndUpdate(
      productId,
      { $inc: { quantity: qty }, $set: { stockStatus: true } },
      { new: true }
    );
    if (updated) {
      await StockMovement.create({
        product: productId,
        delta: qty,
        quantityAfter: updated.quantity,
        reason: "order_cancelled",
        order: orderId,
      });
    }
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id })
      .populate("store_id", "_id name")
      .populate("coupon_code")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMyOrderById = async (req, res) => {
  try {
    const id = req.query.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order id format" });
    }
    const fetchedOrder = await Order.findOne({
      _id: id,
      user_id: req.user._id,
    })
      .populate("store_id", "_id name")
      .populate("coupon_code");
    if (!fetchedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, data: fetchedOrder });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const addOrder = async (req, res) => {
  const data = req.body;
  try {
    const store = await Store.findById(data.store_id);
    if (!store) {
      return res
        .status(400)
        .json({ success: false, message: "Store not found" });
    }

    const items = parseProductDetails(data.product_details);
    if (!items.length) {
      return res
        .status(400)
        .json({ success: false, message: "Order must include products" });
    }

    try {
      await validateOrderItems(items, data.store_id);
    } catch (itemError) {
      return res.status(400).json({ success: false, message: itemError.message });
    }

    const couponCode = data.couponCode || data.coupon_code_text;
    let couponDoc = null;
    let discount = 0;
    if (couponCode) {
      const result = await findValidCoupon(couponCode, data.store_id);
      if (result.error) {
        return res.status(400).json({ success: false, message: result.error });
      }
      couponDoc = result.coupon;
      discount = computeDiscount(couponDoc, data.sub_total);
    }

    const orderType = data.order_type || data.delivery_type || "delivery";
    const deliveryCharge =
      orderType === "pickup"
        ? 0
        : Number(
            data.delivery_charge ??
              data.surcharge ??
              store.deliveryCharges ??
              0
          );
    const subTotal = Number(data.sub_total) || 0;
    const grandTotal = Math.max(0, subTotal + deliveryCharge - discount);

    const { orderNumber, uniqueId } = await nextOrderIdentifiers(data.store_id);

    const payload = {
      store_id: data.store_id,
      user_id: req.user._id,
      order_number: orderNumber,
      unique_id: uniqueId,
      product_details: JSON.stringify(items),
      sub_total: subTotal,
      surcharge: deliveryCharge,
      delivery_charge: deliveryCharge,
      discount,
      coupon_code: couponDoc ? couponDoc._id : undefined,
      grand_total: grandTotal,
      payment_mode: data.payment_mode || "cash_on_delivery",
      payment_status: "pending",
      address: data.address,
      delivery_type: orderType,
      delivery_date: data.pickup_start_date || data.pickup_date || data.delivery_date,
      order_platform: data.order_platform || "web",
      order_status: "pending",
      notes: data.notes || "",
      store_name: data.store_name || store.name,
    };

    const newOrder = await Order.create(payload);
    try {
      await decrementStock(items, newOrder._id);
    } catch (stockError) {
      await Order.findByIdAndDelete(newOrder._id);
      return res
        .status(400)
        .json({ success: false, message: stockError.message });
    }

    return res.status(201).send({
      success: true,
      message: "Order added successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ success: false, message: error.message });
  }
};

module.exports = {
  getMyOrders,
  getMyOrderById,
  addOrder,
  restoreStock,
  parseProductDetails,
};
