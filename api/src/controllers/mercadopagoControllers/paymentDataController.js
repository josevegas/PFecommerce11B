const axios = require("axios");
const { putOrderController } = require("../orderControllers/putOrderController");

/**
 * Fetches payment data from MercadoPago and updates the corresponding order.
 * @param {string|number} paymentId - The payment ID from MercadoPago.
 */
const paymentDataController = async (paymentId) => {
  if (!paymentId) throw new Error("Missing paymentId");

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || "TEST-5452904587884616-070811-5c5f10c51ac99fe1580a358884ccd136-1412025676";

  try {
    const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;
    
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const relatedOrderId = data.metadata?.related_order_id;
    if (!relatedOrderId) {
      console.warn(`No related order ID found for payment ${paymentId}`);
      return;
    }

    const statusMapping = {
      approved: "APROBADO",
      rejected: "RECHAZADO",
      in_process: "EN PROCESO",
      pending: "PENDIENTE",
      cancelled: "CANCELADO"
    };

    const paymentStatusToDb = statusMapping[data.status] || "PENDIENTE";

    await putOrderController({
      orderId: relatedOrderId,
      status: paymentStatusToDb,
      payment_status_detail: data.status_detail || null,
      payment_id: paymentId,
      payment_date: data.date_approved || null,
    });

    return { success: true, orderId: relatedOrderId, status: paymentStatusToDb };
  } catch (error) {
    console.error(`Error processing payment data for ID ${paymentId}:`, error.message);
    throw new Error(`Failed to process payment data: ${error.message}`);
  }
};

module.exports = { paymentDataController };
