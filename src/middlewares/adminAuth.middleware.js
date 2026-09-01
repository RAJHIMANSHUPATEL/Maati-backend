const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const OWNERS = new Set(["owner", "admin"]);
const CRM_STAFF = new Set(["owner", "admin", "manager"]);
const TILL_STAFF = new Set(["owner", "admin", "manager", "cashier"]);

const isOwner = (user) => OWNERS.has(user?.type);
const staffRole = (user) => (user?.type === "admin" ? "owner" : user?.type);

const storeIds = (user) => (user?.stores || []).map((id) => String(id._id || id));

const storeScope = (req, field = "store") => {
  if (isOwner(req.admin)) return {};
  return { [field]: { $in: req.admin.stores || [] } };
};

const canAccessStore = (req, storeId) => {
  if (!storeId) return false;
  if (isOwner(req.admin)) return true;
  return storeIds(req.admin).includes(String(storeId));
};

const denyStore = (res) =>
  res.status(403).json({ success: false, message: "Not allowed for this store" });

const loadCrmUser = async (req, res) => {
  const token = req.header("AuthToken");
  if (!token) {
    res.status(401).send({ success: false, message: "Access Denied! Token is required" });
    return null;
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: data.user.id });
    if (!user || user.status !== "active") {
      res.status(401).send({ success: false, message: "Access Denied! Invalid token" });
      return null;
    }
    return user;
  } catch (error) {
    res.status(401).send({
      success: false,
      message: `Access Denied! ${error.message}`,
    });
    return null;
  }
};

const checkStaff = async (req, res, next) => {
  const user = await loadCrmUser(req, res);
  if (!user) return;
  if (!CRM_STAFF.has(user.type)) {
    return res.status(401).send({ success: false, message: "Access Denied! Invalid token" });
  }
  req.admin = user;
  next();
};

const requireOwner = async (req, res, next) => {
  const user = req.admin || (await loadCrmUser(req, res));
  if (!user) return;
  if (!isOwner(user)) {
    return res.status(403).json({ success: false, message: "Owner access required" });
  }
  req.admin = user;
  next();
};

checkStaff.checkStaff = checkStaff;
checkStaff.checkAdmin = checkStaff;
checkStaff.requireOwner = requireOwner;
checkStaff.storeScope = storeScope;
checkStaff.canAccessStore = canAccessStore;
checkStaff.denyStore = denyStore;
checkStaff.isOwner = isOwner;
checkStaff.staffRole = staffRole;
checkStaff.storeIds = storeIds;
checkStaff.OWNERS = OWNERS;
checkStaff.CRM_STAFF = CRM_STAFF;
checkStaff.TILL_STAFF = TILL_STAFF;

module.exports = checkStaff;
