const OrderCounter = require("../models/orderCounter.model");

const nextOrderIdentifiers = async (storeId) => {
  const dateKey = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const counter = await OrderCounter.findOneAndUpdate(
    { storeId, dateKey },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const storeCode = String(storeId).slice(-4).toUpperCase();
  const seq = String(counter.seq).padStart(4, "0");
  return {
    orderNumber: `ORD-${storeCode}-${dateKey}-${seq}`,
    uniqueId: `UQ-${storeCode}-${dateKey}-${seq}`,
  };
};

module.exports = { nextOrderIdentifiers };
