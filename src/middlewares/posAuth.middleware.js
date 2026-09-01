const jwt = require("jsonwebtoken");
const PosConfiguration = require("../models/posConfiguration.model");

const checkPos = async (req, res, next) => {
  const token = req.header("AuthToken");
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access Denied! Token is required" });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (data.role !== "pos" || !data.posConfigId || !data.storeId) {
      return res
        .status(401)
        .json({ success: false, message: "Access Denied! Invalid token" });
    }

    const till = await PosConfiguration.findById(data.posConfigId).populate(
      "store",
      "_id name address city status mobile pin abn"
    );
    if (!till || till.status !== "active") {
      return res
        .status(401)
        .json({ success: false, message: "This till is no longer active" });
    }
    if (String(till.store?._id || till.store) !== String(data.storeId)) {
      return res
        .status(401)
        .json({ success: false, message: "Access Denied! Invalid token" });
    }
    if (till.store?.status === "deactive") {
      return res
        .status(401)
        .json({ success: false, message: "Store is deactivated" });
    }

    req.pos = {
      posConfigId: till._id,
      posName: till.pos_name,
      storeId: till.store._id,
      store: till.store,
      surcharge: Number(till.surcharge || 0),
      cashierId: data.cashierId || null,
      staffRole: data.staffRole || null,
      cashierName: data.cashierName || null,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Access Denied! ${error.message}`,
    });
  }
};

const requireCashier = (req, res, next) => {
  if (!req.pos?.cashierId) {
    return res.status(403).json({
      success: false,
      message: "Cashier sign-on required",
    });
  }
  next();
};

module.exports = checkPos;
module.exports.requireCashier = requireCashier;
module.exports.checkPos = checkPos;
