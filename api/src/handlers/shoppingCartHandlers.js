const { createPreferenceController } = require("../controllers/mercadopagoControllers/createPreferenceController");
const { paymentDataController } = require("../controllers/mercadopagoControllers/paymentDataController");
const { getPendingOrderByUserEmailController } = require("../controllers/orderControllers/getPendingOrderByUserEmailController");

const createPreferenceHandler = async (req, res, next) => {
  const { userEmail } = req.params;
  const items = req.body;
  try {
    if (!userEmail) throw new Error("User email is required");
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Items array is required in body");
    }

    const itemsBody = items.map((item) => {
      if (!item.Food?.name || !item.final_price || !item.quantity) {
        throw new Error("Invalid item structure in cart");
      }
      return {
        title: item.Food.name,
        unit_price: Number(item.final_price),
        quantity: Number(item.quantity),
      };
    });

    const pendingOrderId = await getPendingOrderByUserEmailController(userEmail);
    if (!pendingOrderId) throw new Error("No pending order found for this user");

    const preference = await createPreferenceController(pendingOrderId, itemsBody);
    res.status(200).json(preference);
  } catch (error) {
    next(error);
  }
};

const paymentDataHandler = async (req, res, next) => {
  const paymentId = req.query["data.id"] || req.query.id;
  try {
    if (!paymentId) throw new Error("Payment ID (data.id) is missing in query");
    const paymentData = await paymentDataController(paymentId);
    res.status(200).json({ message: "Webhook processed", data: paymentData });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPreferenceHandler, paymentDataHandler };
