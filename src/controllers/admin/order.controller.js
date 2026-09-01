const Order = require("../../models/order.model");
const mongoose = require("mongoose");
const {
  restoreStock,
  parseProductDetails,
} = require("../ecommerce/order.controller");
const { storeScope, assertStore, idOf } = require("../../utils/storeAccess");

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "out_for_delivery",
  "completed",
  "cancelled",
];

const getOrder = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      const fetchedOrder = await Order.find(storeScope(req, "store_id"))
        .populate("store_id", "_id name")
        .populate("user_id", "_id first_name last_name email mobile")
        .populate("coupon_code")
        .sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: fetchedOrder });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order id format" });
    }

    const fetchedOrder = await Order.findOne({ _id: id })
      .populate("store_id", "_id name")
      .populate("user_id", "_id first_name last_name email mobile address")
      .populate("coupon_code");
    if (!fetchedOrder) {
      return res
        .status(400)
        .json({ success: false, message: "Order not found" });
    }
    if (!assertStore(req, res, idOf(fetchedOrder.store_id))) return;

    return res.status(200).json({ success: true, data: fetchedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getOrderByMonth = async (req, res) => {
  const { year } = req.body;
  const targetYear = Number(year) || new Date().getFullYear();

  try {
    const orderCount = await Order.aggregate([
      { $match: storeScope(req, "store_id") },
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedOrderCount = orderCount
      .filter((item) => item._id.year === targetYear)
      .map((item) => ({
        year: item._id.year,
        month: months[item._id.month - 1],
        orders: item.orderCount,
      }));

    res.status(200).json({
      success: true,
      orderCount: formattedOrderCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getOrderByDate = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    endDate.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      ...storeScope(req, "store_id"),
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("store_id", "_id name")
      .populate("user_id", "_id first_name last_name email")
      .sort({ createdAt: -1 });

    const revenue = orders.reduce(
      (sum, order) => sum + (Number(order.grand_total) || 0),
      0
    );

    res.status(200).json({
      success: true,
      data: orders,
      totals: {
        count: orders.length,
        revenue,
      },
      message: "Orders by date fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const getOrderByUserId = async (req, res) => {
  const { userId } = req.body;

  try {
    const orders = await Order.find({
      user_id: userId,
      ...storeScope(req, "store_id"),
    })
      .populate("store_id", "_id name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
      message: "Orders by user fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const getOrderCount = async (req, res) => {
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  try {
    const filter = { ...storeScope(req, "store_id") };
    if (start_date && end_date) {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      endDate.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }

    const [totalOrder, revenueAgg, pendingCount] = await Promise.all([
      Order.countDocuments(filter),
      Order.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: "$grand_total" } } },
      ]),
      Order.countDocuments({ ...filter, order_status: "pending" }),
    ]);

    res.status(200).json({
      success: true,
      total: totalOrder,
      revenue: revenueAgg[0]?.total || 0,
      pending: pendingCount,
    });
  } catch (error) {
    console.error("Error fetching order count:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { _id, order_status, notes } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order id" });
    }
    if (order_status && !ORDER_STATUSES.includes(order_status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: ${ORDER_STATUSES.join(", ")}`,
      });
    }

    const existing = await Order.findById(_id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (!assertStore(req, res, idOf(existing.store_id))) return;

    const previousStatus = existing.order_status;
    const updates = {};
    if (order_status) updates.order_status = order_status;
    if (typeof notes === "string") updates.notes = notes;

    const updated = await Order.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("store_id", "_id name")
      .populate("user_id", "_id first_name last_name email mobile");

    if (
      order_status === "cancelled" &&
      previousStatus !== "cancelled"
    ) {
      await restoreStock(parseProductDetails(existing.product_details), existing._id);
    }

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getOrder,
  getOrderByMonth,
  getOrderByDate,
  getOrderByUserId,
  getOrderCount,
  updateOrder,
};
