const mercadopago = require("mercadopago");

// Configure MercadoPago with access token from environment variables
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || "TEST-5452904587884616-070811-5c5f10c51ac99fe1580a358884ccd136-1412025676",
});

/**
 * Creates a MercadoPago preference for a pending order.
 * @param {string|number} pendingOrderId - The ID of the order in the database.
 * @param {Array} itemsBody - Array of items to be paid for.
 * @returns {Promise<Object>} - Object containing the preference ID.
 */
const createPreferenceController = async (pendingOrderId, itemsBody) => {
  if (!pendingOrderId) throw new Error("Missing pendingOrderId");
  if (!itemsBody || !Array.isArray(itemsBody) || itemsBody.length === 0) {
    throw new Error("Invalid or empty itemsBody");
  }

  const preference = {
    metadata: { relatedOrderId: pendingOrderId },
    items: itemsBody.map(item => ({
      title: item.title,
      unit_price: Number(item.unit_price),
      quantity: Number(item.quantity),
      currency_id: "ARS" // Or your default currency
    })),
    back_urls: {
      success: process.env.PAYMENT_SUCCESS_URL || "https://viandaexpress.vercel.app/payment",
      failure: process.env.PAYMENT_FAILURE_URL || "https://viandaexpress.vercel.app/payment",
      pending: process.env.PAYMENT_PENDING_URL || "https://viandaexpress.vercel.app/payment",
    },
    auto_return: "approved",
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    return {
      id: response.body.id,
    };
  } catch (error) {
    console.error("Error creating MercadoPago preference:", error);
    throw new Error(`Failed to create payment preference: ${error.message}`);
  }
};

module.exports = { createPreferenceController };
