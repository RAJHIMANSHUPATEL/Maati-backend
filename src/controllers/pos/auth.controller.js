const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const PosConfiguration = require("../../models/posConfiguration.model");
const User = require("../../models/user.model");
const {
  TILL_STAFF,
  isOwner,
  staffRole,
  storeIds,
} = require("../../middlewares/adminAuth.middleware");

const tillPayload = (till, cashier = null) => {
  const payload = {
    role: "pos",
    posConfigId: till._id,
    storeId: till.store._id,
  };
  if (cashier) {
    payload.cashierId = cashier._id;
    payload.staffRole = staffRole(cashier);
    payload.cashierName = `${cashier.first_name || ""} ${cashier.last_name || ""}`.trim();
  }
  return payload;
};

const signTillToken = (till, cashier = null) =>
  jwt.sign(tillPayload(till, cashier), process.env.JWT_SECRET, { expiresIn: "12h" });

const tillData = (till) => ({
  posConfigId: till._id,
  posName: till.pos_name,
  surcharge: Number(till.surcharge || 0),
  store: till.store,
});

const staffAssignedToStore = (user, storeId) => {
  if (isOwner(user)) return true;
  return storeIds(user).includes(String(storeId));
};

const listTills = async (req, res) => {
  try {
    const tills = await PosConfiguration.find({ status: "active" })
      .select("_id pos_name store")
      .populate("store", "_id name city")
      .sort({ pos_name: 1 });
    return res.status(200).json({ success: true, data: tills });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const unlockTill = async (req, res) => {
  try {
    const { posId, pin } = req.body;
    if (!mongoose.Types.ObjectId.isValid(posId)) {
      return res.status(400).json({ success: false, message: "Invalid till" });
    }

    const till = await PosConfiguration.findById(posId).populate(
      "store",
      "_id name address city status mobile pin abn"
    );
    if (!till || till.status !== "active") {
      return res.status(400).json({ success: false, message: "Till not found" });
    }
    if (till.store?.status === "deactive") {
      return res
        .status(400)
        .json({ success: false, message: "Store is deactivated" });
    }
    if (String(till.pos_pin) !== String(pin)) {
      return res.status(401).json({ success: false, message: "Wrong PIN" });
    }

    return res.status(200).json({
      success: true,
      token: signTillToken(till),
      data: tillData(till),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const signOn = async (req, res) => {
  try {
    const { staff_code, pin } = req.body;
    const user = await User.findOne({
      staff_code: String(staff_code),
      status: "active",
    });
    if (
      !user ||
      !TILL_STAFF.has(user.type) ||
      String(user.staff_pin) !== String(pin) ||
      !staffAssignedToStore(user, req.pos.storeId)
    ) {
      return res.status(401).json({ success: false, message: "Wrong operator or PIN" });
    }

    const till = await PosConfiguration.findById(req.pos.posConfigId).populate(
      "store",
      "_id name address city status mobile pin abn"
    );

    return res.status(200).json({
      success: true,
      token: signTillToken(till, user),
      data: {
        ...tillData(till),
        cashier: {
          _id: user._id,
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          staff_code: user.staff_code,
          role: staffRole(user),
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const signOff = async (req, res) => {
  try {
    const till = await PosConfiguration.findById(req.pos.posConfigId).populate(
      "store",
      "_id name address city status mobile pin abn"
    );
    return res.status(200).json({
      success: true,
      token: signTillToken(till),
      data: tillData(till),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { listTills, unlockTill, signOn, signOff };
