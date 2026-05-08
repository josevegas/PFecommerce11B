const { Order } = require("../../db");

/**
 * Retrieves an order by its payment ID.
 * @param {string} paymentId - The payment ID from MercadoPago.
 * @returns {Promise<Object>} - The order object.
 */
const getOrderByIdsController = async (paymentId) => {
  if (!paymentId) throw new Error("paymentId is required");

  try {
    const order = await Order.findOne({
      where: { payment_id: paymentId },
    });

    if (!order) {
      throw new Error(`Order with payment ID ${paymentId} not found`);
    }

    return order;
  } catch (error) {
    console.error(`Error in getOrderByIdsController for ID ${paymentId}:`, error.message);
    throw new Error(error.message || "Failed to retrieve order by payment ID");
  }
};

module.exports = { getOrderByIdsController };
