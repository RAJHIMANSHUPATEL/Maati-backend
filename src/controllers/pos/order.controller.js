const Order = require("../../models/order.model");
const mongoose = require("mongoose");

/**
 * Controller to get order history.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getorderhistory = async (req, res) => {
    try {
        const { start_date, end_date, store } = req.body;

        // Create Date objects
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // Find orders where the date_time falls within the range
        const orders = await Order.find({
            store_id: store,
            date_time: {
                $gte: startDate,
                $lte: endDate,
            },
        }).sort({ date_time: -1 });

        res.status(200).json({
            success: true,
            orders: orders,
            message: "daily summary data fetch succesfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};


/**
 * Controller to get the total order count.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getOrderCount = async (req, res) => {
    const { start_date, end_date, store } = req.body;

    // Create Date objects
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    try {
        const totalOrders = await Order.countDocuments({
            store_id: store,
            order_type: "online",
            date_time: {
                $gte: startDate,
                $lte: endDate,
            },
        });

        res.status(200).json({ success: true, total: totalOrders });
    } catch (error) {
        console.error("Error fetching order count:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


/**
 * Controller to delete an order.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const deleteOrder = async (req, res) => {
    const { _id } = req.body;
    try {
        const existingOrder = await Order.findById(_id);
        if (!existingOrder) {
            return res
                .status(404)
                .send({ success: false, message: "Order not found." });
        }
        let deletestate = await Order.deleteOne({ _id: _id });
        res.send({ success: true, message: "deleted successfully" });
    } catch (error) {
        res.status(400).send({ message: "Something went wrong", error });
    }
};

/**
 * Controller to get the latest order by date.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {string} type - The type of order (e.g., "pos", "online").
 */
const getLatestOrderbyDate = async (req, res, type) => {
    try {
        const { start_date, end_date, store } = req.body;

        // Create Date objects
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // Find orders where the date_time falls within the range
        const orders = await Order.findOne({
            store_id: store,
            date_time: {
                $gte: startDate,
                $lte: endDate,
            },
            order_type: type,
            status: "paid",
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders: orders,
            message: "data fetched succesfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};


/**
 * Controller to update an order.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const updateOrder = async (req, res) => {
    const { _id, isPrinted } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            _id,
            { isPrinted: isPrinted },
            { new: true }
        );
        if (!updatedOrder) {
            return res
                .status(400)
                .json({ success: false, message: "Unable to Update Order" });
        }
        return res.status(200).json({ success: true, data: updatedOrder });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

/**
 * Controller to get web order history.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getweborderhistory = async (req, res) => {
    try {
        const { start_date, end_date, store } = req.body;

        // Create Date objects
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // Find orders where the date_time falls within the range
        const orders = await Order.find({
            store_id: store,
            date_time: {
                $gte: startDate,
                $lte: endDate,
            },
        })
            .populate('user_id').sort({ date_time: -1 });

        res.status(200).json({
            success: true,
            orders: orders,
            message: "daily summary data fetch succesfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

/**
 * Controller to add a new order.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const addOrder = async (req, res) => {
  const data = req.body;
  try {
    const newOrder = await Order.create(data);

    res.status(201).send({
      success: true,
      message: "Order add successfully",
      data: newOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: error.message });
  }
};

module.exports = {
    getorderhistory,
    getOrderCount,
    deleteOrder,
    getLatestOrderbyDate,
    updateOrder,
    getweborderhistory,
    addOrder,
};