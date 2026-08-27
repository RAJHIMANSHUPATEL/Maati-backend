const Subscriber = require("../../models/subscriber.model");

/**
 * Controller to add a new subscriber.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const addSubscriber = async (req, res) => {
  const { email } = req.body;
  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .send({ success: false, message: "Email is already subscribed." });
    }
    const newSubscriber = await Subscriber.create({ email });
    res.status(201).send({
      success: true,
      message: "Subscriber added successfully",
      data: newSubscriber,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: error.message });
  }
};

module.exports = { addSubscriber };
