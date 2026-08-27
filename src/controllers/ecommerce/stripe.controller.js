const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Order = require("../../models/order.model");

const createCheckoutSession = async (req, res) => {
  try {
    const { product, orderDetail } = req.body;

    // TODO: It's better to calculate the amount on the backend
    // to prevent manipulation from the client side.

    const newOrder = await Order.create(orderDetail);

    const lineitems = product.product_details.map((item) => ({
      price_data: {
        currency: "aud",
        product_data: {
          name: item.product.name,
          // FIXME: Use environment variables for base URL
          images: [`${process.env.API_BASE_URL}/images/${item.product.cover}`],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineitems,
      mode: "payment",
      // FIXME: Use environment variables for success and cancel URLs
      success_url: `${process.env.ECOMMERCE_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.ECOMMERCE_BASE_URL}/failed?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        orderId: newOrder._id.toString(),
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation failed:", error);
    res.status(500).json({ error: "Failed to create Stripe session." });
  }
};

const fetchSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    res.status(200).json({ session });
  } catch (error) {
    console.error("Failed to fetch Stripe session:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCheckoutSession,
  fetchSession,
};
