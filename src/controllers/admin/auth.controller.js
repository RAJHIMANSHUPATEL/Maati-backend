const { staffRole } = require("../../middlewares/adminAuth.middleware");

const verifyUser = async (req, res) => {
  const user = req.admin;
  res.status(200).send({
    success: true,
    message: "Token verified",
    data: {
      _id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      type: staffRole(user),
      stores: user.stores || [],
    },
  });
};

module.exports = {
  verifyUser,
};
