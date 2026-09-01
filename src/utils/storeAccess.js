const {
  storeScope,
  canAccessStore,
  denyStore,
} = require("../middlewares/adminAuth.middleware");

const idOf = (value) => {
  if (!value) return null;
  return value._id || value;
};

const assertStore = (req, res, storeId) => {
  if (!canAccessStore(req, storeId)) {
    denyStore(res);
    return false;
  }
  return true;
};

module.exports = {
  storeScope,
  canAccessStore,
  denyStore,
  idOf,
  assertStore,
};
